-- ============================================
-- إضافة العلاقات (Foreign Keys) خطوة بخطوة
-- شغّل هذا بعد schema-step-by-step.sql
-- ============================================

USE construction_management;
GO

-- ============================================
-- 1. projects → users
-- ============================================
ALTER TABLE projects
ADD CONSTRAINT FK_projects_client_id 
FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL;
GO

ALTER TABLE projects
ADD CONSTRAINT FK_projects_contractor_id 
FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE NO ACTION;
GO

ALTER TABLE projects
ADD CONSTRAINT FK_projects_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE NO ACTION;
GO

-- ============================================
-- 2. materials → projects, suppliers
-- ============================================
ALTER TABLE materials
ADD CONSTRAINT FK_materials_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

ALTER TABLE materials
ADD CONSTRAINT FK_materials_supplier_id 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
GO

-- ============================================
-- 3. purchases → suppliers, materials
-- ============================================
ALTER TABLE purchases
ADD CONSTRAINT FK_purchases_supplier_id 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE NO ACTION;
GO

ALTER TABLE purchases
ADD CONSTRAINT FK_purchases_material_id 
FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL;
GO

-- ============================================
-- 4. payments → projects, suppliers
-- ============================================
ALTER TABLE payments
ADD CONSTRAINT FK_payments_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
GO

ALTER TABLE payments
ADD CONSTRAINT FK_payments_supplier_id 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
GO

-- ============================================
-- 5. issues → materials, projects, users
-- ============================================
ALTER TABLE issues
ADD CONSTRAINT FK_issues_material_id 
FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE NO ACTION;
GO

ALTER TABLE issues
ADD CONSTRAINT FK_issues_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE NO ACTION;
GO

ALTER TABLE issues
ADD CONSTRAINT FK_issues_issued_by 
FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL;
GO

-- ============================================
-- 6. contracts → projects, users
-- ============================================
ALTER TABLE contracts
ADD CONSTRAINT FK_contracts_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

ALTER TABLE contracts
ADD CONSTRAINT FK_contracts_client_id 
FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE NO ACTION;
GO

ALTER TABLE contracts
ADD CONSTRAINT FK_contracts_contractor_id 
FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE NO ACTION;
GO

-- ============================================
-- 7. requests → users
-- ============================================
ALTER TABLE requests
ADD CONSTRAINT FK_requests_client_id 
FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE NO ACTION;
GO

ALTER TABLE requests
ADD CONSTRAINT FK_requests_contractor_id 
FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE SET NULL;
GO

-- ============================================
-- 8. reports → projects, users
-- ============================================
ALTER TABLE reports
ADD CONSTRAINT FK_reports_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
GO

ALTER TABLE reports
ADD CONSTRAINT FK_reports_generated_by 
FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL;
GO

-- ============================================
-- 9. project_engineers → projects
-- ============================================
ALTER TABLE project_engineers
ADD CONSTRAINT FK_project_engineers_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

-- ============================================
-- 10. project_crews → projects
-- ============================================
ALTER TABLE project_crews
ADD CONSTRAINT FK_project_crews_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

-- ============================================
-- 11. project_images → projects
-- ============================================
ALTER TABLE project_images
ADD CONSTRAINT FK_project_images_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
GO

PRINT 'تم إضافة جميع العلاقات بنجاح!';
GO

