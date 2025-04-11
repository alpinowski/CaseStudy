import { fixture, html, expect } from '@open-wc/testing';
import './employee-form.js';

const mockEmployee = {
  id: 1,
  firstName: 'Ali',
  lastName: 'Balta',
  email: 'ali@example.com',
  phone: '1234567890',
  department: 'Tech',
  position: 'Senior'
};

describe('EmployeeForm Component', () => {
  it('renders empty form by default', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.shadowRoot.querySelector('input[name="firstName"]').value).to.equal('');
  });

  it('renders form with employee data when editing', async () => {
    const el = await fixture(html`<employee-form .employee=${mockEmployee}></employee-form>`);
    expect(el.shadowRoot.querySelector('input[name="firstName"]').value).to.equal('Ali');
  });

  it('fires save event with employee data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const input = el.shadowRoot.querySelector('input[name="firstName"]');
    input.value = 'Test';
    input.dispatchEvent(new Event('input'));

    setTimeout(() => el.shadowRoot.querySelector('form').dispatchEvent(new Event('submit')));

    const event = await oneEvent(el, 'save-employee');
    expect(event.detail.firstName).to.equal('Test');
  });

  it('clears form after cancel', async () => {
    const el = await fixture(html`<employee-form .employee=${mockEmployee}></employee-form>`);
    el.shadowRoot.querySelector('button.cancel').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input[name="firstName"]').value).to.equal('');
  });
});
