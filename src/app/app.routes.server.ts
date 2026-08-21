import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './data/projects.data';

/** Everything is prerendered to static HTML, which is all GitHub Pages can serve. */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => projects.map((project) => ({ id: project.id })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
