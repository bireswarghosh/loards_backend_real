export const validateBedData = (req, res, next) => {
  const { Bed, DepartmentId, BedCh, AtttndantCh, TotalCh, ServiceCh, ShowInFinal, Vacant, ShortName, RMOCh, BP, RateEdit, GST } = req.body;
  
  if (Bed && typeof Bed !== 'string') {
    return res.status(400).json({ success: false, error: 'Bed must be a string' });
  }
  
  if (DepartmentId && !Number.isInteger(DepartmentId)) {
    return res.status(400).json({ success: false, error: 'DepartmentId must be an integer' });
  }
  
  if (BedCh && typeof BedCh !== 'number') {
    return res.status(400).json({ success: false, error: 'BedCh must be a number' });
  }
  
  if (AtttndantCh && typeof AtttndantCh !== 'number') {
    return res.status(400).json({ success: false, error: 'AtttndantCh must be a number' });
  }
  
  if (TotalCh && typeof TotalCh !== 'number') {
    return res.status(400).json({ success: false, error: 'TotalCh must be a number' });
  }
  
  if (ServiceCh && typeof ServiceCh !== 'string') {
    return res.status(400).json({ success: false, error: 'ServiceCh must be a string' });
  }
  
  if (ShowInFinal && typeof ShowInFinal !== 'string') {
    return res.status(400).json({ success: false, error: 'ShowInFinal must be a string' });
  }
  
  if (Vacant && typeof Vacant !== 'string') {
    return res.status(400).json({ success: false, error: 'Vacant must be a string' });
  }
  
  if (ShortName && typeof ShortName !== 'string') {
    return res.status(400).json({ success: false, error: 'ShortName must be a string' });
  }
  
  if (RMOCh && typeof RMOCh !== 'number') {
    return res.status(400).json({ success: false, error: 'RMOCh must be a number' });
  }
  
  if (BP && typeof BP !== 'number') {
    return res.status(400).json({ success: false, error: 'BP must be a number' });
  }
  
  if (RateEdit && !Number.isInteger(RateEdit)) {
    return res.status(400).json({ success: false, error: 'RateEdit must be an integer' });
  }
  
  if (GST && !Number.isInteger(GST)) {
    return res.status(400).json({ success: false, error: 'GST must be an integer' });
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