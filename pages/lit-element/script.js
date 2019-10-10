import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { until } from 'https://unpkg.com/lit-html/directives/until?module';
import './my-form.js';

class MyLogin extends LitElement {
  static get properties() {
    return {
      attempts: { type: Number },
      failed: { type: Boolean },
      successed: { type: Boolean },
      isLoading: { type: Boolean },
      messageRequest: { type: String },
      hints: { type: Array },
      attemptsAllowed: { type: Number }
    };
  }

  constructor() {
    super();
    this.attempts = 0;
    this.failed = false;
    this.successed = false;
    this.isLoading = false;
    this.hints = [];
  }

  updated(changedProperties) {
    if (changedProperties.has('failed') && this.failed) {
      this.className = 'failed';
    }
    if (changedProperties.has('successed') && this.successed) {
      this.className = 'successed';
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        background-color: #b1d3f9;
        padding: 20px;
        width: 300px;
        border-radius: 10px;
        font-family: var(--myFontFamily, 'Arial Black');
      }

      :host(.failed) .counter,
      :host(.failed) .message-request {
        color: red;
      }

      :host(.successed) .counter,
      :host(.successed) .message-request {
        color: #2e8b57;
      }

      ::slotted(img) {
        display: block;
        margin: 0 auto;
        max-width: 200px;
        padding-top: 20px;
        visibility: visible !important;
      }

      ul {
        font-size: 12px;
        color: #1d1e22;
      }

      .counter span.be-careful {
        font-size: 16px;
        text-transform: uppercase;
        color: #fc9b3d;
        margin-bottom: 0;
      }

      .counter {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        text-align: center;
        color: #41a6f7;
        font-size: 30px;
      }

      .counter span {
        width: 100%;
        font-size: 14px;
        text-transform: uppercase;
        margin-bottom: -5px;
      }

      .message-request {
        font-size: 16px;
        margin-top: 10px;
        color: #41a6f7;
      }
    `;
  }

  render() {
    return html`
      <div class="counter">
        ${this._beCareful}
        <span>Attempts</span>
        <div>
          ${this.attempts} / ${this.attemptsAllowed}
        </div>
      </div>
      ${!this.successed
        ? html`
            <my-form
              @custom-submit=${this._handleSubmit}
              ?disabled="${this.isLoading || this.failed}"
            ></my-form>
          `
        : ''}
      <span class="message-request"
        >${until(
          this.messageRequest,
          html`
            Loading...
          `
        )}</span
      >
      ${this.failed
        ? html`
            <slot name="failed"></slot>
          `
        : ''}
      ${this.successed
        ? html`
            <slot name="success"></slot>
          `
        : ''}
      <ul>
        ${this.hints.map(
          hint =>
            html`
              <li>${hint}</li>
            `
        )}
      </ul>
    `;
  }

  /* Our custom methods */
  _handleSubmit(event) {
    this.attempts += 1;
    const { email, password } = event.detail;
    this.messageRequest = new Promise(resolve => {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        if (email === 'alexey@mail.com' && password === 'alexey') {
          this.successed = true;
          return resolve('Success');
        }
        if (this.attempts >= this.attemptsAllowed) {
          this.failed = true;
          return resolve('Failed');
        }
        resolve('Try again');
      }, 1000);
    });
  }

  get _beCareful() {
    return this.attempts === this.attemptsAllowed - 1 && this.successed !== true
      ? html`
          <span class="be-careful">Be careful</span>
        `
      : '';
  }
}

customElements.define('my-login', MyLogin);
