-- ============================================
-- إنشاء الجداول خطوة بخطوة (بدون Foreign Keys أولاً)
-- ثم إضافة العلاقات لاحقاً
-- ============================================

USE construction_management;
GO

-- حذف الجداول الموجودة
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
-- 1. جدول المستخدمين (Users) - بدون Foreign Keys
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

-- ============================================
-- 2. جدول الموردين (Suppliers)
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

-- ============================================
-- 3. جدول المشاريع (Projects) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_client ON projects(client_id);
CREATE INDEX idx_contractor ON projects(contractor_id);
CREATE INDEX idx_status ON projects(status);
GO

-- ============================================
-- 4. جدول المواد (Materials) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON materials(project_id);
CREATE INDEX idx_supplier ON materials(supplier_id);
GO

-- ============================================
-- 5. جدول المشتريات (Purchases) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchase_date ON purchases(purchase_date);
GO

-- ============================================
-- 6. جدول المدفوعات (Payments) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON payments(project_id);
CREATE INDEX idx_supplier ON payments(supplier_id);
CREATE INDEX idx_payment_date ON payments(payment_date);
GO

-- ============================================
-- 7. جدول إصدار المواد (Issues) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_material ON issues(material_id);
CREATE INDEX idx_project ON issues(project_id);
CREATE INDEX idx_issue_date ON issues(issue_date);
GO

-- ============================================
-- 8. جدول العقود (Contracts) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON contracts(project_id);
CREATE INDEX idx_client ON contracts(client_id);
CREATE INDEX idx_contractor ON contracts(contractor_id);
CREATE INDEX idx_contract_number ON contracts(contract_number);
GO

-- ============================================
-- 9. جدول الطلبات (Requests) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_client ON requests(client_id);
CREATE INDEX idx_contractor ON requests(contractor_id);
CREATE INDEX idx_status ON requests(status);
CREATE INDEX idx_request_number ON requests(request_number);
GO

-- ============================================
-- 10. جدول التقارير (Reports) - بدون Foreign Keys
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
    updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON reports(project_id);
CREATE INDEX idx_type ON reports(type);
CREATE INDEX idx_report_date ON reports(report_date);
GO

-- ============================================
-- 11. جدول المهندسين (Engineers)
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
    created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON project_engineers(project_id);
GO

-- ============================================
-- 12. جدول فرق العمل (Crews)
-- ============================================
CREATE TABLE project_crews (
    id INT PRIMARY KEY IDENTITY(1,1),
    project_id INT NOT NULL,
    crew_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
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
    created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_project ON project_images(project_id);
GO

PRINT 'تم إنشاء جميع الجداول بنجاح!';
PRINT 'الآن شغّل add-relationships-step-by-step.sql لإضافة العلاقات';
GO










