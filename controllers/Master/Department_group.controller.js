import prisma from '../../prisma/client.js';

// GET all department groups
export const getAllDepartmentGroups = async (req, res) => {
  try {
    const departmentGroups = await prisma.depgroup.findMany({
      orderBy: { DepGroupId: "asc" },
    });
    res.json({ success: true, data: departmentGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get department group by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const departmentGroup = await prisma.depgroup.findUnique({
      where: { DepGroupId: parseInt(id) },
    });

    if (!departmentGroup) {
      return res.status(404).json({ success: false, message: "Department group not found" });
    }

    res.json({ success: true, data: departmentGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new department group
export const createDepartmentGroup = async (req, res) => {
  try {
    const { DepGroup, Anst, Assi, Sour } = req.body;

    // Get next DepGroupId
    const lastGroup = await prisma.depgroup.findFirst({
      orderBy: { DepGroupId: "desc" },
    });
    const nextId = lastGroup ? lastGroup.DepGroupId + 1 : 1;

    const newDepartmentGroup = await prisma.depgroup.create({
      data: {
        DepGroupId: nextId,
        DepGroup: DepGroup || null,
        Anst: Anst ? parseFloat(Anst) : null,
        Assi: Assi ? parseFloat(Assi) : null,
        Sour: Sour ? parseFloat(Sour) : null,
      },
    });

    res.json({ success: true, data: newDepartmentGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update department group
export const updateDepartmentGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepGroup, Anst, Assi, Sour } = req.body;

    const existingGroup = await prisma.depgroup.findUnique({
      where: { DepGroupId: parseInt(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ success: false, message: "Department group not found" });
    }

    const updatedGroup = await prisma.depgroup.update({
      where: { DepGroupId: parseInt(id) },
      data: {
        DepGroup: DepGroup !== undefined ? DepGroup : existingGroup.DepGroup,
        Anst: Anst !== undefined ? (Anst ? parseFloat(Anst) : null) : existingGroup.Anst,
        Assi: Assi !== undefined ? (Assi ? parseFloat(Assi) : null) : existingGroup.Assi,
        Sour: Sour !== undefined ? (Sour ? parseFloat(Sour) : null) : existingGroup.Sour,
      },
    });

    res.json({ success: true, data: updatedGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete department group
export const deleteDepartmentGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const departmentGroup = await prisma.depgroup.findUnique({
      where: { DepGroupId: parseInt(id) },
    });

    if (!departmentGroup) {
      return res.status(404).json({ success: false, message: "Department group not found" });
    }

    await prisma.depgroup.delete({
      where: { DepGroupId: parseInt(id) },
    });

    res.json({ success: true, message: "Department group deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search department groups
export const searchDepartmentGroups = async (req, res) => {
  try {
    const { search } = req.query;
    
    const departmentGroups = await prisma.depgroup.findMany({
      where: {
        DepGroup: {
          contains: search
        }
      },
      orderBy: { DepGroupId: "asc" },
    });

    res.json({ success: true, data: departmentGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  




