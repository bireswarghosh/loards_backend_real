// Test script to verify parameter API endpoints
import express from 'express';
import cors from 'cors';
import prisma from './prisma/client.js';

const app = express();
app.use(cors());
app.use(express.json());

// Test route to check if parameterIndoor table exists and has data
app.get('/test-parameters', async (req, res) => {
  try {
    console.log('Testing parameter API...');
    
    // Check if we can connect to database
    const parameters = await prisma.parameterIndoor.findFirst();
    
    if (!parameters) {
      // Create a default record if none exists
      const defaultParams = await prisma.parameterIndoor.create({
        data: {
          DoctotVisitInBill: 'Y',
          DoctotVisitInEst: 'Y',
          AddServiceMed: 'Y',
          ServiceMedPer: 115,
          AddServiceDiag: 'Y',
          ServiceDiagPer: 115,
          ChkOutTime: '1 PM',
          FixedServiceBed: 0,
          MedBillShow: 'Y',
          AddServiceOT: 'Y',
          StartDt: new Date('2016-04-01'),
          CopSCH: 20,
          EditTime: 'Y',
          MedAdd: 'Y',
          AddSrvDr: 'Y',
          CM: 'Y',
          COMM: 'N',
          RecColl: 'Y',
          FBYN: 'Y',
          SMoneyYN: 'Y',
          AdmChkTime: 'Y',
          GChkTime: '12:00 PM',
          MedP: 2,
          DagP: 101,
          AdmTime: '1:00 PM',
          DIRA: 'N',
          DIRF: 'N',
          DuplicateMR: 'N',
          Nirnoy: 'N',
          DIROP: 'N',
          OTDtlYN: 'Y',
          dcareeditYN: 'N',
          otherchargeheadingyn: 'N',
          tpaotherchargeyn: 'N',
          backdateentryyn: 'Y',
          fbillc: 'Y',
          bedcal: 'Y',
          admineditamtchange: 'N',
          MedAdv: 'N',
          DisFinalBill: 'Y',
          MRD: 'N',
          fbillprint: 'Y',
          pbedcal: 'Y',
          PtntNameYN: 'Y',
          sdatewisebed: 'Y',
          IndrDBName: 'HOSPITAL_DBhh',
          monthwiseadmno: 'Y',
          NoRec: 'N',
          MaxCashRec: 841460,
          RefundRecYN: 'Y',
          GSTP: 18,
          HealthCardP: 5
        }
      });
      
      res.json({ 
        success: true, 
        message: 'Default parameters created successfully',
        data: defaultParams 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Parameters found',
        data: parameters 
      });
    }
  } catch (error) {
    console.error('Error testing parameters:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection or query failed',
      error: error.message 
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/test-parameters`);
});