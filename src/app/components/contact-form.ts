import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { gmailCompose, site } from '../data/site.data';
import { canPost, contactConfig } from '../data/contact.config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The contact form, built in the same idiom as the spec sheets: a cobalt mono label on the
 * left, the field on the right, a hairline between rows. It reads as a form you fill in
 * rather than a widget dropped onto the page.
 */
@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    @if (status() === 'sent') {
      <p class="sent">
        <span class="sent__mark">✓</span>
        Message sent. I read everything and usually reply within a day.
      </p>
    } @else {
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="row">
          <label for="cf-name">NAME</label>
          <input id="cf-name" type="text" formControlName="name" autocomplete="name" />
        </div>

        <div class="row">
          <label for="cf-email">EMAIL</label>
          <input id="cf-email" type="email" formControlName="email" autocomplete="email" />
        </div>

        <div class="row row--message">
          <label for="cf-message">MESSAGE</label>
          <textarea id="cf-message" rows="4" formControlName="message"></textarea>
        </div>

        <!-- Hidden from people, irresistible to bots. Off-canvas rather than display:none
             so a scripted filler still finds it. -->
        <div class="hp" aria-hidden="true">
          <label for="cf-company">Company</label>
          <input id="cf-company" type="text" formControlName="company" tabindex="-1" autocomplete="off" />
        </div>

        <div class="actions">
          <button type="submit" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Sending…' : 'Send' }}
            <span aria-hidden="true">→</span>
          </button>

          @if (invalid()) {
            <p class="note note--error">Name, a valid email and a line or two, please.</p>
          } @else if (status() === 'error') {
            <p class="note note--error">
              That did not go through. Write to
              <a [href]="mailHref" target="_blank" rel="noopener">{{ email }}</a>.
            </p>
          } @else if (!posts) {
            <p class="note">Opens Gmail in a new tab.</p>
          }
        </div>
      </form>
    }
  `,
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);

  protected readonly email = site.email;
  protected readonly mailHref = gmailCompose(site.email, contactConfig.subject);
  /** False until a Web3Forms key is configured; the form falls back to Gmail compose. */
  protected readonly posts = canPost();
  protected readonly status = signal<Status>('idle');
  protected readonly invalid = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    company: [''],
  });

  protected async submit(): Promise<void> {
    if (this.status() === 'sending') return;

    if (this.form.invalid) {
      this.invalid.set(true);
      this.form.markAllAsTouched();
      return;
    }
    this.invalid.set(false);

    const { name, email, message, company } = this.form.getRawValue();

    // Silently accept and discard anything that filled the honeypot.
    if (company) {
      this.status.set('sent');
      return;
    }

    if (!this.posts) {
      this.openGmailCompose(name, email, message);
      return;
    }

    this.status.set('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactConfig.web3formsKey,
          subject: contactConfig.subject,
          from_name: name,
          name,
          email,
          message,
        }),
      });
      if (!response.ok) throw new Error(`Web3Forms responded ${response.status}`);

      this.status.set('sent');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }

  /**
   * Fallback with no key configured: open Gmail's compose window in a new tab with the
   * message already written. A `mailto:` would hand off to whatever the operating system has
   * registered, which on a desktop with no mail client set up does nothing at all.
   */
  private openGmailCompose(name: string, email: string, message: string): void {
    const body = `${message}\n\n— ${name} (${email})`;
    window.open(gmailCompose(this.email, contactConfig.subject, body), '_blank', 'noopener');
    this.status.set('sent');
  }
}
