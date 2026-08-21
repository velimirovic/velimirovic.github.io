import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Plate } from './plate';

/**
 * Decides how a given number of screenshots is laid out.
 *
 * A two-column grid leaves an orphan whenever the count is odd, which is what made the
 * earlier layout look scattered. So the rows are chosen up front and never contain a single
 * plate unless that is all there is:
 *
 *   1 → [1]           one full plate
 *   2 → [2]           a pair, no lead
 *   3 → [1, 2]        lead plate, then a pair
 *   4 → [1, 3]        lead plate, then a triple
 *   5 → [1, 2, 2]     lead plate, then two pairs
 *   6 → [1, 3, 2]
 *
 * After the lead, an odd remainder takes one row of three and the rest pair off, so no row
 * ever ends up half empty.
 */
export function plateRows(count: number): number[] {
  if (count <= 0) return [];
  if (count <= 2) return [count];

  const rows = [1];
  let rest = count - 1;

  if (rest % 2 === 1) {
    rows.push(3);
    rest -= 3;
  }
  while (rest > 0) {
    rows.push(2);
    rest -= 2;
  }

  return rows;
}

interface Row {
  /** 1-based plate indexes in this row. */
  items: number[];
  ratio: '16x9' | '16x10';
}

@Component({
  selector: 'app-plate-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Plate],
  template: `
    <div class="grid">
      @for (row of rows(); track $index; let firstRow = $first) {
        <div class="plate-row" [style.--cols]="row.items.length">
          @for (n of row.items; track n) {
            <app-plate
              [project]="project()"
              [index]="n"
              [ratio]="row.ratio"
              [sizes]="sizesFor(row.items.length)"
              [alt]="captions()[n - 1] ?? label()"
              [priority]="firstRow && n === 1"
            />
          }
        </div>
      }
    </div>
  `,
  styles: `
    .grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      // Centred inside the content column: capped plates flush to the left gutter read as
      // an accident rather than a decision.
      max-width: var(--plate-max, 860px);
      margin-inline: auto;
    }

    .plate-row {
      display: grid;
      grid-template-columns: repeat(var(--cols), 1fr);
      gap: 16px;
    }

    @media (max-width: 820px) {
      .plate-row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PlateGrid {
  /** Project folder under public/assets/projects. */
  readonly project = input.required<string>();
  readonly count = input.required<number>();
  readonly captions = input<string[]>([]);
  /** Fallback alt text when a plate has no caption. */
  readonly label = input('');

  protected readonly rows = computed<Row[]>(() => {
    const rows: Row[] = [];
    let next = 1;

    for (const size of plateRows(this.count())) {
      rows.push({
        items: Array.from({ length: size }, () => next++),
        // A full plate and a triple both sit better at 16:9; a pair is roomier at 16:10.
        ratio: size === 2 ? '16x10' : '16x9',
      });
    }

    return rows;
  });

  protected sizesFor(columns: number): string {
    const track = `(min(860px, 100vw - 128px) - ${(columns - 1) * 16}px) / ${columns}`;
    return `(max-width: 820px) calc(100vw - 40px), calc(${track})`;
  }
}
