class MySearchBox extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Create elements
    // We can use only DOM API (imperative approach)
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');
    const title = document.createElement('h1');
    title.textContent = this.textContent || 'Default title';
    const input = document.createElement('input');
    const img = document.createElement('img');
    const style = document.createElement('style');
    style.textContent = `
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
    `;

    // Attach elements to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(input);
    wrapper.appendChild(img);

    // Update theme depending on status
    this.updateTheme();
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    const [title, input, img] = this.shadowRoot.querySelector(
      '.wrapper'
    ).children;
    input.addEventListener('input', e => {
      this.setAttribute('value', e.target.value);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Run each time on every attribute change. As we have only one value attribute, we are ok, but if we have many of them we need to compare name property
    if (oldValue === newValue) return;
    const [title, input, img] = this.shadowRoot.querySelector(
      '.wrapper'
    ).children;
    img.setAttribute('src', this.imageUrl);
    this.updateTheme();
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
        mainColor = 'lightgray';
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

customElements.define('my-search-box', MySearchBox);
