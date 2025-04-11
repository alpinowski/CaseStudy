import { fixture, html, expect } from '@open-wc/testing';
import './employee-list.js';
import { employeeStore } from '../store/employee-store.js';

const mockEmployees = [
  { id: 1, firstName: 'Ali', lastName: 'Balta', email: 'alibalta@company.com', phone: '1234567890', department: 'Tech', position: 'Senior' },
  { id: 2, firstName: 'Aysun', lastName: 'Kayalar', email: 'aysunkayalar@company.com', phone: '0987654321', department: 'Analytics', position: 'Junior' }
];

// Geçici setEmployees fonksiyonu ekleyerek test çalışmasını sağlayalım
describe('EmployeeList Component', () => {
  let el;

  beforeEach(async () => {
    employeeStore.getEmployees = () => [...mockEmployees];
    employeeStore.setEmployees = (newData) => {
      mockEmployees.length = 0;
      mockEmployees.push(...newData);
    };
    employeeStore.deleteEmployee = (id) => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) mockEmployees.splice(index, 1);
    };

    el = await fixture(html`<employee-list></employee-list>`);
  });

  it('renders employees', () => {
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(mockEmployees.length);
  });

  it('filters by name', async () => {
    const input = el.shadowRoot.querySelector('input');
    input.value = 'Ali';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    await el.updateComplete;
  
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('Ali');
  });

  it('filters by department', async () => {
    const select = el.shadowRoot.querySelectorAll('select')[0];
    select.value = 'Tech';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
  
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('Tech');
  });
  

  it('paginates results', async () => {
    el.itemsPerPage = 1;
    el.currentPage = 1;
    await el.updateComplete;

    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
  });

  it('toggles view mode', async () => {
    el.toggleViewMode();
    await el.updateComplete;
    const listCards = el.shadowRoot.querySelectorAll('.list-card');
    expect(listCards.length).to.be.greaterThan(0);
  });

  it('sorts by firstName', async () => {
    el.sortBy('firstName');
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows[0].textContent.toLowerCase()).to.include('ali');
  });

  it('opens delete modal', async () => {
    const deleteBtn = el.shadowRoot.querySelector('.delete');
    deleteBtn.click();
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector('.modal');
    expect(modal).to.exist;
  });

  it('navigates to edit page', async () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const editBtn = el.shadowRoot.querySelector('.edit');
    editBtn.click();
    expect(pushStateSpy.called).to.be.true;
    pushStateSpy.restore();
  });
});
