import { 
  getAllReligions, 
//   getReligionById, 
//   createReligion, 
//   updateReligion, 
//   deleteReligion 
} from '../../models/OPD/religion.model.js';

/**
 * Get all religions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllReligionsController = async (req, res) => {
  try {
    const religions = await getAllReligions();
    res.status(200).json({
      success: true,
      count: religions.length,
      data: religions
    });
  } catch (error) {
    console.error('Error fetching religions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// /**
//  * Get religion by ID
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// export const getReligionByIdController = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const religion = await getReligionById(id);
//     if (!religion) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Religion not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: religion
//     });
//   } catch (error) {
//     console.error('Error fetching religion:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// /**
//  * Create a new religion
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// export const createReligionController = async (req, res) => {
//   const { religion_name } = req.body;
//   if (!religion_name) {
//     return res.status(400).json({ 
//       success: false,
//       message: 'religion_name is required'
//     });
//   }
//   try {
//     const religionId = await createReligion(religion_name);
//     res.status(201).json({ 
//       success: true,
//       message: 'Religion created successfully', 
//       data: { religionId }
//     });
//   } catch (error) {
//     console.error('Error creating religion:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// /**
//  * Update an existing religion
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// export const updateReligionController = async (req, res) => {
//   const { id } = req.params;
//   const { religion_name } = req.body;
//   if (!religion_name) {
//     return res.status(400).json({ 
//       success: false,
//       message: 'religion_name is required'
//     });
//   }
//   try {
//     const result = await updateReligion(id, religion_name);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Religion not found'
//       });
//     }
//     res.status(200).json({ 
//       success: true,
//       message: 'Religion updated successfully'
//     });
//   } catch (error) {
//     console.error('Error updating religion:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// /**
//  * Delete a religion
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// export const deleteReligionController = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await deleteReligion(id);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Religion not found'
//       });
//     }
//     res.status(200).json({ 
//       success: true,
//       message: 'Religion deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting religion:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };