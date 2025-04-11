import { LitElement, html, css } from 'lit';
import { initRouter } from './router.js';
import { setLang, getTranslation, subscribe, initLang } from './i18n/index.js';
import './components/employee-list.js';
import './components/employee-form.js';

export class AppRoot extends LitElement {
  static properties = {
    t: { state: true },
  };

  static styles = css`
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      padding: 1rem 2rem;
      border-bottom: 1px solid #ddd;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-container img {
      height: 32px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .actions a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
    }

    .actions a:hover {
      color: #ff6b00;
    }

    .actions button {
      background: none;
      border: none;
      font-weight: 500;
      cursor: pointer;
      font-size: 1rem;
    }

    .actions button:hover {
      color: #ff6b00;
    }
    @media (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    background-color: white;
  }

  td {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border: none;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #666;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 4px;
  }
}
  `;

  constructor() {
    super();
    initLang();
    this.t = getTranslation();
    subscribe(() => {
      this.t = getTranslation();
      this.requestUpdate();
    });
  }

  firstUpdated() {
    const outlet = this.renderRoot?.querySelector('#outlet');
    if (outlet) {
      initRouter();
    }
  }

  changeLang(lang) {
    setLang(lang);
  }

  render() {
    return html`
      <header>
        <div class="logo-container">
          <img src="public/assests/ING.png" alt="Logo" />
          <span><strong>Employee List (Table View)</strong></span>
        </div>
        <div class="actions">
          <a href="/employees">👤 ${this.t.employeeList}</a>
          <a href="/employees/new">➕ ${this.t.addNew}</a>
          <button @click=${() => this.changeLang('en')}>EN</button>
          <button @click=${() => this.changeLang('tr')}>TR</button>
        </div>
      </header>
      <div id="outlet"></div>
    `;
  }
}

customElements.define('app-root', AppRoot);
