const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Issue = require('../models/Issue');
const Project = require('../models/Project');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', async (req, res) => {
  try {
<<<<<<< HEAD
    const { project } = req.query;
    const query = {};

    // عزل البيانات: إلزامي - يجب أن يكون المستخدم مسجل دخوله
    if (!req.user || !req.userId) {
      return res.json([]);
    }

    // عزل البيانات: المستخدم يرى فقط العمليات في مشاريعه
    if (req.userRole === 'contractor') {
      const contractorId = mongoose.Types.ObjectId.isValid(req.userId)
        ? new mongoose.Types.ObjectId(req.userId)
        : req.userId;

      const userProjects = await Project.find({ contractor: contractorId }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      if (projectIds.length === 0) return res.json([]);
      query.project = { $in: projectIds };
    } else if (req.userRole === 'client') {
      const clientId = mongoose.Types.ObjectId.isValid(req.userId)
        ? new mongoose.Types.ObjectId(req.userId)
        : req.userId;

      const userProjects = await Project.find({ client: clientId }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      if (projectIds.length === 0) return res.json([]);
      query.project = { $in: projectIds };
    }

    if (project) query.project = project;

    const issues = await Issue.find(query)
      .populate('project', 'name')
      .populate('items.material', 'name unit')
      .sort({ issueDate: -1 });

=======
    const { project, status, priority } = req.query;
    const query = {};
    
    // عزل البيانات: إلزامي - يجب أن يكون المستخدم مسجل دخوله
    if (!req.user || !req.userId) {
      return res.json([]); // إرجاع قائمة فارغة إذا لم يكن مسجل دخوله
    }
    
    // عزل البيانات: المستخدم يرى فقط مشاكله
    if (req.userRole === 'contractor') {
      // المقاول يرى فقط المشاكل في مشاريعه
      // تحويل userId إلى ObjectId للتأكد من المطابقة
      const contractorId = mongoose.Types.ObjectId.isValid(req.userId) 
        ? new mongoose.Types.ObjectId(req.userId) 
        : req.userId;
      
      const userProjects = await Project.find({ contractor: contractorId }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      if (projectIds.length === 0) {
        return res.json([]); // لا توجد مشاريع = لا توجد مشاكل
      }
      query.project = { $in: projectIds };
    } else if (req.userRole === 'client') {
      // العميل يرى فقط المشاكل في مشاريعه
      // تحويل userId إلى ObjectId للتأكد من المطابقة
      const clientId = mongoose.Types.ObjectId.isValid(req.userId) 
        ? new mongoose.Types.ObjectId(req.userId) 
        : req.userId;
      
      const userProjects = await Project.find({ client: clientId }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      if (projectIds.length === 0) {
        return res.json([]); // لا توجد مشاريع = لا توجد مشاكل
      }
      query.project = { $in: projectIds };
    } else {
      return res.json([]); // دور غير معروف
    }
    
    // لا نسمح بالتصفية اليدوية - البيانات معزولة تلقائياً
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const issues = await Issue.find(query)
      .populate('project', 'name')
      .populate('reportedBy', 'name email')
      .sort({ reportedDate: -1 });
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('project')
<<<<<<< HEAD
      .populate('items.material')
      .populate('createdBy', 'name email');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // عزل البيانات: التحقق من أن المشروع يخص المستخدم
    if (req.user && req.userId && issue.project) {
      const project = await Project.findById(issue.project._id || issue.project);
      if (project) {
        const isOwner =
          (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
          (req.userRole === 'client' && project.client?.toString() === req.userId.toString());

=======
      .populate('reportedBy');
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    // عزل البيانات: التحقق من أن المشكلة في مشروع يخص المستخدم
    if (req.user && req.userId && issue.project) {
      const project = await Project.findById(issue.project._id || issue.project);
      if (project) {
        const isOwner = 
          (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
          (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
        
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        if (!isOwner) {
          return res.status(403).json({ error: 'You do not have permission to view this issue' });
        }
      }
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issue', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
<<<<<<< HEAD
    if (req.user) {
      req.body.createdBy = req.userId;

      if (req.body.project) {
        const project = await Project.findById(req.body.project);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        if (req.userRole === 'contractor' && project.contractor?.toString() !== req.userId.toString()) {
          return res.status(403).json({ error: 'Permission denied for this project' });
        }
      }
    }

    const issue = new Issue(req.body);
    await issue.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('project')
      .populate('items.material');

=======
    // عزل البيانات: إضافة reportedBy تلقائياً والتحقق من المشروع
    if (req.user) {
      req.body.reportedBy = req.userId;
      
      // التحقق من أن المشروع يخص المستخدم
      if (req.body.project) {
        const project = await Project.findById(req.body.project);
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        
        if (req.userRole === 'contractor' && project.contractor?.toString() !== req.userId.toString()) {
          return res.status(403).json({ error: 'You do not have permission to create issue for this project' });
        }
        if (req.userRole === 'client' && project.client?.toString() !== req.userId.toString()) {
          return res.status(403).json({ error: 'You do not have permission to create issue for this project' });
        }
      }
    }
    
    const issue = new Issue(req.body);
    await issue.save();
    
    const populatedIssue = await Issue.findById(issue._id)
      .populate('project')
      .populate('reportedBy');
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create issue', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
<<<<<<< HEAD
    const issue = await Issue.findById(req.params.id).populate('project');
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (req.user) {
      const project = await Project.findById(issue.project?._id || issue.project);
      const isOwner =
        (req.userRole === 'contractor' && project?.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project?.client?.toString() === req.userId.toString());

      if (!isOwner) return res.status(403).json({ error: 'Permission denied' });
    }

=======
    // عزل البيانات: التحقق من أن المشكلة تخص المستخدم
    const issue = await Issue.findById(req.params.id).populate('project');
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    if (req.user) {
      const project = await Project.findById(issue.project?._id || issue.project);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const isOwner = 
        (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
      
      if (!isOwner) {
        return res.status(403).json({ error: 'You do not have permission to update this issue' });
      }
    }
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
<<<<<<< HEAD
    ).populate('project').populate('items.material');

=======
    ).populate('project').populate('reportedBy');
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update issue', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
<<<<<<< HEAD
    const issue = await Issue.findById(req.params.id).populate('project');
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (req.user) {
      const project = await Project.findById(issue.project?._id || issue.project);
      const isOwner =
        (req.userRole === 'contractor' && project?.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project?.client?.toString() === req.userId.toString());

      if (!isOwner) return res.status(403).json({ error: 'Permission denied' });
    }

=======
    // عزل البيانات: التحقق من أن المشكلة تخص المستخدم
    const issue = await Issue.findById(req.params.id).populate('project');
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    if (req.user) {
      const project = await Project.findById(issue.project?._id || issue.project);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const isOwner = 
        (req.userRole === 'contractor' && project.contractor?.toString() === req.userId.toString()) ||
        (req.userRole === 'client' && project.client?.toString() === req.userId.toString());
      
      if (!isOwner) {
        return res.status(403).json({ error: 'You do not have permission to delete this issue' });
      }
    }
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete issue', message: error.message });
  }
});

module.exports = router;



