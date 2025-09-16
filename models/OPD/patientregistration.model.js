// backend/models/OPD/patientregistration.model.js
import prisma from '../../prisma/client.js';

export const createPatientRegistration = async (registrationData) => {
  return await prisma.patientregistration.create({
    data: registrationData
  });
};

export const getAllPatientRegistrations = async (page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    prisma.patientregistration.findMany({
      skip: skip,
      take: parseInt(limit),
      orderBy: { RegistrationDate: 'desc' }
    }),
    prisma.patientregistration.count()
  ]);
  
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

export const getPatientRegistrationById = async (id) => {
  return await prisma.patientregistration.findUnique({
    where: { RegistrationId: id }
  });
};

export const updatePatientRegistration = async (id, registrationData) => {
  const { RegistrationId, ...updateData } = registrationData;
  
  return await prisma.patientregistration.update({
    where: { RegistrationId: id },
    data: updateData
  });
};

export const deletePatientRegistration = async (id) => {
  return await prisma.patientregistration.delete({
    where: { RegistrationId: id }
  });
};

export const searchPatientRegistrationsByPhone = async (phone) => {
  return await prisma.patientregistration.findMany({
    where: { PhoneNo: phone },
    orderBy: { RegistrationDate: 'desc' }
  });
};