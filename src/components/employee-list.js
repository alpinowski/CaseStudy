import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employee-store.js';
import { getTranslation, subscribe } from '../i18n/index.js';

class EmployeeList extends LitElement {
  static styles = css`
    .container {
      padding: 2rem;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .top-bar input,
    .top-bar select {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 0.95rem;
    }

    .export-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .export-btn:hover {
      background-color: #0056b3;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    thead {
      background-color: #f9f9f9;
      text-align: left;
    }

    thead th {
      padding: 14px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      cursor: pointer;
    }

    tbody td {
      padding: 12px 20px;
      font-size: 0.92rem;
      color: #444;
      border-top: 1px solid #eee;
    }

    .actions button {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-right: 4px;
    }

    .actions button.edit {
      color: #007bff;
      border-color: #007bff;
    }

    .actions button.edit:hover {
      background-color: #007bff;
      color: #fff;
    }

    .actions button.delete {
      color: #dc3545;
      border-color: #dc3545;
    }

    .actions button.delete:hover {
      background-color: #dc3545;
      color: #fff;
    }

    .list-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .list-card {
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .list-card h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .list-card p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
      gap: 0.5rem;
    }

    .pagination button.active-page {
      background-color: #0056b3;
      color: #fff;
      font-weight: bold;
    }
  `;

  static properties = {
    employees: { state: true },
    searchTerm: { state: true },
    departmentFilter: { state: true },
    positionFilter: { state: true },
    viewMode: { state: true },
    t: { state: true },
    selectedEmployee: { state: true },
    showModal: { state: true },
    itemsPerPage: { state: true },
    currentPage: { state: true },
    sortColumn: { state: true },
    sortDirection: { state: true }
  };

