import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderStrip } from '../components/header-strip';
import { SectionBand } from '../components/section-band';
import { SpecSheet } from '../components/spec-sheet';
import { PlateGrid } from '../components/plate-grid';
import { ContactForm } from '../components/contact-form';
import { Seo } from '../core/seo';
import { gmailCompose, site } from '../data/site.data';
import { indexProjects, thesis } from '../data/projects.data';
import { plateCounts } from '../data/plates.generated';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeaderStrip, SectionBand, SpecSheet, PlateGrid, ContactForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  protected readonly site = site;
  protected readonly thesis = thesis;
  protected readonly projects = indexProjects;
  protected readonly year = new Date().getFullYear();
  protected readonly mailHref = gmailCompose(site.email);

  /** The grid works out its own rows from the count. */
  protected readonly thesisPlateCount = plateCounts[thesis.id] ?? 0;

  /** Only the first three spec rows appear on the home page; the rest are on the detail page. */
  protected readonly thesisSpecs = thesis.specs.slice(0, 3);

  constructor() {
    inject(Seo).apply({
      title: 'Marko Velimirović — Backend / full-stack engineer',
      description:
        'Backend and full-stack engineer in Novi Sad. Twelve projects and a thesis that runs as ' +
        'five microservices in three languages. Free from 01.09.2026.',
    });
  }
}
