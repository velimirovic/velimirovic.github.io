import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * One screenshot at a fixed aspect ratio, square-cornered and flush to the grid.
 *
 * Images are pre-cropped to the exact ratio by tools/build-plates.mjs, so nothing is
 * cropped in CSS and no letterboxing appears. Two renditions are shipped per plate and
 * picked by `sizes`, so the 3-up row does not download full-width files.
 */
@Component({
  selector: 'app-plate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="src()"
      [srcset]="srcset()"
      [sizes]="sizes()"
      [alt]="alt()"
      [attr.loading]="priority() ? null : 'lazy'"
      [attr.fetchpriority]="priority() ? 'high' : null"
      decoding="async"
      [width]="1600"
      [height]="ratio() === '16x9' ? 900 : 1000"
    />
  `,
  styles: `
    :host {
      display: block;
      // A screenshot on an ivory ground can bleed into the page when its own background is
      // pale. The 2px cobalt keel gives every plate a definite edge.
      border: 2px solid var(--cobalt);
      background: var(--hairline);
    }

    img {
      width: 100%;
      height: auto;
    }
  `,
})
export class Plate {
  /** Project folder under public/assets/projects. */
  readonly project = input.required<string>();
  /** 1-based plate index. */
  readonly index = input.required<number>();
  readonly ratio = input<'16x9' | '16x10'>('16x9');
  readonly alt = input('');
  /** Set on the lead plate so it is not lazy-loaded. */
  readonly priority = input(false);
  /**
   * How wide this plate renders, for picking a rendition. Defaults to a lead plate: the
   * viewport less the two gutters, capped at the --plate-max used by both pages.
   */
  readonly sizes = input('(max-width: 820px) calc(100vw - 40px), min(860px, calc(100vw - 128px))');

  private readonly base = computed(
    () => `assets/projects/${this.project()}/${this.index()}-${this.ratio()}`,
  );

  protected readonly src = computed(() => `${this.base()}.webp`);
  protected readonly srcset = computed(() => `${this.base()}-800.webp 800w, ${this.base()}.webp 1600w`);
}
