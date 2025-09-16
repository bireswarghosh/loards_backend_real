// Controller for patient sign up, sign in, and profile management
import prisma from '../../../prisma/client.js';

// Create a new Prisma client instance
// Ensure the table has all required columns
prisma.$executeRaw`
  ALTER TABLE appointment_booking_app_patient 
  ADD COLUMN IF NOT EXISTS gender VARCHAR(10) NULL,
  ADD COLUMN IF NOT EXISTS bloodGroup VARCHAR(5) NULL,
  ADD COLUMN IF NOT EXISTS age INT NULL,
  ADD COLUMN IF NOT EXISTS weight FLOAT NULL
`.catch(err => console.error('Error adding columns:', err));

// Sign Up
export const signup = async (req, res) => {
  try {
    const { fullName, email, mobileNo, password } = req.body;
    if (!fullName || !email || !mobileNo || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if email exists
    const existingUser = await prisma.appointmentBookingAppPatient.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Create patient
    const patient = await prisma.appointmentBookingAppPatient.create({
      data: {
        fullName,
        email,
        mobileNo,
        password
      }
    });
    
    return res.status(201).json({ 
      message: 'Signup successful', 
      patient: { 
        id: patient.id, 
        fullName: patient.fullName, 
        email: patient.email, 
        mobileNo: patient.mobileNo 
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Sign In
export const signin = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;
    if (!mobileNo || !password) {
      return res.status(400).json({ message: 'mobileNo and password required' });
    }
    
    // Find patient
    const patient = await prisma.appointmentBookingAppPatient.findFirst({
      where: { mobileNo }
    });
    
    if (!patient || patient.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    return res.status(200).json({ 
      message: 'Signin successful',
      patient: { 
        id: patient.id, 
        fullName: patient.fullName, 
        email: patient.email, 
        mobileNo: patient.mobileNo,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        age: patient.age,
        weight: patient.weight
      } 
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Profile

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, mobileNo, gender, bloodGroup, age, weight } = req.body;
    
    // Find patient
    const patient = await prisma.appointmentBookingAppPatient.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Update patient - only update fields that exist in the schema
    const updatedPatient = await prisma.appointmentBookingAppPatient.update({
      where: { id: parseInt(id) },
      data: {
        fullName: fullName || patient.fullName,
        mobileNo: mobileNo || patient.mobileNo
        // We'll handle the other fields separately
      }
    });
    
    // Use raw query to update the additional fields
    await prisma.$executeRaw`
      UPDATE appointment_booking_app_patient 
      SET gender = ${gender}, 
          bloodGroup = ${bloodGroup}, 
          age = ${age ? parseInt(age) : null}, 
          weight = ${weight ? parseFloat(weight) : null} 
      WHERE id = ${parseInt(id)}
    `;
    
    // Get the updated patient
    const refreshedPatient = await prisma.appointmentBookingAppPatient.findUnique({
      where: { id: parseInt(id) }
    });
    


    return res.status(200).json({ 
      message: 'Profile updated successfully', 
      patient: { 

        id: refreshedPatient.id, 
        fullName: refreshedPatient.fullName, 
        email: refreshedPatient.email, 
        mobileNo: refreshedPatient.mobileNo,
        gender: refreshedPatient.gender,
        bloodGroup: refreshedPatient.bloodGroup,
        age: refreshedPatient.age,
        weight: refreshedPatient.weight

      } 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use raw query to get patient with all fields
    const patients = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_patient WHERE id = ${parseInt(id)}
    `;
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const patient = patients[0];
    
    return res.status(200).json({ 
      patient: { 
        id: patient.id, 
        fullName: patient.fullName, 
        email: patient.email, 
        mobileNo: patient.mobileNo,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        age: patient.age,
        weight: patient.weight
      } 
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Patient's Ambulance Bookings
export const getPatientAmbulanceBookings = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if patient exists
    const patients = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_patient WHERE id = ${parseInt(id)}
    `;
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get ambulance bookings for this patient from both tables
    const ambulancePickups = await prisma.$queryRaw`
      SELECT p.*, a.name as ambulance_name 
      FROM appointment_booking_app_ambulance_pickup p
      JOIN appointment_booking_app_ambulance a ON p.ambulance_id = a.id
      WHERE p.patient_id = ${parseInt(id)}
      ORDER BY p.createdAt DESC
    `;
    
    // Get pickup requests from the other table
    const pickupRequests = await prisma.$queryRaw`
      SELECT * FROM appointment_booking_app_pickup
      WHERE patient_id = ${parseInt(id)}
      ORDER BY createdAt DESC
    `;
    
    // Combine both results
    const allBookings = [...ambulancePickups, ...pickupRequests];
    
    return res.status(200).json({ 
      success: true,
      bookings: allBookings
    });
  } catch (err) {
    console.error('Get patient ambulance bookings error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


