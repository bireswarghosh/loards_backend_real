import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prisma/client.js';


dotenv.config();
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression for faster response
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Rate limiting - More generous limits for API usage
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to 1000 requests per 15 minutes
  message: 'Too many requests, please try again later'
});
app.use('/api/', apiLimiter);

// CORS configuration to allow requests from multiple origins
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      
      // Define allowed origins
      const allowedOrigins = [
        'https://lordshealthcare.vercel.app',
        'http://192.168.137.107:3000',
        'https://fdp20f53-3000.inc1.devtunnels.ms',
        'https://fdp20f53-5000.inc1.devtunnels.ms',
        'https://xrk77z9r-5000.inc1.devtunnels.ms/',
        'https://xrk77z9r-3000.inc1.devtunnels.ms',
        'https://xrk77z9r-5000.inc1.devtunnels.ms',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ];
      
      if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Body parser middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session config
app.use(
  session({


    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict' // CSRF protection



    }
  })
);

// Request ID for tracking
app.use((req, res, next) => {
  req.id = Date.now().toString();
  next();
});

// Path checker middleware
import { pathCheckerMiddleware } from './middleware/path-checker.middleware.js';
app.use(pathCheckerMiddleware);

// Routes
import authRoutes from './routes/auth.router.js';
import zoneRoutes from './routes/OPD/zone.router.js';
import admissionRoutes from './routes/OPD/admission.router.js';
import moneyReceiptRoutes from './routes/OPD/moneyreceipt.router.js';
import patientregistrationRoutes from './routes/OPD/patientregistration.router.js';
import outdoorbillmstRoutes from './routes/OPD/outdoorbillmst.router.js';
import patientWithBillsRoutes from './routes/OPD/patient-with-bills.router.js';
import outdoorVisitEntryRoutes from './routes/OPD/outdoor-visit-entry.router.js';
import religionRoutes from './routes/OPD/religion.router.js';
import departmentRoutes from './routes/OPD/department.router.js';
import doctorRoutes from './routes/OPD/doctor.router.js';
import doctormasterRoutes from './routes/OPD/doctormaster.router.js';
import subdepartmentRoutes from './routes/OPD/subdepartment.router.js';
import specialityRoutes from './routes/OPD/speciality.router.js';
import doctorvisitRoutes from './routes/OPD/doctorvisit.router.js';
import doctorvisitdtRoutes from './routes/OPD/doctorvisitdt.router.js';
import doctor_visit_day from './routes/OPD/doctor_visit_day.js';
import bookingRoutes from './routes/OPD/booking.router.js';
import appointmentRoutes from './routes/appointment.router.js';
import hospitalRegistrationRoutes from './routes/hospital_registration.router.js';
import hospitalAuthRoutes from './routes/hospital_auth.router.js';
import packageRoutes from './routes/Master/package.router.js';
import packIncludeRoutes from './routes/Master/packinclude.router.js';
import parameterRoutes from './routes/Master/parameter.router.js';
import parameterOutdoorRoutes from './routes/Master/parameterOutdoor.router.js';
import serviceRoutes from './routes/Master/service.router.js';
import outdoorOtherChargeRoutes from './routes/Master/outdoorOtherCharge.router.js';
import roomNoRoutes from './routes/Master/roomNo.router.js';
import visitTypeGrpRoutes from './routes/Master/visitTypeGrp.router.js';
import chiefRoutes from './routes/Master/chief.router.js';
import diagoRoutes from './routes/Master/diago.router.js';
import pastHistoryRoutes from './routes/Master/pastHistory.router.js';
import doseRoutes from './routes/Master/dose.router.js';
import adviceRoutes from './routes/Master/advice.router.js';
import visitourRoutes from './routes/Master/visitour.router.js';
import visittypegrpRoutes from './routes/Master/visitTypeGrp.router.js';
import visittypeRoutes from './routes/Master/visittype.router.js';
import companymstRoutes from './routes/Master/companymst.router.js';
import departmentGroupRoutes from './routes/Master/Department_group.router.js';
import departmentIndoor from './routes/Master/departmentIndoor.router.js';

