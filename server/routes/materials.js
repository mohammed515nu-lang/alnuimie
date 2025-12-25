const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Material = require('../models/Material');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', async (req, res) => {
  try {
    const { category, status, lowStock } = req.query;
    const query = {};
    
    // عزل البيانات: إلزامي - يجب أن يكون المستخدم مسجل دخوله
    if (!req.user || !req.userId || req.userRole !== 'contractor') {
      return res.json([]); // إرجاع قائمة فارغة إذا لم يكن مقاول مسجل دخوله
    }
    
    // عزل البيانات: المقاول يرى فقط مواده
    const contractorId = mongoose.Types.ObjectId.isValid(req.userId) 
      ? new mongoose.Types.ObjectId(req.userId) 
      : req.userId;
    query.contractor = contractorId;
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    let materials = await Material.find(query).populate('supplier', 'name companyName');
    
    if (lowStock === 'true') {
      materials = materials.filter(m => m.quantity <= m.minStock);
    }
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('supplier');
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    // عزل البيانات: التحقق من أن المادة تخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (material.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to view this material' });
      }
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch material', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // عزل البيانات: إضافة contractor تلقائياً إذا كان المستخدم مقاول
    if (req.user && req.userRole === 'contractor') {
      req.body.contractor = req.userId;
    } else if (!req.body.contractor) {
      return res.status(403).json({ error: 'Only contractors can create materials' });
    }
    
    const material = new Material(req.body);
    
    if (material.quantity <= 0) {
      material.status = 'out-of-stock';
    } else if (material.quantity <= material.minStock) {
      material.status = 'low-stock';
    } else {
      material.status = 'available';
    }
    
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create material', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    // عزل البيانات: التحقق من أن المادة تخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (material.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to update this material' });
      }
    }
    
    // منع تغيير contractor
    if (req.body.contractor && req.body.contractor.toString() !== material.contractor.toString()) {
      delete req.body.contractor;
    }
    
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (updatedMaterial.quantity <= 0) {
      updatedMaterial.status = 'out-of-stock';
    } else if (updatedMaterial.quantity <= updatedMaterial.minStock) {
      updatedMaterial.status = 'low-stock';
    } else {
      updatedMaterial.status = 'available';
    }
    
    await updatedMaterial.save();
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update material', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    // عزل البيانات: التحقق من أن المادة تخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (material.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to delete this material' });
      }
    }
    
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete material', message: error.message });
  }
});

module.exports = router;













