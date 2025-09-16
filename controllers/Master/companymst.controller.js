import prisma from '../../prisma/client.js';

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.companymst.findMany({
      orderBy: { CompanyId: 'asc' }
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.companymst.findUnique({
      where: { CompanyId: parseInt(id) }
    });
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

// Create new company
export const createCompany = async (req, res) => {
  try {
    const { Company, Type } = req.body;

    // Get the next ID
    const maxIdResult = await prisma.companymst.aggregate({
      _max: { CompanyId: true }
    });
    const nextId = (maxIdResult._max.CompanyId || 0) + 1;

    const newCompany = await prisma.companymst.create({
      data: {
        CompanyId: nextId,
        Company,
        Type
      }
    });

    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { Company, Type } = req.body;

    const updatedCompany = await prisma.companymst.update({
      where: { CompanyId: parseInt(id) },
      data: { Company, Type }
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.companymst.delete({
      where: { CompanyId: parseInt(id) }
    });

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
};