  constructor() {
    super();
    this.employees = employeeStore.getEmployees();
    this.searchTerm = '';
    this.departmentFilter = 'all';
    this.positionFilter = 'all';
    this.viewMode = 'table';
    this.t = getTranslation();
    this.selectedEmployee = null;
    this.showModal = false;
    this.itemsPerPage = 5;
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';

    subscribe(() => {
      this.t = getTranslation();
      this.requestUpdate();
    });
  }

  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get sortedEmployees() {
    const employees = [...this.employees];
    if (!this.sortColumn) return employees;
    return employees.sort((a, b) => {
      const aVal = a[this.sortColumn]?.toString().toLowerCase() || '';
      const bVal = b[this.sortColumn]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  get filteredEmployees() {
    return this.sortedEmployees.filter(emp => {
      const nameMatch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      const deptMatch = this.departmentFilter === 'all' || emp.department === this.departmentFilter;
      const posMatch = this.positionFilter === 'all' || emp.position === this.positionFilter;
      return nameMatch && deptMatch && posMatch;
    });
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.currentPage = 1;
  }

  handleDepartmentFilter(e) {
    this.departmentFilter = e.target.value;
    this.currentPage = 1;
  }

  handlePositionFilter(e) {
    this.positionFilter = e.target.value;
    this.currentPage = 1;
  }

  handleItemsPerPage(e) {
    this.itemsPerPage = Number(e.target.value);
    this.currentPage = 1;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'list' : 'table';
  }

  openDeleteModal(emp) {
    this.selectedEmployee = emp;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.selectedEmployee) {
      employeeStore.deleteEmployee(this.selectedEmployee.id);
      this.employees = employeeStore.getEmployees();
      this.selectedEmployee = null;
      this.showModal = false;
    }
  }

  cancelDelete() {
    this.selectedEmployee = null;
    this.showModal = false;
  }

  editEmployee(emp) {
    window.history.pushState({}, '', `/employees/edit/${emp.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  renderTable() {
    return html`
      <table>
        <thead>
          <tr>
            <th @click=${() => this.sortBy('firstName')}>${this.t.firstName}</th>
            <th @click=${() => this.sortBy('lastName')}>${this.t.lastName}</th>
            <th @click=${() => this.sortBy('email')}>${this.t.email}</th>
            <th @click=${() => this.sortBy('phone')}>${this.t.phone}</th>
            <th @click=${() => this.sortBy('department')}>${this.t.department}</th>
            <th @click=${() => this.sortBy('position')}>${this.t.position}</th>
            <th>${this.t.actions}</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.map(emp => html`
            <tr>
              <td>${emp.firstName}</td>
              <td>${emp.lastName}</td>
              <td>${emp.email}</td>
              <td>${emp.phone}</td>
              <td>${emp.department}</td>
              <td>${emp.position}</td>
              <td class="actions">
                <button class="edit" @click=${() => this.editEmployee(emp)} title="${this.t.edit}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#007bff" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1.732 1.732L12.12 2.646l1.732-1.732a.5.5 0 0 1 .707 0l.943.943z"/>
                    <path d="M11.354 3.354 4 10.707V13h2.293l7.354-7.354-2.293-2.293z"/>
                  </svg>
                </button>
                <button class="delete" @click=${() => this.openDeleteModal(emp)} title="${this.t.delete}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v.5h4a.5.5 0 0 1 0 1H13v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7H1a.5.5 0 0 1 0-1h4v-.5zM6.118 1.5a1 1 0 0 1 .993.883L7.118 3h1.764l.007-.117a1 1 0 0 1 .993-.883H13a1 1 0 0 1 1 1v1H2V2.5a1 1 0 0 1 1-1h3.118z"/>
                  </svg>
                </button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="list-view">
        ${this.paginatedEmployees.map(emp => html`
          <div class="list-card">
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <p><strong>${this.t.email}:</strong> ${emp.email}</p>
            <p><strong>${this.t.phone}:</strong> ${emp.phone}</p>
            <p><strong>${this.t.department}:</strong> ${emp.department}</p>
            <p><strong>${this.t.position}:</strong> ${emp.position}</p>
            <div class="actions">
              <button class="edit" @click=${() => this.editEmployee(emp)}>${this.t.edit}</button>
              <button class="delete" @click=${() => this.openDeleteModal(emp)}>${this.t.delete}</button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderPagination() {
    return html`
      <div class="pagination">
        <button
          class="export-btn"
          ?disabled=${this.currentPage === 1}
          @click=${() => this.currentPage--}
        >${this.t.previous || 'Previous'}</button>

        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(page => html`
          <button
            class="export-btn ${this.currentPage === page ? 'active-page' : ''}"
            @click=${() => this.currentPage = page}
          >${page}</button>
        `)}

        <button
          class="export-btn"
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this.currentPage++}
        >${this.t.next || 'Next'}</button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="top-bar">
        <input
          type="text"
          .value=${this.searchTerm}
          placeholder="${this.t.search || 'Search...'}"
          @input=${this.handleSearch}
        />


          <select .value=${this.departmentFilter} @change=${this.handleDepartmentFilter}>
          <option value="all">${this.t?.department || 'Department'}</option>
            <option value="Tech">Tech</option>
            <option value="Analytics">Analytics</option>
          </select>

          <select .value=${this.positionFilter} @change=${this.handlePositionFilter}>
            <option value="all">${this.t.position || 'Position'}</option>
            <option value="Junior">Junior</option>
            <option value="Medior">Medior</option>
            <option value="Senior">Senior</option>
          </select>

          <select .value=${String(this.itemsPerPage)} @change=${this.handleItemsPerPage}>
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>

          <button 
            class="export-btn" 
            @click=${this.toggleViewMode}
          >
            ${this.viewMode === 'table' 
              ? this.t.listView || 'List View' 
              : this.t.tableView || 'Table View'}
          </button>
        </div>

        ${this.viewMode === 'table' 
          ? this.renderTable() 
          : this.renderListView()}

        ${this.renderPagination()}

        ${this.showModal ? html`
          <div class="modal-overlay" @click=${this.cancelDelete}></div>
          <div class="modal">
            <h2>${this.t.confirmDelete}</h2>
            <p>${this.selectedEmployee?.firstName} ${this.selectedEmployee?.lastName}</p>
            <div class="modal-buttons">
              <button class="cancel" @click=${this.cancelDelete}>${this.t.cancel}</button>
              <button class="confirm" @click=${this.confirmDelete}>${this.t.confirm}</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
