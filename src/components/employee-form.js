import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employee-store.js';
import { Router } from '@vaadin/router';
import { getTranslation, subscribe } from '../i18n/index.js';

class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin-top: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    input,
    select {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    button {
      padding: 12px;
      background-color: #ff6b00;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: #e65c00;
    }

    .error {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: -0.5rem;
    }
  `;

  static properties = {
    employee: { state: true },
    editMode: { state: true },
    t: { state: true },
    errors: { state: true }
  };

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Tech',
      position: 'Junior',
      dob: '',
      doe: ''
    };
    this.editMode = false;
    this.t = getTranslation();
    this.errors = {};
    subscribe(() => {
      this.t = getTranslation();
      this.requestUpdate();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    if (window.location.pathname.includes('/edit/')) {
      const emp = employeeStore.getEmployeeById(id);
      if (emp) {
        this.employee = { ...emp };
        this.editMode = true;
      }
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };
  }

  validate() {
    const errors = {};
    const { firstName, lastName, email, phone, dob, doe } = this.employee;

    if (!firstName || firstName.length < 2) errors.firstName = 'Ad en az 2 karakter olmalı';
    if (!lastName || lastName.length < 2) errors.lastName = 'Soyad en az 2 karakter olmalı';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Geçerli bir e-posta girin';
    if (!phone || !/^\d{10,}$/.test(phone)) errors.phone = 'Geçerli bir telefon numarası girin';
    if (!dob) errors.dob = 'Doğum tarihi gerekli';
    if (!doe) errors.doe = 'İşe giriş tarihi gerekli';
    if (dob && doe && new Date(doe) < new Date(dob)) errors.doe = 'İşe giriş tarihi doğum tarihinden sonra olmalı';

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validate()) return;

    if (this.editMode) {
      employeeStore.updateEmployee(this.employee.id, this.employee);
    } else {
      employeeStore.addEmployee(this.employee);
    }
    Router.go('/employees');
  }

  render() {
    return html`
      <h2>${this.editMode ? this.t.edit : this.t.addNew}</h2>
      <form @submit=${this.handleSubmit}>
        <label>${this.t.firstName}</label>
        <input name="firstName" .value=${this.employee.firstName} @input=${this.handleInput} required />
        ${this.errors.firstName ? html`<div class="error">${this.errors.firstName}</div>` : ''}

        <label>${this.t.lastName}</label>
        <input name="lastName" .value=${this.employee.lastName} @input=${this.handleInput} required />
        ${this.errors.lastName ? html`<div class="error">${this.errors.lastName}</div>` : ''}

        <label>${this.t.email}</label>
        <input name="email" type="email" .value=${this.employee.email} @input=${this.handleInput} required />
        ${this.errors.email ? html`<div class="error">${this.errors.email}</div>` : ''}

        <label>${this.t.phone}</label>
        <input name="phone" .value=${this.employee.phone} @input=${this.handleInput} required />
        ${this.errors.phone ? html`<div class="error">${this.errors.phone}</div>` : ''}

        <label>${this.t.dob}</label>
        <input name="dob" type="date" .value=${this.employee.dob} @input=${this.handleInput} required />
        ${this.errors.dob ? html`<div class="error">${this.errors.dob}</div>` : ''}

        <label>${this.t.doe}</label>
        <input name="doe" type="date" .value=${this.employee.doe} @input=${this.handleInput} required />
        ${this.errors.doe ? html`<div class="error">${this.errors.doe}</div>` : ''}

        <label>${this.t.department}</label>
        <select name="department" .value=${this.employee.department} @change=${this.handleInput}>
          <option value="Analytics">Analytics</option>
          <option value="Tech">Tech</option>
        </select>

        <label>${this.t.position}</label>
        <select name="position" .value=${this.employee.position} @change=${this.handleInput}>
          <option value="Junior">Junior</option>
          <option value="Medior">Medior</option>
          <option value="Senior">Senior</option>
        </select>

        <button type="submit">
          ${this.editMode ? this.t.edit : this.t.addNew}
        </button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
