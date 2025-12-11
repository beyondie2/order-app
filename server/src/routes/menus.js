const express = require('express');
const router = express.Router();
const { query } = require('../db');

/**
 * GET /api/menus
 * 모든 메뉴 목록 조회
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        temperature,
        description,
        price,
        image_url as "imageUrl",
        stock,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM menus
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
 * GET /api/menus/:id
 * 특정 메뉴 조회
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        id,
        name,
        temperature,
        description,
        price,
        image_url as "imageUrl",
        stock,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM menus
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
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

/**
 * PATCH /api/menus/:id/stock
 * 특정 메뉴의 재고 수정
 */
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // 유효성 검사
    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        error: '재고 수량을 입력해주세요.'
      });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: '재고 수량은 0 이상의 숫자여야 합니다.'
      });
    }

    const result = await query(`
      UPDATE menus
      SET stock = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, temperature, stock
    `, [stock, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
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

