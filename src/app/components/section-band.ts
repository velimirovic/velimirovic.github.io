import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A full-bleed cobalt band between two 2px rules, carrying one short uppercase label.
 * This is the only sectioning device in the design — there are no headings above it and
 * no cards below it.
 */
@Component({
  selector: 'app-section-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rule"></div>
    <div class="band">
      <div class="band__inner pad">{{ label() }}</div>
    </div>
    <div class="rule"></div>
  `,
  styles: `
    .band {
      background: var(--cobalt);
      color: var(--ground);
    }

    .band__inner {
      padding-top: 14px;
      padding-bottom: 14px;
      font-family: var(--font-display);
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  `,
})
export class SectionBand {
  readonly label = input.required<string>();
}
