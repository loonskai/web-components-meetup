import { html, render } from 'https://unpkg.com/lit-html?module';

class LitHtmlSearchBox extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    render(this.template, this.shadowRoot);
    this.updateTheme();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    render(this.template, this.shadowRoot);
    this.updateTheme();
  }

  /* Our custom properties */
  get template() {
    return html`
      <style>
        @import url('https://fonts.googleapis.com/css?family=Fredoka+One&display=swap');
        .wrapper {
          width: 220px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          background-color: var(--main-dark-color);
          border: 10px solid var(--main-color);
          border-radius: 20px;
          padding: 10px;
          padding-bottom: 20px;
          transition: border-color 0.5s;
        }

        h1 {
          font-family: 'Fredoka One', cursive;
          font-size: 16px;
          color: var(--main-color);
          transition: color 0.5s;
        }

        input {
          border-radius: 5px;
          border: none;
          padding: 10px;
          margin-bottom: 20px;
          transition: box-shadow 0.5s;
          color: var(--main-dark-color);
          font-family: 'Fredoka One', cursive;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--main-color);
          border-radius: 5px;
          transition: box-shadow 0.5s;
        }
      </style>
      <div class="wrapper">
        <h1>${this.textContent || 'Default title'}</h1>
        <input @input=${e => this.setAttribute('value', e.target.value)} />
        <img .src="${this.imageUrl}" />
      </div>
    `;
  }

  get value() {
    return this.getAttribute('value').toLowerCase();
  }

  get imageUrl() {
    return `/assets/images/${
      EXISTING_NAMES.includes(this.value) ? this.value : 'default'
    }.jpg`;
  }

  get childElements() {
    return this.shadowRoot.querySelector('.wrapper').children;
  }

  get status() {
    if (RESTRICTED_NAMES.includes(this.value)) return 'invalid';
    return EXISTING_NAMES.includes(this.value) ? 'valid' : 'default';
  }

  /* Our custom methods */
  updateTheme() {
    let mainColor;
    switch (this.status) {
      case 'valid':
        mainColor = 'mediumspringgreen';
        break;
      case 'invalid':
        mainColor = 'red';
        break;
      default:
        mainColor = '#F0ECE9';
    }
    this.style.setProperty('--main-dark-color', '#58595B');
    this.style.setProperty('--main-color', mainColor);
  }
}

const { RESTRICTED_NAMES, EXISTING_NAMES } = window;
customElements.define('lit-html-search-box', LitHtmlSearchBox);
