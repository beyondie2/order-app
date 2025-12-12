/**
 * 데이터베이스 초기화 스크립트
 * 실행: npm run db:init
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const initDatabase = async () => {
  let appPool;

  // Render.com DATABASE_URL이 있으면 사용
  if (process.env.DATABASE_URL) {
    console.log('🔄 DATABASE_URL을 사용하여 연결합니다...\n');
    appPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  } else {
    // 로컬 환경: 먼저 postgres 데이터베이스에 연결하여 coffee_order DB 생성
    const adminPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
      console.log('🔄 데이터베이스 초기화를 시작합니다...\n');

      // coffee_order 데이터베이스 생성 (이미 존재하면 무시)
      const dbName = process.env.DB_NAME || 'coffee_order';
      
      try {
        await adminPool.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ 데이터베이스 '${dbName}' 생성 완료`);
      } catch (err) {
        if (err.code === '42P04') {
          console.log(`ℹ️  데이터베이스 '${dbName}'가 이미 존재합니다.`);
        } else {
          throw err;
        }
      }

      await adminPool.end();

      // coffee_order 데이터베이스에 연결
      appPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: dbName,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      });
    } catch (error) {
      console.error('\n❌ 데이터베이스 생성 실패:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 PostgreSQL이 실행 중인지 확인해주세요.');
        console.log('   - Windows: pgAdmin에서 서버 상태 확인');
        console.log('   - Mac: brew services start postgresql');
      }
      
      process.exit(1);
    }
  }

  try {
    // SQL 파일 읽기 및 실행
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 테이블 생성 및 초기 데이터 삽입 중...\n');
    await appPool.query(sql);

    // 결과 확인
    const menusResult = await appPool.query('SELECT COUNT(*) as count FROM menus');
    const optionsResult = await appPool.query('SELECT COUNT(*) as count FROM options');

    console.log(`\n✅ 초기화 완료!`);
    console.log(`   - 메뉴: ${menusResult.rows[0].count}개`);
    console.log(`   - 옵션: ${optionsResult.rows[0].count}개`);

    await appPool.end();

    console.log('\n🎉 데이터베이스 초기화가 성공적으로 완료되었습니다!');
    
  } catch (error) {
    console.error('\n❌ 테이블 초기화 실패:', error.message);
    process.exit(1);
  }
};

initDatabase();
