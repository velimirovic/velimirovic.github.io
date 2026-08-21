import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The strip at the very top of both pages: two small mono items pushed apart, then the
 * 2px rule. Content is projected because the two pages put different things in it.
 */
@Component({
  selector: 'app-header-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strip pad label">
      <ng-content select="[left]" />
      <ng-content select="[right]" />
    </div>
    <div class="rule"></div>
  `,
  styles: `
    .strip {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding-top: 22px;
      padding-bottom: 22px;
    }
  `,
})
export class HeaderStrip {}
