/**
 * أداة للتحقق من إعداد Google OAuth
 * Tool to check Google OAuth configuration
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

console.log('\n🔍 التحقق من إعداد Google OAuth...\n');
console.log('Checking Google OAuth configuration...\n');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const frontendUrl = process.env.FRONTEND_URL;

// Check if .env file exists
const fs = require('fs');
const envPath = require('path').join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

console.log('📁 ملف .env:', envExists ? '✅ موجود' : '❌ غير موجود');
console.log('   .env file:', envExists ? '✅ exists' : '❌ not found');
console.log('');

// Check Client ID
const hasClientId = clientId && 
  clientId !== 'your-google-client-id-here' && 
  !clientId.includes('your-google') &&
  clientId.length > 10;

console.log('🔑 GOOGLE_CLIENT_ID:');
if (hasClientId) {
  console.log('   ✅ مُعد بشكل صحيح');
  console.log('   ✅ Configured correctly');
  console.log(`   📋 القيمة: ${clientId.substring(0, 30)}...`);
  console.log(`   📋 Value: ${clientId.substring(0, 30)}...`);
} else {
  console.log('   ❌ غير مُعد أو placeholder');
  console.log('   ❌ Not configured or placeholder');
  if (clientId) {
    console.log(`   📋 القيمة الحالية: ${clientId}`);
    console.log(`   📋 Current value: ${clientId}`);
  }
}
console.log('');

// Check Client Secret
const hasClientSecret = clientSecret && 
  clientSecret !== 'your-google-client-secret-here' && 
  !clientSecret.includes('your-google') &&
  clientSecret.length > 10;

console.log('🔐 GOOGLE_CLIENT_SECRET:');
if (hasClientSecret) {
  console.log('   ✅ مُعد بشكل صحيح');
  console.log('   ✅ Configured correctly');
  console.log(`   📋 الطول: ${clientSecret.length} حرف`);
  console.log(`   📋 Length: ${clientSecret.length} characters`);
} else {
  console.log('   ❌ غير مُعد أو placeholder');
  console.log('   ❌ Not configured or placeholder');
  if (clientSecret) {
    console.log(`   📋 القيمة الحالية: ${clientSecret.substring(0, 20)}...`);
    console.log(`   📋 Current value: ${clientSecret.substring(0, 20)}...`);
  }
}
console.log('');

// Check Frontend URL
console.log('🌐 FRONTEND_URL:');
if (frontendUrl) {
  console.log('   ✅ موجود');
  console.log('   ✅ Set');
  console.log(`   📋 القيمة: ${frontendUrl}`);
  console.log(`   📋 Value: ${frontendUrl}`);
  
  // Check if it's localhost for development
  if (frontendUrl.includes('localhost')) {
    console.log('   💡 ملاحظة: هذا للـ Development');
    console.log('   💡 Note: This is for Development');
  }
} else {
  console.log('   ⚠️ غير موجود');
  console.log('   ⚠️ Not set');
  console.log('   💡 يجب أن يكون: http://localhost:3000');
  console.log('   💡 Should be: http://localhost:3000');
}
console.log('');

// Final status
console.log('═══════════════════════════════════════\n');
if (hasClientId && hasClientSecret && frontendUrl) {
  console.log('✅ Google OAuth جاهز للاستخدام!');
  console.log('✅ Google OAuth is ready to use!\n');
  console.log('📝 Redirect URI المطلوب في Google Cloud Console:');
  console.log('📝 Required Redirect URI in Google Cloud Console:');
  console.log(`   ${frontendUrl}/auth/google/callback\n`);
  console.log('📝 Authorized JavaScript origins:');
  console.log(`   ${frontendUrl}\n`);
} else {
  console.log('❌ Google OAuth غير مُعد بشكل كامل');
  console.log('❌ Google OAuth is not fully configured\n');
  
  if (!hasClientId) {
    console.log('⚠️ يجب إعداد GOOGLE_CLIENT_ID');
    console.log('⚠️ Need to set GOOGLE_CLIENT_ID');
    console.log('   → اذهب إلى: https://console.cloud.google.com/');
    console.log('   → Go to: https://console.cloud.google.com/\n');
  }
  
  if (!hasClientSecret) {
    console.log('⚠️ يجب إعداد GOOGLE_CLIENT_SECRET');
    console.log('⚠️ Need to set GOOGLE_CLIENT_SECRET');
    console.log('   → اذهب إلى: https://console.cloud.google.com/');
    console.log('   → Go to: https://console.cloud.google.com/\n');
  }
  
  console.log('📖 اقرأ الدليل: GOOGLE-OAUTH-SETUP-GUIDE.md');
  console.log('📖 Read guide: GOOGLE-OAUTH-SETUP-GUIDE.md\n');
}

console.log('═══════════════════════════════════════\n');
