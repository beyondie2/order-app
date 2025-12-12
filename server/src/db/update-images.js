/**
 * 메뉴 이미지 URL 업데이트 스크립트
 */

require('dotenv').config();
const { Pool } = require('pg');

const updateImages = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('🔄 메뉴 이미지 URL 업데이트 중...\n');

    // 아메리카노(ICE) 이미지 업데이트
    await pool.query(`
      UPDATE menus 
      SET image_url = '/images/americano-ice.jpg', updated_at = NOW()
      WHERE name = '아메리카노' AND temperature = 'ICE'
    `);
    console.log('✅ 아메리카노(ICE) 이미지 업데이트 완료');

    // 아메리카노(HOT) 이미지 업데이트
    await pool.query(`
      UPDATE menus 
      SET image_url = '/images/americano-hot.jpg', updated_at = NOW()
      WHERE name = '아메리카노' AND temperature = 'HOT'
    `);
    console.log('✅ 아메리카노(HOT) 이미지 업데이트 완료');

    // 카페라떼 이미지 업데이트 (ICE, HOT 모두)
    await pool.query(`
      UPDATE menus 
      SET image_url = '/images/caffe-latte.jpg', updated_at = NOW()
      WHERE name = '카페라떼'
    `);
    console.log('✅ 카페라떼 이미지 업데이트 완료');

    // 결과 확인
    const result = await pool.query(`
      SELECT id, name, temperature, image_url 
      FROM menus 
      ORDER BY id
    `);

    console.log('\n📋 업데이트된 메뉴 목록:');
    console.table(result.rows);

    await pool.end();
    console.log('\n🎉 이미지 URL 업데이트가 완료되었습니다!');

  } catch (error) {
    console.error('❌ 업데이트 실패:', error.message);
    process.exit(1);
  }
};

updateImages();

