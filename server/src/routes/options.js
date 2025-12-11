const express = require('express');
const router = express.Router();
const { query } = require('../db');

/**
 * GET /api/options
 * 모든 옵션 목록 조회
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        price,
        created_at as "createdAt"
      FROM options
      ORDER BY id
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/options/:id
 * 특정 옵션 조회
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        id,
        name,
        price,
        created_at as "createdAt"
      FROM options
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '옵션을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

