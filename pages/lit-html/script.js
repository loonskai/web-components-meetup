import { html, render } from 'https://unpkg.com/lit-html?module';

// Install lit-html extension

// const myTemplate = data => html`
//   <div>Hello ${data.name}</div>
//   </ br>
//   <div>Your age is ${data.age}</div>
// `;

// const template = myTemplate({ name: 'John', age: 20 });
// render(template, document.getElementById('root'));

// lit-html rerenders only changed values

// setTimeout(() => {
//   const template2 = myTemplate({ name: 'John', age: 21 });
//   render(template2, document.getElementById('root'));
// }, 1000);

const template = html`
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
    <h1>Title</h1>
    <input @input=${e => (this.value = e.target.value)} type="text" />
    <img src="" />
  </div>
`;

class LitHtmlSearchBox extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    render(template, shadow);
    this.updateTheme();
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    const [title, input, img] = this.shadowRoot.children[0].children;
    input.addEventListener('input', e => {
      this.setAttribute('value', e.target.value);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    const [title, input, img] = this.shadowRoot.children[0].children;
    img.setAttribute('src', this.imageUrl);
    input.setAttribute('class', this.inputStatus);
    this.updateStyles();
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

  /* Our custom properties */
  get value() {
    return this.getAttribute('value').toLowerCase();
  }

  get imageUrl() {
    return `/assets/images/${
      this.existingNames.includes(this.value) ? this.value : 'default'
    }.jpg`;
  }

  get status() {
    if (this.restrictedNames.includes(this.value)) return 'invalid';
    return this.existingNames.includes(this.value) ? 'valid' : 'default';
  }

  get existingNames() {
    return JSON.parse(localStorage.getItem('existingNames'));
  }

  get restrictedNames() {
    return JSON.parse(localStorage.getItem('restrictedNames'));
  }
}

customElements.define('lit-html-search-box', LitHtmlSearchBox);
