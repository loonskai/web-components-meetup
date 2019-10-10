class MySearchBox extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(searchBoxTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    const [title, input, img] = this._childElements;
    input.addEventListener('input', e => {
      this.setAttribute('value', e.target.value);
    });
    title.textContent = this.title || 'Default title';
    this.updateTheme();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'value') {
      const [title, input, img] = this._childElements;
      img.setAttribute('src', this._imageUrl);
      this.updateTheme();
    }
  }

  /* My custom methods */
  updateTheme() {
    let mainColor;
    switch (this._status) {
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

  /* My custom computed properties */
  get _value() {
    return this.getAttribute('value').toLowerCase();
  }

  get _imageUrl() {
    return `/assets/images/${
      EXISTING_NAMES.includes(this._value) ? this._value : 'default'
    }.jpg`;
  }

  get _status() {
    if (RESTRICTED_NAMES.includes(this._value)) return 'invalid';
    return EXISTING_NAMES.includes(this._value) ? 'valid' : 'default';
  }

  get _childElements() {
    return this.shadowRoot.querySelector('.wrapper').children;
  }
}

const { RESTRICTED_NAMES, EXISTING_NAMES } = window;
customElements.define('my-search-box', MySearchBox);
