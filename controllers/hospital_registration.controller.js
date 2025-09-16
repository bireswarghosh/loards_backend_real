import * as HospitalModel from '../models/hospital_registration.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalEmail,
      hospitalType,
      phone,
      address,
      city,
      state,
      pinCode,
      noOfBeds,
      emergencyAvailable,
      ambulanceContact
    } = req.body;

    // Validate required fields
    if (!hospitalName || !hospitalEmail || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Hospital name, email and phone are required'
      });
    }

    let hospitalLogo = null;
    if (req.file) {
      hospitalLogo = req.file.filename;
    }

    const hospitalData = {
      hospitalName,
      hospitalLogo,
      hospitalEmail,
      hospitalType: hospitalType || 'Private',
      phone,
      address,
      city,
      state,
      pinCode,
      noOfBeds: noOfBeds || 0,
      emergencyAvailable: emergencyAvailable || 0,
      ambulanceContact
    };

    const hospitalId = await HospitalModel.createHospital(hospitalData);

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      data: { id: hospitalId, ...hospitalData }
    });
  } catch (error) {
    console.error('Error registering hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register hospital',
      error: error.message
    });
  }
};

export const getHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await HospitalModel.getHospitalById(id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital',
      error: error.message
    });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await HospitalModel.getAllHospitals();
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospitals',
      error: error.message
    });
  }
};

export const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const existingHospital = await HospitalModel.getHospitalById(id);
    
    if (!existingHospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    const {
      hospitalName,
      hospitalEmail,
      hospitalType,
      phone,
      address,
      city,
      state,
      pinCode,
      noOfBeds,
      emergencyAvailable,
      ambulanceContact,
      status,
      isVerified
    } = req.body;

    let hospitalLogo = existingHospital.srt_hospital_logo;
    
    // If new logo is uploaded
    if (req.file) {
      // Delete old logo if exists
      if (hospitalLogo) {
        const oldLogoPath = path.join(__dirname, '../uploads/hospitals', hospitalLogo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      hospitalLogo = req.file.filename;
    }

    const hospitalData = {
      hospitalName: hospitalName || existingHospital.srt_hospital_name,
      hospitalLogo,
      hospitalEmail: hospitalEmail || existingHospital.srt_hospital_email,
      hospitalType: hospitalType || existingHospital.srt_hospital_type,
      phone: phone || existingHospital.srt_phone,
      address: address || existingHospital.srt_address,
      city: city || existingHospital.srt_city,
      state: state || existingHospital.srt_state,
      pinCode: pinCode || existingHospital.srt_pin_code,
      noOfBeds: noOfBeds || existingHospital.srt_no_of_beds,
      emergencyAvailable: emergencyAvailable !== undefined ? emergencyAvailable : existingHospital.srt_emergency_available,
      ambulanceContact: ambulanceContact || existingHospital.srt_ambulance_contact,
      status: status || existingHospital.srt_status,
      isVerified: isVerified !== undefined ? isVerified : existingHospital.srt_is_verified
    };

    const updated = await HospitalModel.updateHospital(id, hospitalData);

    if (updated) {
      res.status(200).json({
        success: true,
        message: 'Hospital updated successfully',
        data: { id, ...hospitalData }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update hospital'
      });
    }
  } catch (error) {
    console.error('Error updating hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hospital',
      error: error.message
    });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await HospitalModel.getHospitalById(id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    // Delete hospital logo if exists
    if (hospital.srt_hospital_logo) {
      const logoPath = path.join(__dirname, '../uploads/hospitals', hospital.srt_hospital_logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    const deleted = await HospitalModel.deleteHospital(id);

    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Hospital deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete hospital'
      });
    }
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hospital',
      error: error.message
    });
  }
};