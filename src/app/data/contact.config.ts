/**
 * Contact form delivery.
 *
 * With a key set, the form posts to Web3Forms, which relays the message to `site.email`
 * without a backend of any kind — which is what makes it work on GitHub Pages. The key is
 * public by design: it identifies the destination inbox, it does not authorise anything.
 *
 * To switch it on:
 *   1. Go to https://web3forms.com and enter velimirovitsh@gmail.com
 *   2. Copy the access key that arrives by email
 *   3. Paste it below and redeploy
 *
 * Until then the form still works — submitting opens the visitor's mail client with the
 * message already written — so nobody is ever handed a form that silently drops what they
 * typed.
 */
export const contactConfig = {
  web3formsKey: 'c4b5759c-f553-40b8-b0f4-34b25fddd55e',
  subject: 'Portfolio — new message',
};

export const canPost = (): boolean => contactConfig.web3formsKey.trim().length > 0;
