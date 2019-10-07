class MySearchBox extends HTMLElement {
  constructor() {
    /* TODO: Всегда при создании кастомного элемента в конструкторе вызываем super, чтобы через this обращатся ко всем всем доступным фишкам DOM Api */
    super();

    /* TODO: Заводим shadow DOM. Это не обязательно при создании кастомных элементов, используйте если вам НУЖНО инкупсулироваться от внешнего мира */
    const shadow = this.attachShadow({ mode: 'open' });

    /* TODO: Единственный способ описания содержимого компонента - DOM API. Всё. Пока. Можно писать обертки, использовать либы lit-html и lit-element, но если говорить о чистейшей нативности - только так, императивно. Можно и через innerHTML, кстати */
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');
    const title = document.createElement('h1');
    title.textContent = this.textContent || 'Default title';
    const input = document.createElement('input');
    const img = document.createElement('img');
    /* TODO: Обратите внимание на тег style. Он независм для нашего компонента, и при использовании shadow DOM не будет конфликтовать со внешними стилями */
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

    // TODO: Добавляем наши элементы в shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(input);
    wrapper.appendChild(img);
  }

  static get observedAttributes() {
    return ['value'];
  }

  // TODO: Рассказать про метод connectedCallback
  connectedCallback() {
    // Мы получаем наши элементы внутри shadowRoot c помощью геттера childElements
    const [title, input, img] = this.childElements;
    input.addEventListener('input', e => {
      this.setAttribute('value', e.target.value);
    });
    // TODO: Наш кастомный метод updateTheme будет отвечать за обновление цветов в зависимости от того, валидно или нет значение, введеное в поле. Вызываем его также при моунте компонента
    this.updateTheme();
  }

  // TODO: Рассказать про метод attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    // TODO: Run each time on every attribute change. As we have only one value attribute, we are ok, but if we have many of them we need to compare name property
    if (oldValue === newValue) return;
    const [title, input, img] = this.childElements;
    img.setAttribute('src', this.imageUrl);
    this.updateTheme();
  }

  // TODO: Наш кастомный метод. Мы используем CSS custom properties (так называемые css переменные), чтобы в зависимости от значения св-ва статус использовать внутри тега style различные цвета
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

  // TODO: Через кастомные геттеры мы можем вычислять различный свойства, получать значения аттрибутов компонентов и пр.
  get value() {
    return this.getAttribute('value').toLowerCase();
  }

  get imageUrl() {
    return `/assets/images/${
      EXISTING_NAMES.includes(this.value) ? this.value : 'default'
    }.jpg`;
  }

  get status() {
    if (RESTRICTED_NAMES.includes(this.value)) return 'invalid';
    return EXISTING_NAMES.includes(this.value) ? 'valid' : 'default';
  }

  get childElements() {
    return this.shadowRoot.querySelector('.wrapper').children;
  }
}

const { RESTRICTED_NAMES, EXISTING_NAMES } = window;

// TODO: Рассказать про API customElements
customElements.define('my-search-box', MySearchBox);
