// Validation script to check if Indoor Parameter Setup is working correctly
import prisma from './prisma/client.js';
import axios from 'axios';

const validateSetup = async () => {
  console.log('🔍 Validating Indoor Parameter Setup...\n');

  // 1. Check database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connection: OK');
  } catch (error) {
    console.log('❌ Database connection: FAILED');
    console.log('   Error:', error.message);
    return;
  }

  // 2. Check if parameterIndoor table exists and has data
  try {
    const parameters = await prisma.parameterIndoor.findFirst();
    if (parameters) {
      console.log('✅ Parameter table: OK (has data)');
      console.log('   Sample data:', {
        DoctotVisitInBill: parameters.DoctotVisitInBill,
        ServiceMedPer: parameters.ServiceMedPer,
        GSTP: parameters.GSTP
      });
    } else {
      console.log('⚠️  Parameter table: EXISTS but NO DATA');
      console.log('   Run the SQL script to insert default data');
    }
  } catch (error) {
    console.log('❌ Parameter table: FAILED');
    console.log('   Error:', error.message);
  }

  // 3. Check if backend server is running (if available)
  try {
    const response = await axios.get('https://xrk77z9r-5000.inc1.devtunnels.ms/api/v1/parameters', {
      timeout: 5000
    });
    console.log('✅ Backend API: OK');
    console.log('   Response status:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('⚠️  Backend API: SERVER NOT RUNNING');
      console.log('   Start the backend server with: npm start');
    } else if (error.response && error.response.status === 401) {
      console.log('✅ Backend API: OK (requires authentication)');
    } else {
      console.log('❌ Backend API: ERROR');
      console.log('   Error:', error.message);
    }
  }

  // 4. Check Prisma client generation
  try {
    const models = Object.keys(prisma);
    if (models.includes('parameterIndoor')) {
      console.log('✅ Prisma client: OK (ParameterIndoor model available)');
    } else {
      console.log('❌ Prisma client: ParameterIndoor model NOT FOUND');
      console.log('   Run: npx prisma generate');
    }
  } catch (error) {
    console.log('❌ Prisma client: ERROR');
    console.log('   Error:', error.message);
  }

  console.log('\n🎯 Validation complete!');
  console.log('\nNext steps:');
  console.log('1. If database issues: Run fix-parameter-table.sql');
  console.log('2. If API issues: Start backend server (npm start)');
  console.log('3. If Prisma issues: Run npx prisma generate');
  console.log('4. Access frontend: http://localhost:3000/IndoorParameterSetup');

  await prisma.$disconnect();
};

validateSetup().catch(console.error);