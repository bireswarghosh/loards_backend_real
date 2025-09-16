import prisma from '../../prisma/client.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.departmentIndoor.findMany({
      orderBy: { DepartmentId: 'asc' }
    });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await prisma.departmentIndoor.findUnique({
      where: { DepartmentId: parseInt(id) }
    });
    
    if (!department) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await prisma.departmentIndoor.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await prisma.departmentIndoor.update({
      where: { DepartmentId: parseInt(id) },
      data: req.body
    });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.departmentIndoor.delete({
      where: { DepartmentId: parseInt(id) }
    });
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};