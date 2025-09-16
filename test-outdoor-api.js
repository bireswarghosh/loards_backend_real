import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1NDg5ODg1MywiZXhwIjoyNTEyMjgxMjUzfQ.QeHkKyameExcGYkUlP7MwoQIPDplAjNGF3NZCSRMqIw';

const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
};

async function testOutdoorParametersAPI() {
  try {
    console.log('Testing Outdoor Parameters API...\n');

    // Test GET parameters
    console.log('1. Testing GET /parameters-outdoor');
    const getResponse = await axios.get(`${BASE_URL}/parameters-outdoor`, axiosConfig);
    console.log('Response:', getResponse.data);
    console.log('✅ GET request successful\n');

    // Test PUT parameters
    console.log('2. Testing PUT /parameters-outdoor');
    const testData = {
      RegCh: 50,
      RegValid: 365,
      ValidType: 'M',
      Registration: 'Y',
      MRDosYN: 'N',
      SrvChYN: 'Y',
      DocChYN: 'Y',
      SvcChYN: 'Y',
      UserYN: 'Y',
      AsstYN: 'N',
      adminyn: 'N',
      backdateentryyn: 'Y',
      cregno: 'Y'
    };

    const putResponse = await axios.put(`${BASE_URL}/parameters-outdoor`, testData, axiosConfig);
    console.log('Response:', putResponse.data);
    console.log('✅ PUT request successful\n');

    // Test GET specific parameter
    console.log('3. Testing GET /parameters-outdoor/RegCh');
    const getFieldResponse = await axios.get(`${BASE_URL}/parameters-outdoor/RegCh`, axiosConfig);
    console.log('Response:', getFieldResponse.data);
    console.log('✅ GET field request successful\n');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testOutdoorParametersAPI();