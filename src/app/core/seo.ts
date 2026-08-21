import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { site } from '../data/site.data';

export interface PageMeta {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `projects/tourflo`. */
  path?: string;
  /** Path under public/, e.g. `assets/projects/shelvio/1-16x9.webp`. */
  image?: string;
}

/**
 * Sets title, description, canonical and social tags per route.
 *
 * Every route is prerendered, so these land in the static HTML — which is what LinkedIn,
 * Slack and WhatsApp read when a link is pasted, none of which run JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply({ title, description, path = '', image }: PageMeta): void {
    const url = path ? `${site.site}/${path}` : site.site;
    const card = `${site.site}/${image ?? 'assets/og-card.png'}`;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: card });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: site.name });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: card });

    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
