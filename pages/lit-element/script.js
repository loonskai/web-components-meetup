import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { until } from 'https://unpkg.com/lit-html/directives/until?module';
import './my-form.js';

// TODO: Рассказать про компонент: форма входа со счетчиком неуспешных попыток
class MyLogin extends LitElement {
  // TODO: Рассказать про св-во properties
  static get properties() {
    return {
      attempts: { type: Number },
      failed: { type: Boolean },
      successed: { type: Boolean },
      isLoading: { type: Boolean },
      messageRequest: { type: String },
      hints: { type: Array },
      // TODO: Если property могут быть любого типа, аттрибуты должны быть строками. Мы можем конвертировать их в соотвествующее property с нужным нам типом
      attemptsAllowed: { type: Number },
    };
  }

  // TODO: Сказать о том, что property можно инициализировать в конструкторе класса, или как аттрибут в самой разметке
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

  // TODO: Рассказать о возможности использовать css custom properties, чтобы передавать значения переменных в shadow DOM извне
  static get styles() {
    return css`
      /* TODO: :host - это наш shadowRoot элемент. Те кто работал с Angular должны быть знакомы */
      :host {
        display: inline-block;
        background-color: #f8f7f3;
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

      /* TODO: Через псевдо-элемент ::slotted(селектор передаваемого элемента) мы можем назначать стили для элементов из Light DOM */
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

  handleSubmit(event) {
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

  /* TODO: Для computed property мы все также используем геттеры */
  get beCareful() {
    return this.attempts === this.attemptsAllowed - 1 && this.successed !== true
      ? html`
          <span class="be-careful">Be careful</span>
        `
      : '';
  }

  render() {
    return html`
      <!-- TODO: Биндинги достались в наследство от lit-html  -->
      <div class="counter">
        ${this.beCareful}
        <span>Attempts</span>
        <div>
          ${this.attempts} / ${this.attemptsAllowed}
        </div>
      </div>
      ${!this.successed
        ? // TODO: Внимание, если мы хотим использовать разметку внутри плейсхолдера, мы должны возвращать ее из функции html
          html`
            <!-- TODO: Провести параллели со Vue. Мы не можем пробрасывать методы внутрь как в React.  -->
            <my-form
              @custom-submit=${this.handleSubmit}
              ?disabled="${this.isLoading || this.failed}"
            ></my-form>
          `
        : ''}
      <!-- TODO: Рассказать про диррективу until -->
      <span class="message-request"
        >${until(
          this.messageRequest,
          html`
            Loading...
          `,
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
      <ul>
        ${this.hints.map(
          hint =>
            html`
              <li>${hint}</li>
            `,
        )}
      </ul>
    `;
  }
}

customElements.define('my-login', MyLogin);