import bedMaster from './routes/Master/bedMaster.router.js';
import dayCare from './routes/Master/dayCare.router.js';
import otMaster from './routes/Master/otMaster.router.js';
import otSlot from './routes/Master/otSlot.router.js';
import otType from './routes/Master/otType.router.js';
import otCategory from './routes/Master/otCategory.router.js';
import otItem from './routes/Master/otItem.router.js';
import cashless from './routes/Master/cashless.router.js';
import acHead from './routes/Master/acHead.router.js';
import acGroup from './routes/Master/acGroup.router.js';
import billPrintHead from './routes/Master/billPrintHead.router.js';
import otherCharges from './routes/Master/otherCharges.router.js';
import religionMaster from './routes/Master/religion.router.js';
import referalRoutes from './routes/referal.router.js';
import mexecutiveRoutes from './routes/mexecutive.router.js';
import diseaseRoutes from './routes/disease.router.js';
import cashPaymentHeadRoutes from './routes/cashpaymenthead.router.js';
import dischargeTemplateRoutes from './routes/dischargetemplate.router.js';





// Direct patient auth routes (no auth required)
import directPatientAuthRoutes from './routes/direct-patient-auth.js';

// Appointment booking app routes
import appointmentBookingAppRoutes from './routes/appointment_booking_app/index.js';

// Ambulance routes (no auth required)
import ambulanceRoutes from './routes/ambulance.routes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import nursingRoutes from './routes/nursingRoutes.js';
import nursingBookingRoutes from './routes/nursingBookingRoutes.js';

import testRoutes from './routes/test.routes.js';
import diagnosticBookingRoutes from './routes/diagnosticBooking.routes.js';
import healthPackagesRoutes from './routes/health-packages.router.js';
import adminPackagesRoutes from './routes/admin-packages.router.js';
import prescriptionDeliveryRoutes from './routes/prescriptionDelivery.routes.js';
import genericMedicineRoutes from './routes/genericMedicine.router.js';
import acHeadGroupRoutes from './routes/acHeadGroup.router.js';
import acSubGrpRoutes from './routes/acSubGrp.router.js';
import acGenLedRoutes from './routes/acGenLed.router.js';
import agoraRoutes from './routes/agora.router.js';
import ivfBiodataRoutes from './routes/IVF/ivf-biodata.router.js';
import razorpaySettingsRoutes from './routes/razorpay-settings.router.js';
import appTermsRoutes from './routes/app-terms.router.js';
import appBannerRoutes from './routes/app-banner.router.js';
import appSocialMediaRoutes from './routes/app-social-media.router.js';




// ! OPD Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', patientregistrationRoutes);
app.use('/api/v1', outdoorbillmstRoutes);
app.use('/api/v1', patientWithBillsRoutes);
app.use('/api/v1', outdoorVisitEntryRoutes);
app.use('/api/v1', zoneRoutes);
app.use('/api/v1', admissionRoutes);
app.use('/api/v1', moneyReceiptRoutes);
app.use('/api/v1', religionRoutes);
app.use('/api/v1', departmentRoutes);
app.use('/api/v1', doctorRoutes);
app.use('/api/v1', doctormasterRoutes);
app.use('/api/v1', subdepartmentRoutes);
app.use('/api/v1', specialityRoutes);
app.use('/api/v1', doctor_visit_day);
app.use('/api/v1', bookingRoutes);

