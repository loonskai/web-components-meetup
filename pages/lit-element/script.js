import {
  LitElement,
  customElement,
  property,
  html,
  css
} from 'https://unpkg.com/lit-element?module';

class MyLoginForm extends LitElement {
  static get properties() {
    return {
      email: String,
      password: String,
      attempts: Number,
      blocked: Boolean,
      // TODO: Если property могут быть любого типа, аттрибуты должны быть строками. Мы можем конвертировать их в соотвествующее property с нужным нам типом, передав в конструкторе флаг reflect: true
      attemptsAllowed: { type: Number, reflect: true }
    };
  }

  // TODO: Сказать о том, что property можно инициализировать в конструкторе класса, или как аттрибут в самой разметке
  constructor() {
    super();
    this.email = 'test@mail.com';
    this.password = 'Testing123';
    this.hints = ['Enter your credentials', 'Press "Sign In"', 'Be happy'];
    this.attempts = 0;
    this.blocked = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('blocked') && this.blocked) {
      this.className = 'warning';
    }
  }

  // TODO: Рассказать о возможности использовать css custom properties, чтобы передавать значения переменных в shadow DOM извне
  static get styles() {
    return css`
      :host {
        display: inline-block;
        background-color: #f8f7f3;
        padding: 20px;
        max-width: 300px;
        border-radius: 10px;
        font-family: var(--myFontFamily, 'Arial Black');
      }

      /* TODO: Как в Angular */
      :host(.warning) .counter {
        color: red;
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

      .be-careful {
        font-size: 16px;
        text-transform: uppercase;
        margin: 0 auto;
        color: #fc9b3d;
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
    this.attempts += 1;
    if (this.attempts >= this.attemptsAllowed) {
      this.blocked = true;
    }
    /*     console.log('email', this.email);
    console.log('password', this.password); */
  }

  /* TODO: Раccказать про computed property */
  get beCareful() {
    return this.attempts === this.attemptsAllowed - 1
      ? html`
          <span class="be-careful">Be careful</span>
        `
      : '';
  }

  render() {
    return html`
      <!--TODO: Указать разницу между property и attribute -->
      <!-- TODO: Слушатели событий устанавливаются либо через такие декларативы (@), через addEventListener в конструкторе и некоторых lifecycle методах  -->
      <form @submit=${this.handleSubmit}>
        ${this.beCareful}
        <div class="counter">
          <span>Attempts</span>
          <div>
            ${this.attempts} / ${this.attemptsAllowed}
          </div>
        </div>
        <input
          @input=${this.handleChange}
          .value=${this.email}
          ?disabled=${this.blocked}
          name="email"
          type="email"
        />
        <input
          @input=${this.handleChange}
          .value=${this.password}
          ?disabled=${this.blocked}
          name="password"
          type="password"
        />
        <button ?disabled=${this.blocked} type="submit">Sign In</button>
      </form>
      <!-- TODO: Рассказать про conditionals и slots (light dom) -->
      ${this.blocked
        ? html`
            <slot name="warning"></slot>
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
}

customElements.define('my-login-form', MyLoginForm);
