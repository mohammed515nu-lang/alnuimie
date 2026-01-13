import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../utils/api';

/**
 * ProtectedRoute - يحمي المسارات بناءً على الصلاحيات
 * @param {Object} props
 * @param {React.Component} props.children - المكون المراد عرضه
 * @param {string|string[]} props.allowedRoles - الأدوار المسموح بها ('client', 'contractor', أو كليهما)
 * @param {string} props.redirectTo - المسار للتحويل عند عدم وجود صلاحية (افتراضي: '/login')
 */
export default function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const token = getToken();
  const user = getUser();

  // إذا لم يكن مسجل دخول، أحوله إلى صفحة تسجيل الدخول
  if (!token || !user) {
    console.warn('🔒 [ProtectedRoute] User not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // إذا لم يتم تحديد allowedRoles، نسمح لجميع المستخدمين المسجلين
  if (!allowedRoles) {
    return children;
  }

  // تحويل allowedRoles إلى مصفوفة إذا كان string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // التحقق من أن دور المستخدم مسموح
  const userRole = user.role;
  const hasAccess = roles.includes(userRole);

  if (!hasAccess) {
    console.warn(`🔒 [ProtectedRoute] Access denied for role: ${userRole}. Allowed roles: ${roles.join(', ')}`);
    // إذا لم يكن لديه صلاحية، أحوله إلى الصفحة المناسبة لدوره
    if (userRole === 'contractor') {
      return <Navigate to="/contractor" replace />;
    } else if (userRole === 'client') {
      return <Navigate to="/client/projects" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // إذا كان لديه صلاحية، أعرض المكون
  return children;
}

