const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, optionalAuth } = require('../middleware/auth');

// استخدام optionalAuth - يضيف المستخدم إذا كان موجوداً
router.use(optionalAuth);

router.get('/', async (req, res) => {
  try {
    const { client, contractor, status } = req.query;
    const query = {};
<<<<<<< HEAD

    console.log(`📥 [Projects GET] User: ${req.user ? `${req.user.name} (${req.userRole})` : 'NOT AUTHENTICATED'}, ID: ${req.userId || 'N/A'}`);

=======
    
    console.log(`📥 [Projects GET] User: ${req.user ? `${req.user.name} (${req.userRole})` : 'NOT AUTHENTICATED'}, ID: ${req.userId || 'N/A'}`);
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // عزل البيانات: إلزامي - يجب أن يكون المستخدم مسجل دخوله
    if (!req.user || !req.userId) {
      console.log(`🔒 [Projects GET] No authentication - returning empty array`);
      return res.json([]); // إرجاع قائمة فارغة إذا لم يكن مسجل دخوله
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // عزل البيانات: المستخدم يرى فقط بياناته
    if (req.userRole === 'contractor') {
      // المقاول يرى فقط مشاريعه
      // البحث عن String و ObjectId معاً للتأكد من المطابقة
      const userIdStr = req.userId.toString();
      if (mongoose.Types.ObjectId.isValid(req.userId)) {
        const userIdObj = new mongoose.Types.ObjectId(req.userId);
        query.$or = [
          { contractor: userIdStr },
          { contractor: userIdObj }
        ];
        console.log(`🔒 [Projects GET] Filtering by contractor: ${userIdStr} (as String and ObjectId)`);
      } else {
        query.contractor = userIdStr;
        console.log(`🔒 [Projects GET] Filtering by contractor: ${userIdStr} (as String only)`);
      }
    } else if (req.userRole === 'client') {
      // العميل يرى فقط مشاريعه
      // البحث عن String و ObjectId معاً للتأكد من المطابقة
      const userIdStr = req.userId.toString();
      if (mongoose.Types.ObjectId.isValid(req.userId)) {
        const userIdObj = new mongoose.Types.ObjectId(req.userId);
        query.$or = [
          { client: userIdStr },
          { client: userIdObj }
        ];
        console.log(`🔒 [Projects GET] Filtering by client: ${userIdStr} (as String and ObjectId)`);
      } else {
        query.client = userIdStr;
        console.log(`🔒 [Projects GET] Filtering by client: ${userIdStr} (as String only)`);
      }
    } else {
      // إذا كان الدور غير معروف، لا نرجع أي بيانات
      console.log(`⚠️ [Projects GET] Unknown role: ${req.userRole} - returning empty array`);
      return res.json([]);
    }
<<<<<<< HEAD

    // لا نسمح بالتصفية اليدوية إذا كان المستخدم مسجل دخوله - البيانات معزولة تلقائياً

=======
    
    // لا نسمح بالتصفية اليدوية إذا كان المستخدم مسجل دخوله - البيانات معزولة تلقائياً
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // Filter by status
    if (status) {
      query.status = status;
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // تحويل query إلى JSON قابل للقراءة (بدون ObjectId)
    const queryForLog = {};
    if (query.$or) {
      queryForLog.$or = query.$or.map(condition => {
        const key = Object.keys(condition)[0];
        const value = condition[key];
        return { [key]: value.toString() };
      });
    } else {
      Object.keys(query).forEach(key => {
        queryForLog[key] = query[key]?.toString() || query[key];
      });
    }
    console.log(`🔍 [Projects GET] Query:`, JSON.stringify(queryForLog, null, 2));
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // جلب جميع المشاريع أولاً للتحقق (للـ debugging فقط)
    const allProjects = await Project.find({}).select('_id name contractor client').limit(5);
    console.log(`🔍 [Projects GET] Sample projects in DB (first 5):`);
    allProjects.forEach((p, idx) => {
      const contractorId = p.contractor?._id?.toString() || p.contractor?.toString() || 'NONE';
      const clientId = p.client?._id?.toString() || p.client?.toString() || 'NONE';
      console.log(`  ${idx + 1}. "${p.name}" - Contractor ID: ${contractorId}, Client ID: ${clientId}`);
    });
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    const projects = await Project.find(query)
      .populate('contractor', 'name companyName email')
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
<<<<<<< HEAD

    console.log(`✅ [Projects GET] Found ${projects.length} projects for user ${req.user ? req.user.name : 'anonymous'}`);

=======
    
    console.log(`✅ [Projects GET] Found ${projects.length} projects for user ${req.user ? req.user.name : 'anonymous'}`);
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    // Log project details for debugging
    if (projects.length > 0) {
      console.log(`📋 [Projects GET] Projects found:`);
      projects.forEach((p, idx) => {
        const contractorId = p.contractor?._id?.toString() || p.contractor?.toString() || 'NONE';
        const clientId = p.client?._id?.toString() || p.client?.toString() || 'NONE';
        console.log(`  ${idx + 1}. "${p.name}" - Contractor ID: ${contractorId} (${p.contractor?.name || 'N/A'}), Client ID: ${clientId}`);
      });
    } else {
      console.log(`⚠️ [Projects GET] No projects found. User ID: ${req.userId}, Role: ${req.userRole}`);
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('contractor', 'name companyName email')
      .populate('client', 'name email');
<<<<<<< HEAD

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // عزل البيانات: التحقق من أن المشروع يخص المستخدم
    if (req.user && req.userId) {
      const currentUserId = req.userId.toString();
      const contractorId = project.contractor?._id ? project.contractor._id.toString() : project.contractor?.toString();
      const clientId = project.client?._id ? project.client._id.toString() : project.client?.toString();
      const creatorId = project.createdBy?.toString();

      const isOwner =
        (req.userRole === 'contractor' && contractorId === currentUserId) ||
        (req.userRole === 'client' && clientId === currentUserId) ||
        (creatorId === currentUserId);

      const isAdmin = req.userRole === 'admin';

      if (!isOwner && !isAdmin) {
        console.warn(`🚫 [Project GET ID] Access Denied for ${req.user.name} (${req.userRole}) on Project: ${project.name}`);
        return res.status(403).json({ error: 'You do not have permission to view this project' });
      }
    }



=======
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // عزل البيانات: التحقق من أن المشروع يخص المستخدم
    if (req.user && req.userId) {
      const isOwner = 
        (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
      
      if (!isOwner) {
        return res.status(403).json({ error: 'You do not have permission to view this project' });
      }
    }
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project', message: error.message });
  }
});

<<<<<<< HEAD

=======
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
router.post('/', async (req, res) => {
  try {
    // عزل البيانات: إضافة contractor تلقائياً إذا كان المستخدم مقاول
    if (req.user && req.userRole === 'contractor') {
      req.body.contractor = req.userId;
      req.body.createdBy = req.userId;
    }
    // عزل البيانات: إضافة client تلقائياً إذا كان المستخدم عميل
    if (req.user && req.userRole === 'client') {
      req.body.client = req.userId;
      req.body.createdBy = req.userId;
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // عزل البيانات: التحقق من أن المستخدم يملك المشروع
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
<<<<<<< HEAD

    if (req.user && req.userId) {
      const contractorId = project.contractor?.toString();
      const clientId = project.client?.toString();
      const currentUserId = req.userId.toString();

      const isOwner =
        (req.userRole === 'contractor' && contractorId === currentUserId) ||
        (req.userRole === 'client' && clientId === currentUserId);

=======
    
    if (req.user) {
      const isOwner = 
        (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
      
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      if (!isOwner) {
        return res.status(403).json({ error: 'You do not have permission to update this project' });
      }
    }
<<<<<<< HEAD


=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('contractor', 'name companyName email')
      .populate('client', 'name email');
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update project', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // عزل البيانات: التحقق من أن المستخدم يملك المشروع
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
<<<<<<< HEAD

    if (req.user && req.userId) {
      const contractorId = project.contractor?.toString();
      const clientId = project.client?.toString();
      const currentUserId = req.userId.toString();

      const isOwner =
        (req.userRole === 'contractor' && contractorId === currentUserId) ||
        (req.userRole === 'client' && clientId === currentUserId);

=======
    
    if (req.user) {
      const isOwner = 
        (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
      
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      if (!isOwner) {
        return res.status(403).json({ error: 'You do not have permission to delete this project' });
      }
    }
<<<<<<< HEAD


=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', message: error.message });
  }
});

// Upload images route (simple - stores image URLs)
router.post('/:id/upload', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // For now, we'll accept image URLs or base64 data
    // In production, you'd use multer to save files to disk/cloud storage
    const { imageUrl } = req.body;
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    if (imageUrl) {
      if (!project.images) {
        project.images = [];
      }
      project.images.push(imageUrl);
      await project.save();
      return res.json({ images: project.images });
    }

    // If no imageUrl provided, return current images
    res.json({ images: project.images || [] });
  } catch (error) {
    res.status(400).json({ error: 'Failed to upload image', message: error.message });
  }
});

module.exports = router;

