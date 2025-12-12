require('dotenv').config();

console.log('환경 변수 확인:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '설정됨 ✅' : '설정 안됨 ❌');
console.log('- DB_HOST:', process.env.DB_HOST || '(기본값: localhost)');
console.log('- DB_NAME:', process.env.DB_NAME || '(기본값: coffee_order)');