app.use('/api/v1/hospital-registration', hospitalRegistrationRoutes);
app.use('/api/v1/hospital-auth', hospitalAuthRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/includes', packIncludeRoutes);
app.use('/api/v1/parameters', parameterRoutes);
app.use('/api/v1/parameters-outdoor', parameterOutdoorRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/outdoor-other-charges', outdoorOtherChargeRoutes);
app.use('/api/v1/room-nos', roomNoRoutes);
app.use('/api/v1/visit-type-groups', visitTypeGrpRoutes);
app.use('/api/v1/chiefs', chiefRoutes);
app.use('/api/v1/diagos', diagoRoutes);
app.use('/api/v1/past-histories', pastHistoryRoutes);
app.use('/api/v1/doses', doseRoutes);
app.use('/api/v1/advices', adviceRoutes);
app.use('/api/v1/visitours', visitourRoutes);
app.use('/api/v1/visittypegrps', visittypegrpRoutes);
app.use('/api/v1/visittypes', visittypeRoutes);
app.use('/api/v1/companies', companymstRoutes);
app.use('/api/v1/department_groups', departmentGroupRoutes);
app.use('/api/v1/departmentIndoor', departmentIndoor);

app.use('/api/v1/bedMaster', bedMaster);
app.use('/api/v1/dayCare', dayCare);
app.use('/api/v1/otMaster', otMaster);
app.use('/api/v1/otSlot', otSlot);
app.use('/api/v1/otType', otType);
app.use('/api/v1/otCategory', otCategory);
app.use('/api/v1/otItem', otItem);
app.use('/api/v1/cashless', cashless);
app.use('/api/v1/acHead', acHead);
app.use('/api/v1/acGroup', acGroup);
app.use('/api/v1/billPrintHead', billPrintHead);
app.use('/api/v1/otherCharges', otherCharges);
app.use('/api/v1/religion', religionMaster);
app.use('/api/v1/referal', referalRoutes);
app.use('/api/v1/mexecutive', mexecutiveRoutes);
app.use('/api/v1/disease', diseaseRoutes);
app.use('/api/v1/cashpaymenthead', cashPaymentHeadRoutes);
app.use('/api/v1/dischargetemplate', dischargeTemplateRoutes);







// !  hear this  is  for  user app  api  routes




// Direct patient auth routes (no auth required)
app.use('/api/v1/patient-auth', directPatientAuthRoutes);

// Appointment booking app routes (no auth required)
app.use('/api/v1/appointment-booking-app', appointmentBookingAppRoutes);

// Ambulance routes (no auth required)
app.use('/api/v1/ambulance', ambulanceRoutes);

// Pickup routes (no auth required)
app.use('/api/v1/pickup', pickupRoutes);

// Nursing routes (no auth required)
app.use('/api/v1/nursing', nursingRoutes);

// Nursing booking routes (no auth required)
app.use('/api/v1/nursing-bookings', nursingBookingRoutes);

// appointment DOCTOR booking from app (no auth required)
app.use('/api/v1/appointments', appointmentRoutes);

// Test diagnostics routes (no auth required)
app.use('/api/v1/diagnostic', diagnosticBookingRoutes);
app.use('/api/v1/diagnostic/tests', testRoutes);

// Health packages routes (no auth required)
app.use('/api/v1/health-packages', healthPackagesRoutes);
app.use('/api/v1/admin/packages', adminPackagesRoutes);

// Prescription delivery routes (no auth required)
app.use('/api/v1/prescription-delivery', prescriptionDeliveryRoutes);

// Generic Medicine routes (no auth required)
app.use('/api/v1', genericMedicineRoutes);


// Razorpay Settings routes
app.use('/api/v1', razorpaySettingsRoutes);

// App Terms & Conditions routes
app.use('/api/v1', appTermsRoutes);

// App Banner routes
app.use('/api/v1', appBannerRoutes);

// App Social Media routes
app.use('/api/v1', appSocialMediaRoutes);








// AC Head & Group routes
app.use('/api/v1', acHeadGroupRoutes);

// AC Sub Groups routes
app.use('/api/v1/ac-subgroups', acSubGrpRoutes);

// AC General Ledger routes
app.use('/api/v1/ac-genled', acGenLedRoutes);

// Agora token routes
app.use('/api/v1/agora', agoraRoutes);

// IVF routes
app.use('/api/v1/ivf', ivfBiodataRoutes);









// Welcome
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error [${req.id}]:`, err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    requestId: req.id
  });
});

export default app;