import { getAllZones, getZoneById, createZone, updateZone, deleteZone } from '../../models/OPD/zone.model.js';

export const getAllZonesController = async (req, res) => {
  try {
    const zones = await getAllZones();
    res.status(200).json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getZoneByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await getZoneById(id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.status(200).json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createZoneController = async (req, res) => {
  const { zone_name } = req.body;
  if (!zone_name) {
    return res.status(400).json({ message: 'zone_name is required' });
  }
  try {
    const zoneId = await createZone(zone_name);
    res.status(201).json({ message: 'Zone created successfully', zoneId });
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateZoneController = async (req, res) => {
  const { id } = req.params;
  const { zone_name } = req.body;
  if (!zone_name) {
    return res.status(400).json({ message: 'zone_name is required' });
  }
  try {
    const result = await updateZone(id, zone_name);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.status(200).json({ message: 'Zone updated successfully' });
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteZoneController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteZone(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.status(200).json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};