class EmployeeStore {
  constructor() {
    this._load();
  }

  _load() {
    const savedEmployees = JSON.parse(localStorage.getItem('employees'));
    if (savedEmployees && Array.isArray(savedEmployees) && savedEmployees.length > 0) {
      this.employees = savedEmployees;
    } else {
      this.employees = [
        {
          id: 1,
          firstName: 'Ali',
          lastName: 'Balta',
          email: 'alibalta@company.com',
          phone: '1234567890',
          department: 'Tech',
          position: 'Senior',
          dob: '1990-01-01',
          doe: '2020-05-15',
        },
        {
          id: 2,
          firstName: 'Aysun',
          lastName: 'Kayalar',
          email: 'aysunkayalar@company.com',
          phone: '0987654321',
          department: 'Analytics',
          position: 'Junior',
          dob: '1995-07-10',
          doe: '2022-01-20',
        },
      ];
      this._sync();
    }
  }

  _sync() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  getEmployees() {
    return this.employees;
  }

  getEmployeeById(id) {
    return this.employees.find(emp => emp.id === Number(id));
  }

  addEmployee(employee) {
    employee.id = Date.now();
    this.employees.push(employee);
    this._sync();
  }

  updateEmployee(id, updatedData) {
    const index = this.employees.findIndex(emp => emp.id === Number(id));
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updatedData };
      this._sync();
    }
  }

  deleteEmployee(id) {
    this.employees = this.employees.filter(emp => emp.id !== Number(id));
    this._sync();
  }

  // ✅ Testler için gerekli method:
  setEmployees(newEmployees) {
    this.employees = newEmployees;
    this._sync();
  }
}

export const employeeStore = new EmployeeStore();
