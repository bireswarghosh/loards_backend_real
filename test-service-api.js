import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NDg5ODg1MywiZXhwIjoyNTEyMjgxMjUzfQ.QeHkKyameExcGYkUlP7MwoQIPDplAjNGF3NZCSRMqIw';

const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
};

async function testServiceAPI() {
  try {
    console.log('🧪 Testing Service API...\n');

    // Test GET all services
    console.log('1. GET /services');
    const getResponse = await axios.get(`${BASE_URL}/services`, axiosConfig);
    console.log('✅ Response:', getResponse.data);

    // Test POST create service
    console.log('\n2. POST /services');
    const createData = {
      SERVICE: 'TEST SERVICE',
      SERVICECODE: 999
    };
    const createResponse = await axios.post(`${BASE_URL}/services`, createData, axiosConfig);
    console.log('✅ Created:', createResponse.data);
    const newId = createResponse.data.data.SERVICEId;

    // Test GET specific service
    console.log(`\n3. GET /services/${newId}`);
    const getOneResponse = await axios.get(`${BASE_URL}/services/${newId}`, axiosConfig);
    console.log('✅ Response:', getOneResponse.data);

    // Test PUT update service
    console.log(`\n4. PUT /services/${newId}`);
    const updateData = {
      SERVICE: 'UPDATED TEST SERVICE',
      SERVICECODE: 888
    };
    const updateResponse = await axios.put(`${BASE_URL}/services/${newId}`, updateData, axiosConfig);
    console.log('✅ Updated:', updateResponse.data);

    // Test DELETE service
    console.log(`\n5. DELETE /services/${newId}`);
    const deleteResponse = await axios.delete(`${BASE_URL}/services/${newId}`, axiosConfig);
    console.log('✅ Deleted:', deleteResponse.data);

    console.log('\n🎉 All Service API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testServiceAPI();