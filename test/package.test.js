// Test file for Package API endpoints
// Run: npm test

const request = require('supertest');
const app = require('../app.js');

describe('Package API', () => {
  
  // Test GET all packages
  test('GET /api/packages should return all packages', async () => {
    const response = await request(app)
      .get('/api/packages')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test GET package by ID
  test('GET /api/packages/:id should return specific package', async () => {
    const response = await request(app)
      .get('/api/packages/1')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('PackageId');
  });

  // Test CREATE package
  test('POST /api/packages should create new package', async () => {
    const newPackage = {
      Package: 'TEST PACKAGE',
      DescId: 1,
      Rate: 5000,
      GSTAmt: 0
    };

    const response = await request(app)
      .post('/api/packages')
      .send(newPackage)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.Package).toBe('TEST PACKAGE');
  });

  // Test SEARCH packages
  test('GET /api/packages/search should return filtered packages', async () => {
    const response = await request(app)
      .get('/api/packages/search?q=NORMAL')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

});