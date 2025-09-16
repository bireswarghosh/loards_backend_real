import prisma from '../prisma/client.js';

// CREATE - Add new generic medicine
export const createGenericMedicine = async (req, res) => {
  try {
    const { name, genericName, manufacturer, strength, dosageForm, price, description } = req.body;

    await prisma.$executeRaw`
      INSERT INTO generic_medicines (name, generic_name, manufacturer, strength, dosage_form, price, description)
      VALUES (${name}, ${genericName}, ${manufacturer}, ${strength}, ${dosageForm}, ${parseFloat(price) || 0}, ${description})
    `;
    
    const medicine = await prisma.$queryRaw`
      SELECT * FROM generic_medicines WHERE id = LAST_INSERT_ID()
    `;

    res.status(201).json({
      success: true,
      message: 'Generic medicine created successfully',
      data: medicine[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating generic medicine',
      error: error.message
    });
  }
};

// READ - Get all medicines with pagination and search
export const getAllGenericMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    let medicines, total;
    
    if (search) {
      medicines = await prisma.$queryRaw`
        SELECT * FROM generic_medicines 
        WHERE name LIKE ${`%${search}%`} 
           OR generic_name LIKE ${`%${search}%`} 
           OR manufacturer LIKE ${`%${search}%`}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${skip}
      `;
      
      const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM generic_medicines 
        WHERE name LIKE ${`%${search}%`} 
           OR generic_name LIKE ${`%${search}%`} 
           OR manufacturer LIKE ${`%${search}%`}
      `;
      total = Number(countResult[0].count);
    } else {
      medicines = await prisma.$queryRaw`
        SELECT * FROM generic_medicines 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${skip}
      `;
      
      const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM generic_medicines
      `;
      total = Number(countResult[0].count);
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Generic medicines list',
      data: medicines,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching generic medicines list',
      error: error.message
    });
  }
};

// READ - Get medicine by ID
export const getGenericMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await prisma.$queryRaw`
      SELECT * FROM generic_medicines WHERE id = ${parseInt(id)}
    `;

    if (!medicine.length) {
      return res.status(404).json({
        success: false,
        message: 'Generic medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Generic medicine details',
      data: medicine[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching generic medicine details',
      error: error.message
    });
  }
};

// READ - Search medicines with dictionary-like functionality
export const searchGenericMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 5), 100);
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { genericName: { contains: query, mode: 'insensitive' } },
        { manufacturer: { contains: query, mode: 'insensitive' } },
        { strength: { contains: query, mode: 'insensitive' } },
        { dosageForm: { contains: query, mode: 'insensitive' } }
      ]
    };

    const medicines = await prisma.$queryRaw`
      SELECT * FROM generic_medicines 
      WHERE name LIKE ${`%${query}%`} 
         OR generic_name LIKE ${`%${query}%`} 
         OR manufacturer LIKE ${`%${query}%`}
         OR strength LIKE ${`%${query}%`}
         OR dosage_form LIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${limit} OFFSET ${skip}
    `;
    
    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM generic_medicines 
      WHERE name LIKE ${`%${query}%`} 
         OR generic_name LIKE ${`%${query}%`} 
         OR manufacturer LIKE ${`%${query}%`}
         OR strength LIKE ${`%${query}%`}
         OR dosage_form LIKE ${`%${query}%`}
    `;
    
    const total = Number(countResult[0].count);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: `Search results for "${query}"`,
      data: medicines,
      searchQuery: query,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in search',
      error: error.message
    });
  }
};

// UPDATE - Update medicine
export const updateGenericMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genericName, manufacturer, strength, dosageForm, price, description } = req.body;

    await prisma.$executeRaw`
      UPDATE generic_medicines 
      SET name = ${name}, 
          generic_name = ${genericName}, 
          manufacturer = ${manufacturer}, 
          strength = ${strength}, 
          dosage_form = ${dosageForm}, 
          price = ${parseFloat(price) || 0}, 
          description = ${description}
      WHERE id = ${parseInt(id)}
    `;
    
    const medicine = await prisma.$queryRaw`
      SELECT * FROM generic_medicines WHERE id = ${parseInt(id)}
    `;

    if (!medicine.length) {
      return res.status(404).json({
        success: false,
        message: 'Generic medicine not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Generic medicine updated successfully',
      data: medicine[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating generic medicine',
      error: error.message
    });
  }
};

// DELETE - Delete medicine
export const deleteGenericMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.$executeRaw`
      DELETE FROM generic_medicines WHERE id = ${parseInt(id)}
    `;
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Generic medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Generic medicine deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting generic medicine',
      error: error.message
    });
  }
};