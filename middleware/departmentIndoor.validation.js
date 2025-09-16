export const validateDepartmentData = (req, res, next) => {
  const { Department, DepGroupId, MinAdv, MaxBalance, Referal, PSL, RateType } = req.body;
  
  if (Department && typeof Department !== 'string') {
    return res.status(400).json({ success: false, error: 'Department must be a string' });
  }
  
  if (DepGroupId && !Number.isInteger(DepGroupId)) {
    return res.status(400).json({ success: false, error: 'DepGroupId must be an integer' });
  }
  
  if (MinAdv && typeof MinAdv !== 'number') {
    return res.status(400).json({ success: false, error: 'MinAdv must be a number' });
  }
  
  if (MaxBalance && typeof MaxBalance !== 'number') {
    return res.status(400).json({ success: false, error: 'MaxBalance must be a number' });
  }
  
  if (Referal && typeof Referal !== 'number') {
    return res.status(400).json({ success: false, error: 'Referal must be a number' });
  }
  
  if (PSL && !Number.isInteger(PSL)) {
    return res.status(400).json({ success: false, error: 'PSL must be an integer' });
  }
  
  if (RateType && !Number.isInteger(RateType)) {
    return res.status(400).json({ success: false, error: 'RateType must be an integer' });
  }
  
  next();
};

export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'Invalid ID parameter' });
  }
  next();
};