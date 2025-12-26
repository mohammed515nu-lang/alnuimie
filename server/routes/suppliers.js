const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    // عزل البيانات: إلزامي - يجب أن يكون المستخدم مسجل دخوله
    if (!req.user || !req.userId || req.userRole !== 'contractor') {
      console.log(`⚠️ [Suppliers] Unauthorized access attempt: user=${!!req.user}, role=${req.userRole}`);
      // If the request explicitly asks for suppliers (e.g. from contractor page), return 401 instead of []
      // to let the frontend know something is wrong with authentication.
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Your session may have expired or you are not authorized. Please log in again.',
        details: { user: !!req.user, role: req.userRole }
      });
    }

    // عزل البيانات: المقاول يرى فقط مورديه
    const contractorId = mongoose.Types.ObjectId.isValid(req.userId)
      ? new mongoose.Types.ObjectId(req.userId)
      : req.userId;
    query.contractor = contractorId;

    if (status) query.status = status;

    const suppliers = await Supplier.find(query);
    console.log(`✅ [Suppliers] Fetched ${suppliers.length} suppliers for contractor: ${req.userId}`);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // عزل البيانات: التحقق من أن المورد يخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (supplier.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to view this supplier' });
      }
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // عزل البيانات: إضافة contractor تلقائياً إذا كان المستخدم مقاول
    if (req.user && req.userRole === 'contractor') {
      req.body.contractor = req.userId;
    } else if (!req.body.contractor) {
      return res.status(403).json({ error: 'Only contractors can create suppliers' });
    }

    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create supplier', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // عزل البيانات: التحقق من أن المورد يخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (supplier.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to update this supplier' });
      }
    }

    // منع تغيير contractor
    if (req.body.contractor && req.body.contractor.toString() !== supplier.contractor.toString()) {
      delete req.body.contractor;
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update supplier', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // عزل البيانات: التحقق من أن المورد يخص المقاول
    if (req.user && req.userRole === 'contractor') {
      if (supplier.contractor?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to delete this supplier' });
      }
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier', message: error.message });
  }
});

module.exports = router;








