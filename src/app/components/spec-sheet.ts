import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpecRow } from '../data/types';

/**
 * The right-hand column of every two-column block: hairline-separated rows with a cobalt
 * label and a value. On a phone the two columns stack, label above value.
 */
@Component({
  selector: 'app-spec-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl class="sheet" [class.sheet--fit]="fit()">
      @for (row of rows(); track row.label; let last = $last) {
        <div class="row" [class.row--last]="last">
          <dt>{{ row.label }}</dt>
          <dd>
            @if (row.links) {
              @for (link of row.links; track link.href; let i = $index) {
                @if (i > 0) {
                  <span class="sep">·</span>
                }
                <a [href]="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
              }
            } @else {
              {{ row.value }}
            }
          </dd>
        </div>
      }
    </dl>
  `,
  styles: `
    .sheet {
      display: flex;
      flex-direction: column;
    }

    // Shrinks the rules to the widest row instead of running them to the end of the column.
    // Used where the values are short and a full-width rule leaves a stretch of empty paper.
    .sheet--fit {
      width: fit-content;
      max-width: 100%;
    }

    .row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 16px;
      padding: 12px 0;
      border-top: 1px solid var(--ink);
      font-family: var(--font-display);
      font-size: 12px;
      line-height: 1.6;
    }

    .row--last {
      border-bottom: 1px solid var(--ink);
    }

    dt {
      color: var(--cobalt);
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    .sep {
      margin: 0 6px;
      color: var(--muted);
    }

    @media (max-width: 820px) {
      .row {
        grid-template-columns: 1fr;
        gap: 2px;
      }
    }
  `,
})
export class SpecSheet {
  readonly rows = input.required<SpecRow[]>();
  /** Ends the rules at the widest row rather than at the column edge. */
  readonly fit = input(false);
}
