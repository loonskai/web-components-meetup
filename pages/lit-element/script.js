import {
  LitElement,
  customElement,
  property,
  html,
  css
} from 'https://unpkg.com/lit-element?module';
import { until } from 'https://unpkg.com/lit-html/directives/until?module';

class MyLoginForm extends LitElement {
  static get properties() {
    return {
      email: String,
      password: String,
      attempts: Number,
      failed: Boolean,
      successed: Boolean,
      isLoading: Boolean,
      messageRequest: String,
      // TODO: Если property могут быть любого типа, аттрибуты должны быть строками. Мы можем конвертировать их в соотвествующее property с нужным нам типом, передав в конструкторе флаг reflect: true
      attemptsAllowed: { type: Number, reflect: true }
    };
  }

  // TODO: Сказать о том, что property можно инициализировать в конструкторе класса, или как аттрибут в самой разметке
  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.hints = ['Enter your credentials', 'Press "Sign In"', 'Be happy'];
    this.attempts = 0;
    this.failed = false;
    this.successed = false;
    this.isLoading - false;
  }

  updated(changedProperties) {
    if (changedProperties.has('failed') && this.failed) {
      this.className = 'failed';
    }
    if (changedProperties.has('successed') && this.successed) {
      this.className = 'successed';
    }
  }

  // TODO: Рассказать о возможности использовать css custom properties, чтобы передавать значения переменных в shadow DOM извне
  static get styles() {
    return css`
      :host {
        display: inline-block;
        background-color: #f8f7f3;
        padding: 20px;
        width: 300px;
        border-radius: 10px;
        font-family: var(--myFontFamily, 'Arial Black');
      }

      /* TODO: Как в Angular */
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

      form {
        display: flex;
        flex-wrap: wrap;
      }

      input {
        flex-basis: 100%;
        border: none;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      input:disabled {
        color: #b5c2c8;
        background-color: #dce1e4;
      }

      input:focus,
      button:focus,
      button:active {
        outline: 0;
      }

      .message-request {
        font-size: 16px;
        margin-top: 10px;
        color: #41a6f7;
      }

      button {
        width: 100%;
        background-color: #41a6f7;
        border-radius: 5px;
        border: none;
        padding: 5px;
        text-transform: uppercase;
        color: #fff;
        cursor: pointer;
      }

      button:disabled {
        background-color: #b5c2c8;
        color: #dce1e4;
        cursor: initial;
      }
    `;
  }

  handleChange(e) {
    this[e.target.name] = e.target.value;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.fetchMessage();
  }

  fetchMessage() {
    this.attempts += 1;
    this.messageRequest = new Promise(resolve => {
      this.isLoading = true;
      const { email, password } = this;
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

  /* TODO: Раccказать про computed property */
  get beCareful() {
    return this.attempts === this.attemptsAllowed - 1 && this.successed !== true
      ? html`
          <span class="be-careful">Be careful</span>
        `
      : '';
  }

  render() {
    return html`
      <!--TODO: Указать разницу между property и attribute -->
      <!-- TODO: Слушатели событий устанавливаются либо через такие декларативы (@), через addEventListener в конструкторе и некоторых lifecycle методах  -->
      <div class="counter">
        ${this.beCareful}
        <span>Attempts</span>
        <div>
          ${this.attempts} / ${this.attemptsAllowed}
        </div>
      </div>
      ${!this.successed
        ? html`
            <form @submit=${this.handleSubmit}>
              <input
                @input=${this.handleChange}
                .value=${this.email}
                ?disabled=${this.failed}
                name="email"
                type="email"
              />
              <input
                @input=${this.handleChange}
                .value=${this.password}
                ?disabled=${this.failed}
                name="password"
                type="password"
              />
              <button ?disabled=${this.isLoading || this.failed} type="submit">
                Sign In
              </button>
            </form>
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
      <!-- TODO: Рассказать про conditionals и slots (light dom) -->
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
      <!-- TODO: Рассказать про циклы и маппинг -->
      <!--       <ul>
        ${this.hints.map(
        hint =>
          html`
            <li>${hint}</li>
          `
      )}
      </ul> -->
    `;
  }
}

customElements.define('my-login-form', MyLoginForm);
