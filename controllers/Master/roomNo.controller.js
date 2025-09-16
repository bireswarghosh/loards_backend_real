import prisma from '../../prisma/client.js';

export const getRoomNos = async (req, res) => {
  try {
    const rooms = await prisma.roomno.findMany({
      orderBy: { RoomNoId: 'asc' }
    });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomNo = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.roomno.findUnique({
      where: { RoomNoId: parseInt(id) }
    });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoomNo = async (req, res) => {
  try {
    const { RoomNo } = req.body;
    
    const maxRoom = await prisma.roomno.findFirst({
      orderBy: { RoomNoId: 'desc' }
    });
    const nextId = (maxRoom?.RoomNoId || 0) + 1;
    
    const newRoom = await prisma.roomno.create({
      data: {
        RoomNoId: nextId,
        RoomNo
      }
    });
    
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoomNo = async (req, res) => {
  try {
    const { id } = req.params;
    const { RoomNo } = req.body;
    
    const updated = await prisma.roomno.update({
      where: { RoomNoId: parseInt(id) },
      data: { RoomNo }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRoomNo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.roomno.delete({
      where: { RoomNoId: parseInt(id) }
    });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};