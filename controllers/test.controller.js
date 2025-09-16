import TestModel from '../models/test.model.js';

class TestController {
  // Get all tests
  static async getAllTests(req, res) {
    try {
      const tests = await TestModel.getAllTests();
      res.json({
        success: true,
        data: tests,
        count: tests.length
        
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get tests by SubDepartmentId
  static async getTestsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const tests = await TestModel.getTestsByDepartment(departmentId);
      res.json({
        success: true,
        data: tests,
        count: tests.length,
        subDepartmentId: departmentId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get test by ID
  static async getTestById(req, res) {
    try {
      const test = await TestModel.getTestById(req.params.id);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found'
        });
      }
      res.json({
        success: true,
        data: test
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Search tests
  static async searchTests(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }
      const tests = await TestModel.searchTests(q);
      res.json({
        success: true,
        data: tests,
        count: tests.length,
        searchTerm: q
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create test
  static async createTest(req, res) {
    try {
      const testId = await TestModel.createTest(req.body);
      res.status(201).json({
        success: true,
        message: 'Test created successfully',
        testId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update test
  static async updateTest(req, res) {
    try {
      const affectedRows = await TestModel.updateTest(req.params.id, req.body);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Test not found'
        });
      }
      res.json({
        success: true,
        message: 'Test updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });                                                                                             
    }
  }

  // Delete test
  static async deleteTest(req, res) {
    try {
      const affectedRows = await TestModel.deleteTest(req.params.id);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Test not found'
        });
      }
      res.json({
        success: true,
        message: 'Test deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default TestController;