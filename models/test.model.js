import pool from '../config/db.js';

class TestModel {
  // Get all tests
  static async getAllTests() {
    const [rows] = await pool.execute('SELECT * FROM test ORDER BY TestId');
    return rows;
  }

  // Get test by ID
  static async getTestById(testId) {
    const [rows] = await pool.execute('SELECT * FROM test WHERE TestId = ?', [testId]);
    return rows[0];
  }

  // Create new test
  static async createTest(testData) {
    const {
      Test, ReportingName, SubDepartmentId, Method, Rate, DescFormat,
      DeliveryAfter, Introduction, Delivery, Interpretation, ARate, BRate,
      RSlNo, TestCode, NotReq, RateEdit, FForm, SMType, OutSource,
      IsFormulative, FormulaText, FormulaValue, NABLTag, IsDisc, NSBilling,
      ICURate, CABRate, SUITRate, SampleTypeId, ActualColName, IsProfile,
      agent, cNotReq, cost
    } = testData;

    const [result] = await pool.execute(
      `INSERT INTO test (
        Test, ReportingName, SubDepartmentId, Method, Rate, DescFormat,
        DeliveryAfter, Introduction, Delivery, Interpretation, ARate, BRate,
        RSlNo, TestCode, NotReq, RateEdit, FForm, SMType, OutSource,
        IsFormulative, FormulaText, FormulaValue, NABLTag, IsDisc, NSBilling,
        ICURate, CABRate, SUITRate, SampleTypeId, ActualColName, IsProfile,
        agent, cNotReq, cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Test, ReportingName, SubDepartmentId, Method, Rate, DescFormat,
        DeliveryAfter, Introduction, Delivery, Interpretation, ARate, BRate,
        RSlNo, TestCode, NotReq, RateEdit, FForm, SMType, OutSource,
        IsFormulative, FormulaText, FormulaValue, NABLTag, IsDisc, NSBilling,
        ICURate, CABRate, SUITRate, SampleTypeId, ActualColName, IsProfile,
        agent, cNotReq, cost
      ]
    );
    return result.insertId;
  }

  // Update test
  static async updateTest(testId, testData) {
    const {
      Test, ReportingName, SubDepartmentId, Method, Rate, DescFormat,
      DeliveryAfter, Introduction, Delivery, Interpretation, ARate, BRate,
      RSlNo, TestCode, NotReq, RateEdit, FForm, SMType, OutSource,
      IsFormulative, FormulaText, FormulaValue, NABLTag, IsDisc, NSBilling,
      ICURate, CABRate, SUITRate, SampleTypeId, ActualColName, IsProfile,
      agent, cNotReq, cost
    } = testData;

    const [result] = await pool.execute(
      `UPDATE test SET 
        Test = ?, ReportingName = ?, SubDepartmentId = ?, Method = ?, Rate = ?, DescFormat = ?,
        DeliveryAfter = ?, Introduction = ?, Delivery = ?, Interpretation = ?, ARate = ?, BRate = ?,
        RSlNo = ?, TestCode = ?, NotReq = ?, RateEdit = ?, FForm = ?, SMType = ?, OutSource = ?,
        IsFormulative = ?, FormulaText = ?, FormulaValue = ?, NABLTag = ?, IsDisc = ?, NSBilling = ?,
        ICURate = ?, CABRate = ?, SUITRate = ?, SampleTypeId = ?, ActualColName = ?, IsProfile = ?,
        agent = ?, cNotReq = ?, cost = ?
      WHERE TestId = ?`,
      [
        Test, ReportingName, SubDepartmentId, Method, Rate, DescFormat,
        DeliveryAfter, Introduction, Delivery, Interpretation, ARate, BRate,
        RSlNo, TestCode, NotReq, RateEdit, FForm, SMType, OutSource,
        IsFormulative, FormulaText, FormulaValue, NABLTag, IsDisc, NSBilling,
        ICURate, CABRate, SUITRate, SampleTypeId, ActualColName, IsProfile,
        agent, cNotReq, cost, testId
      ]
    );
    return result.affectedRows;
  }

  // Delete test
  static async deleteTest(testId) {
    const [result] = await pool.execute('DELETE FROM test WHERE TestId = ?', [testId]);
    return result.affectedRows;
  }

  // Search tests by name or code
  static async searchTests(searchTerm) {
    const [rows] = await pool.execute(
      'SELECT * FROM test WHERE Test LIKE ? OR TestCode LIKE ? OR ReportingName LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }

  // Get tests by department
  static async getTestsByDepartment(departmentId) {
    const [rows] = await pool.execute('SELECT * FROM test WHERE SubDepartmentId = ?', [departmentId]);
    return rows;
  }
}

export default TestModel;