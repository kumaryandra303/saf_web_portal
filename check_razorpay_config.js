// Check Razorpay Configuration
require('dotenv').config();

console.log('\n🔍 Checking Razorpay Configuration...\n');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Current Configuration:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!RAZORPAY_KEY_ID) {
    console.log('❌ RAZORPAY_KEY_ID: NOT SET');
} else if (RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
    console.log('❌ RAZORPAY_KEY_ID: PLACEHOLDER VALUE (needs actual key)');
} else {
    console.log('✅ RAZORPAY_KEY_ID: ' + RAZORPAY_KEY_ID.substring(0, 15) + '...');
}

if (!RAZORPAY_KEY_SECRET) {
    console.log('❌ RAZORPAY_KEY_SECRET: NOT SET');
} else if (RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
    console.log('❌ RAZORPAY_KEY_SECRET: PLACEHOLDER VALUE (needs actual secret)');
} else {
    console.log('✅ RAZORPAY_KEY_SECRET: ' + RAZORPAY_KEY_SECRET.substring(0, 10) + '... (hidden)');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || 
    RAZORPAY_KEY_ID === 'your_razorpay_key_id' || 
    RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
    
    console.log('⚠️  RAZORPAY NOT CONFIGURED!\n');
    console.log('📝 To fix this:\n');
    console.log('1. Open the .env file in the root folder');
    console.log('2. Add these lines (with your actual keys):\n');
    console.log('   RAZORPAY_KEY_ID=rzp_test_your_actual_key_here');
    console.log('   RAZORPAY_KEY_SECRET=your_actual_secret_here\n');
    console.log('3. Get your keys from: https://dashboard.razorpay.com/app/keys');
    console.log('4. Restart the server: npm start\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(1);
} else {
    console.log('✅ Razorpay is configured correctly!\n');
    console.log('🎉 Payment integration should work now.\n');
    console.log('Test with:');
    console.log('  - UPI: success@razorpay');
    console.log('  - Card: 4111 1111 1111 1111\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
}


