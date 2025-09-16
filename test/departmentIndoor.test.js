// Test endpoints for Department Indoor API
// Base URL: http://localhost:3000/api/department-indoor

const testEndpoints = {
  // GET all departments
  getAllDepartments: {
    method: 'GET',
    url: '/api/department-indoor',
    description: 'Get all departments'
  },
  
  // GET department by ID
  getDepartmentById: {
    method: 'GET',
    url: '/api/department-indoor/1',
    description: 'Get department by ID'
  },
  
  // POST create new department
  createDepartment: {
    method: 'POST',
    url: '/api/department-indoor',
    body: {
      Department: 'NEW WARD',
      DepGroupId: 1,
      MinAdv: 5000,
      MaxBalance: 50000,
      Referal: 0,
      PSL: 0,
      RateType: 0
    },
    description: 'Create new department'
  },
  
  // PUT update department
  updateDepartment: {
    method: 'PUT',
    url: '/api/department-indoor/1',
    body: {
      Department: 'UPDATED WARD',
      MinAdv: 6000
    },
    description: 'Update department'
  },
  
  // DELETE department
  deleteDepartment: {
    method: 'DELETE',
    url: '/api/department-indoor/1',
    description: 'Delete department'
  }
};

export default testEndpoints;