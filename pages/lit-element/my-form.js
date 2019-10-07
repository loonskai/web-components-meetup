import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

class MyForm extends LitElement {
  static get properties() {
    return {
      email: { type: String },
      password: { type: String },
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.email = '';
    this.password = '';
  }

  static get styles() {
    return css`
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
    /* TODO: Рассказать вкратце про Custom Events */
    /* TODO: Создаем кастомное событие custom-submit, чтобы иметь возможность отловить его выше, вне shadowDOM */
    const event = new CustomEvent('custom-submit', {
      // bubbles - для того, чтобы наше событие всплывало
      bubbles: true,
      // composed - флаг, отвечающий за возможность "преодоления" границы между shadow DOM и обычного DOM
      composed: true,
      // detail - данные, которые мы хотим прокинуть вверх
      detail: { email: this.email, password: this.password },
    });

    // И диспатчим наше кастомное событие на текущем элементе
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          @input=${this.handleChange}
          .value=${this.email}
          ?disabled=${this.disabled}
          name="email"
          type="email"
        />
        <input
          @input=${this.handleChange}
          .value=${this.password}
          ?disabled=${this.disabled}
          name="password"
          type="password"
        />
        <button ?disabled=${this.disabled} type="submit">
          Sign In
        </button>
      </form>
    `;
  }
}

customElements.define('my-form', MyForm);
