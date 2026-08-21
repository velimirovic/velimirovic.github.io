import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { HeaderStrip } from '../components/header-strip';
import { SpecSheet } from '../components/spec-sheet';
import { PlateGrid } from '../components/plate-grid';
import { Seo } from '../core/seo';
import { projects } from '../data/projects.data';
import { plateCounts } from '../data/plates.generated';

@Component({
  selector: 'app-project',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeaderStrip, SpecSheet, PlateGrid],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class ProjectPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(Seo);

  /**
   * Read from the param stream, not the snapshot.
   *
   * Angular reuses this component when only the route parameter changes, so a snapshot read
   * in the constructor never runs again — the prev/next links would change the URL while the
   * page kept showing the previous project. The snapshot is still the initial value so that
   * prerendering has the right id on the very first pass.
   */
  private readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  protected readonly project = computed(() => projects.find((p) => p.id === this.id()) ?? null);

  /** The grid works out its own rows from the count. */
  protected readonly plateCount = computed(() => {
    const project = this.project();
    return project ? (plateCounts[project.id] ?? 0) : 0;
  });

  private readonly index = computed(() => projects.findIndex((p) => p.id === this.id()));

  // Both ends wrap, so every project has an arrow in each direction.
  protected readonly prev = computed(() => {
    const i = this.index();
    return i < 0 ? null : projects[(i - 1 + projects.length) % projects.length]!;
  });

  protected readonly next = computed(() => {
    const i = this.index();
    return i < 0 ? null : projects[(i + 1) % projects.length]!;
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) return;

      this.seo.apply({
        title: `${project.titleLines.join(' ')} — ${project.tag} — Marko Velimirović`,
        description: project.lead,
        path: `projects/${project.id}`,
        image: `assets/projects/${project.id}/1-16x9.webp`,
      });
    });
  }
}
