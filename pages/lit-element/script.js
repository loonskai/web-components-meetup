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

      :host(.warning) {
      }

      ::slotted(img) {
        display: block;
        margin: 0 auto;
        max-width: 200px;
        padding-top: 20px;
        visibility: visible !important;
      }

      ul {
        font-size: 16px;
        color: #1d1e22;
        margin: 0;
        padding: 0;
        padding-left: 10px;
      }

      .counter {
        width: 100%;
        text-align: center;
        color: #41a6f7;
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
    console.log('email', this.email);
    console.log('password', this.password);
  }

  render() {
    return html`
      <ul>
        ${this.hints.map(
          hint =>
            html`
              <li>${hint}</li>
            `
        )}
      </ul>
      <!--TODO: Указать разницу между property и attribute -->
      <!-- TODO: Слушатели событий устанавливаются либо через такие декларативы (@), через addEventListener в конструкторе и некоторых lifecycle методах  -->
      <form @submit=${this.handleSubmit}>
        <div class="counter">${this.attempts} / ${this.attemptsAllowed}</div>
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
    `;
  }
}

customElements.define('my-login-form', MyLoginForm);
