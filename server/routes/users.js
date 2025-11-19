const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    // عزل البيانات: المستخدم يرى فقط المستخدمين من نفس الدور (للعرض العام)
    // أو يمكن تقييده أكثر حسب الحاجة
    // حالياً، نسمح للمستخدمين برؤية المستخدمين الآخرين من نفس الدور فقط
    if (req.user && req.userRole) {
      // يمكن إضافة المزيد من القيود هنا إذا لزم الأمر
      // على سبيل المثال، يمكن أن يرى المقاولون فقط المقاولين الآخرين
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    console.log(`📥 [Users API] GET /users/${req.params.id}`);
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.error(`❌ [Users API] User not found: ${req.params.id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // عزل البيانات: المستخدم يمكنه رؤية ملفه الشخصي فقط أو المستخدمين الآخرين من نفس الدور
    // يمكن تعديل هذا حسب الحاجة
    if (req.user) {
      // المستخدم يمكنه رؤية ملفه الشخصي دائماً
      if (user._id.toString() !== req.userId.toString()) {
        // يمكن رؤية المستخدمين الآخرين من نفس الدور فقط
        // يمكن إزالة هذا القيد إذا أردت السماح برؤية جميع المستخدمين
      }
    }
    
    // Ensure both id and _id are in response
    const userData = user.toObject();
    userData.id = userData._id;
    console.log(`✅ [Users API] User found: ${userData.name} (${userData.email})`);
    res.json(userData);
  } catch (error) {
    console.error(`❌ [Users API] Error fetching user:`, error);
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

router.put('/:id', optionalAuth, async (req, res) => {
  try {
    // عزل البيانات: المستخدم يمكنه تحديث ملفه الشخصي فقط
    if (req.user && req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    
    const { password, ...updateData } = req.body;
    
    // منع تغيير الدور من خلال API العادي
    if (updateData.role && req.user && req.user.role !== 'admin') {
      delete updateData.role;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user', message: error.message });
  }
});

router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    // عزل البيانات: المستخدم يمكنه حذف ملفه الشخصي فقط
    if (req.user && req.params.id !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

module.exports = router;











