# 🗄️ تثبيت MySQL من Terminal - دليل شامل

## 📋 الطرق المختلفة

---

## 🚀 الطريقة 1: Chocolatey (Windows) - الأسهل

### الخطوة 1: تثبيت Chocolatey

افتح **PowerShell كـ Administrator** ثم نفذ:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### الخطوة 2: تثبيت MySQL

```powershell
choco install mysql -y
```

### الخطوة 3: تشغيل MySQL

```powershell
net start mysql
```

### الخطوة 4: إنشاء قاعدة البيانات

```powershell
mysql -u root -p < server\sql\schema.sql
```

---

## 🚀 الطريقة 2: winget (Windows 10/11)

### تثبيت MySQL:

```powershell
winget install Oracle.MySQL
```

### تشغيل MySQL:

```powershell
net start mysql80
```

---

## 🚀 الطريقة 3: XAMPP (Windows) - موصى به للمبتدئين

### 1. تحميل XAMPP:
```powershell
# تحميل من الموقع
# https://www.apachefriends.org/
```

### 2. تثبيت XAMPP:
- شغّل الملف المحمّل
- اتبع التعليمات

### 3. تشغيل MySQL من XAMPP:
- افتح XAMPP Control Panel
- اضغط Start بجانب MySQL

### 4. استخدام MySQL:
```powershell
# MySQL موجود في:
C:\xampp\mysql\bin\mysql.exe

# أو استخدم:
mysql -u root -p
```

---

## 🚀 الطريقة 4: تحميل مباشر

### 1. تحميل MySQL:
```powershell
# اذهب إلى:
# https://dev.mysql.com/downloads/mysql/

# أو استخدم PowerShell:
Invoke-WebRequest -Uri "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.XX.msi" -OutFile "mysql-installer.msi"
```

### 2. تثبيت:
```powershell
Start-Process msiexec.exe -ArgumentList "/i mysql-installer.msi /quiet" -Wait
```

---

## 🐧 Linux (Ubuntu/Debian)

```bash
# تحديث النظام
sudo apt-get update

# تثبيت MySQL
sudo apt-get install mysql-server -y

# تشغيل MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# إعداد الأمان
sudo mysql_secure_installation

# إنشاء قاعدة البيانات
mysql -u root -p < server/sql/schema.sql
```

---

## 🍎 Mac (Homebrew)

```bash
# تثبيت MySQL
brew install mysql

# تشغيل MySQL
brew services start mysql

# إنشاء قاعدة البيانات
mysql -u root -p < server/sql/schema.sql
```

---

## ✅ التحقق من التثبيت

### Windows:
```powershell
mysql --version
```

### Linux/Mac:
```bash
mysql --version
```

---

## 🔧 إعداد MySQL بعد التثبيت

### 1. تسجيل الدخول:
```bash
mysql -u root -p
```

### 2. إنشاء قاعدة البيانات:
```sql
CREATE DATABASE construction_management;
USE construction_management;
```

### 3. استيراد Schema:
```bash
mysql -u root -p construction_management < server/sql/schema.sql
```

### 4. استيراد بيانات تجريبية:
```bash
mysql -u root -p construction_management < server/sql/sample-data.sql
```

---

## 🆘 حل المشاكل

### مشكلة: MySQL لا يبدأ
```powershell
# Windows
net start mysql

# Linux
sudo systemctl start mysql

# Mac
brew services start mysql
```

### مشكلة: كلمة المرور مفقودة
```sql
-- في MySQL
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### مشكلة: Port 3306 مستخدم
```powershell
# Windows
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3306
```

---

## 📝 Environment Variables

أضف إلى `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_management
DB_PORT=3306
```

---

## 🎯 التوصية

### للمبتدئين:
**XAMPP** - أسهل طريقة

### للمحترفين:
**Chocolatey** أو **winget** - من Terminal

---

## 📚 مراجع

- [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- [Chocolatey](https://chocolatey.org/)
- [XAMPP](https://www.apachefriends.org/)

---

**تم التحديث:** [التاريخ الحالي]

























































