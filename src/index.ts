import { isBrowser } from "./utils";

const MATHFIELD_TEMPLATE = document.createElement('template');
MATHFIELD_TEMPLATE.innerHTML = `
<style>
  :host { display: block; position: relative; overflow: hidden auto;}
  :host([hidden]) { display: none; }
  :host([disabled]) { opacity:  .5; }
  :host(:focus), :host(:focus-within) {
    outline: Highlight auto 1px;    /* For Firefox */
    outline: -webkit-focus-ring-color auto 1px;
  }
  :host([readonly]), :host([read-only]) { outline: none; }
</style>
<canvas></canvas>`;

export class DrawElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.append(MATHFIELD_TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  get readonly(): boolean {
    return this.hasAttribute('readonly') || this.hasAttribute('read-only');
  }

  set readonly(value: boolean) {
    const isReadonly = Boolean(value);

    // Note that `readonly` and `disabled` are "boolean attributes" as
    // per the HTML5 spec. Their value must be the empty string to indicate
    // a value of true, or they must be absent to indicate a value of false.
    // https://html.spec.whatwg.org/#boolean-attribute
    if (isReadonly) {
      this.setAttribute('readonly', '');
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('readonly');
      this.removeAttribute('read-only');
      this.removeAttribute('disabled');
    }

    this.setAttribute('aria-disabled', isReadonly ? 'true' : 'false');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    const isDisabled = Boolean(value);
    if (isDisabled) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');

    this.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
  }

  attributeChangedCallback(
    name: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    if (oldValue === newValue) return;
    const hasValue: boolean = newValue !== null;
    switch (name) {
      case 'disabled':
        this.disabled = hasValue;
        break;
      default:
    }
  }
}

export default DrawElement;

if (isBrowser() && !window.customElements?.get('draw-element')) {
  window.customElements?.define('draw-element', DrawElement);
}
