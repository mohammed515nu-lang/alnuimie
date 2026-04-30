-- ============================================
-- نظام إدارة المقاولات - قاعدة بيانات SQL Server
-- Database: construction_management
-- ============================================

-- إنشاء قاعدة البيانات
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'construction_management')
BEGIN
    CREATE DATABASE construction_management;
END
GO

USE construction_management;
GO

-- حذف الجداول الموجودة (إذا كانت موجودة)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'project_images')
    DROP TABLE project_images;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'project_crews')
    DROP TABLE project_crews;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'project_engineers')
    DROP TABLE project_engineers;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reports')
    DROP TABLE reports;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'requests')
    DROP TABLE requests;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'contracts')
    DROP TABLE contracts;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'issues')
    DROP TABLE issues;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'payments')
    DROP TABLE payments;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'purchases')
    DROP TABLE purchases;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'materials')
    DROP TABLE materials;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'projects')
    DROP TABLE projects;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'suppliers')
    DROP TABLE suppliers;
GO
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
    DROP TABLE users;
GO

-- ============================================
-- 1. جدول المستخدمين (Users)
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'contractor')),
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
GO

-- Trigger لتحديث updated_at تلقائياً
CREATE TRIGGER trg_users_updated_at
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE users
    SET updated_at = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- ============================================
-- 2. جدول المشاريع (Projects)
-- ============================================
CREATE TABLE projects (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    client_id INT,
    contractor_id INT,
    location NVARCHAR(255),
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    budget DECIMAL(15, 2) DEFAULT 0.00,
    total_cost DECIMAL(15, 2) DEFAULT 0.00,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    notes NVARCHAR(MAX),
    created_by INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE NO ACTION
);
GO

CREATE INDEX idx_client ON projects(client_id);
CREATE INDEX idx_contractor ON projects(contractor_id);
CREATE INDEX idx_status ON projects(status);
GO

CREATE TRIGGER trg_projects_updated_at
ON projects
AFTER UPDATE
AS
BEGIN
    UPDATE projects
    SET updated_at = GETDATE()
    FROM projects p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- ============================================
