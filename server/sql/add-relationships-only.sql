-- ============================================
-- إضافة العلاقات (Foreign Keys) فقط
-- هذا السكريبت يضيف العلاقات إذا لم تكن موجودة
-- ============================================

USE construction_management;
GO

-- ============================================
-- 1. projects → users
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_projects_client_id')
BEGIN
    ALTER TABLE projects
    ADD CONSTRAINT FK_projects_client_id 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_projects_client_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_projects_contractor_id')
BEGIN
    ALTER TABLE projects
    ADD CONSTRAINT FK_projects_contractor_id 
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_projects_contractor_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_projects_created_by')
BEGIN
    ALTER TABLE projects
    ADD CONSTRAINT FK_projects_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_projects_created_by';
END
GO

-- ============================================
-- 2. materials → projects, suppliers
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_materials_project_id')
BEGIN
    ALTER TABLE materials
    ADD CONSTRAINT FK_materials_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_materials_project_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_materials_supplier_id')
BEGIN
    ALTER TABLE materials
    ADD CONSTRAINT FK_materials_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_materials_supplier_id';
END
GO

-- ============================================
-- 3. purchases → suppliers, materials
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_purchases_supplier_id')
BEGIN
    ALTER TABLE purchases
    ADD CONSTRAINT FK_purchases_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_purchases_supplier_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_purchases_material_id')
BEGIN
    ALTER TABLE purchases
    ADD CONSTRAINT FK_purchases_material_id 
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_purchases_material_id';
END
GO

-- ============================================
-- 4. payments → projects, suppliers
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_payments_project_id')
BEGIN
    ALTER TABLE payments
    ADD CONSTRAINT FK_payments_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_payments_project_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_payments_supplier_id')
BEGIN
    ALTER TABLE payments
    ADD CONSTRAINT FK_payments_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_payments_supplier_id';
END
GO

-- ============================================
-- 5. issues → materials, projects, users
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_issues_material_id')
BEGIN
    ALTER TABLE issues
    ADD CONSTRAINT FK_issues_material_id 
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_issues_material_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_issues_project_id')
BEGIN
    ALTER TABLE issues
    ADD CONSTRAINT FK_issues_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_issues_project_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_issues_issued_by')
BEGIN
    ALTER TABLE issues
    ADD CONSTRAINT FK_issues_issued_by 
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_issues_issued_by';
END
GO

-- ============================================
-- 6. contracts → projects, users
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_contracts_project_id')
BEGIN
    ALTER TABLE contracts
    ADD CONSTRAINT FK_contracts_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_contracts_project_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_contracts_client_id')
BEGIN
    ALTER TABLE contracts
    ADD CONSTRAINT FK_contracts_client_id 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_contracts_client_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_contracts_contractor_id')
BEGIN
    ALTER TABLE contracts
    ADD CONSTRAINT FK_contracts_contractor_id 
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_contracts_contractor_id';
END
GO

-- ============================================
-- 7. requests → users
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_requests_client_id')
BEGIN
    ALTER TABLE requests
    ADD CONSTRAINT FK_requests_client_id 
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_requests_client_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_requests_contractor_id')
BEGIN
    ALTER TABLE requests
    ADD CONSTRAINT FK_requests_contractor_id 
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_requests_contractor_id';
END
GO

-- ============================================
-- 8. reports → projects, users
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_reports_project_id')
BEGIN
    ALTER TABLE reports
    ADD CONSTRAINT FK_reports_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_reports_project_id';
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_reports_generated_by')
BEGIN
    ALTER TABLE reports
    ADD CONSTRAINT FK_reports_generated_by 
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL;
    PRINT 'تم إضافة: FK_reports_generated_by';
END
GO

-- ============================================
-- 9. project_engineers → projects
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_project_engineers_project_id')
BEGIN
    ALTER TABLE project_engineers
    ADD CONSTRAINT FK_project_engineers_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_project_engineers_project_id';
END
GO

-- ============================================
-- 10. project_crews → projects
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_project_crews_project_id')
BEGIN
    ALTER TABLE project_crews
    ADD CONSTRAINT FK_project_crews_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_project_crews_project_id';
END
GO

-- ============================================
-- 11. project_images → projects
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_project_images_project_id')
BEGIN
    ALTER TABLE project_images
    ADD CONSTRAINT FK_project_images_project_id 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    PRINT 'تم إضافة: FK_project_images_project_id';
END
GO

PRINT '';
PRINT '========================================';
PRINT 'تم الانتهاء من إضافة جميع العلاقات!';
PRINT '========================================';
GO










