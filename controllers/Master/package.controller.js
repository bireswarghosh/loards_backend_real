import prisma from '../../prisma/client.js';
import { validationResult } from 'express-validator';

// GET all packages
export const getAllPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { PackageId: 'asc' }
    });
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET package by ID
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await prisma.package.findUnique({
      where: { PackageId: parseInt(id) }
    });
    
    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: packageData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new package
export const createPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { Package, DescId, Rate, GSTAmt } = req.body;
    
    // Get next PackageId
    const lastPackage = await prisma.package.findFirst({
      orderBy: { PackageId: 'desc' }
    });
    
    const nextId = lastPackage ? lastPackage.PackageId + 1 : 1;
    
    const newPackage = await prisma.package.create({
      data: {
        PackageId: nextId,
        Package,
        DescId: DescId ? parseInt(DescId) : null,
        Rate: Rate ? parseFloat(Rate) : null,
        GSTAmt: GSTAmt ? parseFloat(GSTAmt) : null
      }
    });
    
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE package
export const updatePackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { Package, DescId, Rate, GSTAmt } = req.body;
    
    const updatedPackage = await prisma.package.update({
      where: { PackageId: parseInt(id) },
      data: {
        Package,
        DescId: DescId ? parseInt(DescId) : null,
        Rate: Rate ? parseFloat(Rate) : null,
        GSTAmt: GSTAmt ? parseFloat(GSTAmt) : null
      }
    });
    
    res.json({ success: true, data: updatedPackage });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.package.delete({
      where: { PackageId: parseInt(id) }
    });
    
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH packages
export const searchPackages = async (req, res) => {
  try {
    const { q } = req.query;
    
    const packages = await prisma.package.findMany({
      where: {
        Package: {
          contains: q
        }
      },
      orderBy: { PackageId: 'asc' }
    });
    
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};