-- 3. جدول الموردين (Suppliers) - يجب إنشاؤه قبل materials
-- ============================================
CREATE TABLE suppliers (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    contact_person NVARCHAR(255),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    address NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_name ON suppliers(name);
GO

CREATE TRIGGER trg_suppliers_updated_at
ON suppliers
AFTER UPDATE
AS
BEGIN
    UPDATE suppliers
    SET updated_at = GETDATE()
    FROM suppliers s
    INNER JOIN inserted i ON s.id = i.id;
END;
GO

-- ============================================
-- 4. جدول المواد (Materials)
-- ============================================
CREATE TABLE materials (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit NVARCHAR(50) DEFAULT N'وحدة',
    cost DECIMAL(15, 2) DEFAULT 0.00,
    project_id INT,
    supplier_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_project ON materials(project_id);
CREATE INDEX idx_supplier ON materials(supplier_id);
GO

CREATE TRIGGER trg_materials_updated_at
ON materials
AFTER UPDATE
AS
BEGIN
    UPDATE materials
    SET updated_at = GETDATE()
    FROM materials m
    INNER JOIN inserted i ON m.id = i.id;
END;
GO

-- ============================================
-- 5. جدول المشتريات (Purchases)
-- ============================================
CREATE TABLE purchases (
    id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    material_id INT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchase_date ON purchases(purchase_date);
GO

CREATE TRIGGER trg_purchases_updated_at
ON purchases
AFTER UPDATE
AS
BEGIN
    UPDATE purchases
    SET updated_at = GETDATE()
    FROM purchases p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- ============================================
-- 6. جدول المدفوعات (Payments)
-- ============================================
CREATE TABLE payments (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT,
    supplier_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method NVARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'credit_card')),
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_project ON payments(project_id);
CREATE INDEX idx_supplier ON payments(supplier_id);
CREATE INDEX idx_payment_date ON payments(payment_date);
GO

CREATE TRIGGER trg_payments_updated_at
ON payments
AFTER UPDATE
AS
BEGIN
    UPDATE payments
    SET updated_at = GETDATE()
    FROM payments p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- ============================================
-- 7. جدول إصدار المواد (Issues)
-- ============================================
CREATE TABLE issues (
    id INT PRIMARY KEY IDENTITY(1,1),
    material_id INT NOT NULL,
    project_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    issue_date DATE NOT NULL,
    issued_by INT,
    notes NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE NO ACTION,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE NO ACTION,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_material ON issues(material_id);
CREATE INDEX idx_project ON issues(project_id);
CREATE INDEX idx_issue_date ON issues(issue_date);
GO

CREATE TRIGGER trg_issues_updated_at
ON issues
AFTER UPDATE
AS
BEGIN
    UPDATE issues
    SET updated_at = GETDATE()
    FROM issues i
    INNER JOIN inserted ins ON i.id = ins.id;
END;
GO

-- ============================================
-- 8. جدول العقود (Contracts)
-- ============================================
CREATE TABLE contracts (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT NOT NULL,
    client_id INT NOT NULL,
    contractor_id INT NOT NULL,
    contract_number NVARCHAR(100) UNIQUE,
    contract_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    total_amount DECIMAL(15, 2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    terms NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE NO ACTION
);
GO

CREATE INDEX idx_project ON contracts(project_id);
CREATE INDEX idx_client ON contracts(client_id);
CREATE INDEX idx_contractor ON contracts(contractor_id);
CREATE INDEX idx_contract_number ON contracts(contract_number);
GO

CREATE TRIGGER trg_contracts_updated_at
ON contracts
AFTER UPDATE
AS
BEGIN
    UPDATE contracts
    SET updated_at = GETDATE()
    FROM contracts c
    INNER JOIN inserted i ON c.id = i.id;
END;
GO

-- ============================================
-- 9. جدول الطلبات (Requests)
-- ============================================
CREATE TABLE requests (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    client_id INT NOT NULL,
    contractor_id INT,
    request_number NVARCHAR(100) UNIQUE,
    budget DECIMAL(15, 2),
    location NVARCHAR(255),
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    response_date DATE,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_client ON requests(client_id);
CREATE INDEX idx_contractor ON requests(contractor_id);
CREATE INDEX idx_status ON requests(status);
CREATE INDEX idx_request_number ON requests(request_number);
GO

CREATE TRIGGER trg_requests_updated_at
ON requests
AFTER UPDATE
AS
BEGIN
    UPDATE requests
    SET updated_at = GETDATE()
    FROM requests r
    INNER JOIN inserted i ON r.id = i.id;
END;
GO

-- ============================================
-- 10. جدول التقارير (Reports)
-- ============================================
CREATE TABLE reports (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT,
    title NVARCHAR(255) NOT NULL,
    type NVARCHAR(20) DEFAULT 'general' CHECK (type IN ('financial', 'progress', 'material', 'general')),
    content NVARCHAR(MAX),
    generated_by INT,
    report_date DATE NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_project ON reports(project_id);
CREATE INDEX idx_type ON reports(type);
CREATE INDEX idx_report_date ON reports(report_date);
GO

CREATE TRIGGER trg_reports_updated_at
ON reports
AFTER UPDATE
AS
BEGIN
    UPDATE reports
    SET updated_at = GETDATE()
    FROM reports r
    INNER JOIN inserted i ON r.id = i.id;
END;
GO

-- ============================================
-- 11. جدول المهندسين (Engineers) - للمشاريع
-- ============================================
CREATE TABLE project_engineers (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    specialty NVARCHAR(100),
    salary DECIMAL(15, 2),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    notes NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project ON project_engineers(project_id);
GO

-- ============================================
-- 12. جدول فرق العمل (Crews) - للمشاريع
-- ============================================
CREATE TABLE project_crews (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT NOT NULL,
    crew_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project ON project_crews(project_id);
GO

-- ============================================
-- 13. جدول صور المشاريع (Project Images)
-- ============================================
CREATE TABLE project_images (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    image_type NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project ON project_images(project_id);
GO

-- ============================================
-- إنشاء Views مفيدة
-- ============================================

-- View: ملخص المشاريع
IF EXISTS (SELECT * FROM sys.views WHERE name = 'project_summary')
    DROP VIEW project_summary;
GO

CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.budget,
    p.total_cost,
    p.progress,
    u1.name AS client_name,
    u2.name AS contractor_name,
    (SELECT COUNT(*) FROM materials m WHERE m.project_id = p.id) AS materials_count,
    (SELECT COUNT(*) FROM project_engineers pe WHERE pe.project_id = p.id) AS engineers_count
FROM projects p
LEFT JOIN users u1 ON p.client_id = u1.id
LEFT JOIN users u2 ON p.contractor_id = u2.id;
GO

-- ============================================
-- إنشاء Stored Procedures
-- ============================================

-- Procedure: حساب إجمالي تكلفة المشروع
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'CalculateProjectTotalCost')
    DROP PROCEDURE CalculateProjectTotalCost;
GO

CREATE PROCEDURE CalculateProjectTotalCost
    @project_id INT
AS
BEGIN
    UPDATE projects
    SET total_cost = (
        SELECT ISNULL(SUM(total_price), 0)
        FROM purchases
        WHERE material_id IN (
            SELECT id FROM materials WHERE project_id = @project_id
        )
    )
    WHERE id = @project_id;
END;
GO

-- ============================================
-- إنشاء Triggers
-- ============================================

-- Trigger: تحديث total_cost عند إضافة مشتريات
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'update_project_cost_after_purchase')
    DROP TRIGGER update_project_cost_after_purchase;
GO

CREATE TRIGGER update_project_cost_after_purchase
ON purchases
AFTER INSERT
AS
BEGIN
    UPDATE p
    SET total_cost = (
        SELECT ISNULL(SUM(pur.total_price), 0)
        FROM purchases pur
        JOIN materials m ON pur.material_id = m.id
        WHERE m.project_id = p.id
    )
    FROM projects p
    WHERE p.id IN (
        SELECT m.project_id 
        FROM materials m 
        WHERE m.id IN (SELECT material_id FROM inserted WHERE material_id IS NOT NULL)
    );
END;
GO

-- ============================================
-- نهاية الملف
-- ============================================
