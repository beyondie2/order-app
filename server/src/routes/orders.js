const express = require('express');
const router = express.Router();
const { query, pool } = require('../db');

/**
 * GET /api/orders
 * 모든 주문 목록 조회 (최신순)
 */
router.get('/', async (req, res, next) => {
  try {
    // 주문 목록 조회
    const ordersResult = await query(`
      SELECT 
        id,
        order_date as "orderDate",
        total_amount as "totalAmount",
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      ORDER BY order_date DESC
    `);

    // 각 주문의 상세 항목 조회
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await query(`
          SELECT 
            id,
            menu_id as "menuId",
            menu_name as "menuName",
            quantity,
            unit_price as "unitPrice",
            total_price as "totalPrice",
            options
          FROM order_items
          WHERE order_id = $1
        `, [order.id]);

        return {
          ...order,
          items: itemsResult.rows.map(item => ({
            ...item,
            options: item.options ? JSON.parse(item.options) : []
          }))
        };
      })
    );

    // 통계 계산
    const statsResult = await query(`
      SELECT 
        COUNT(*) as "totalOrders",
        COUNT(*) FILTER (WHERE status = 'pending') as "pendingOrders",
        COUNT(*) FILTER (WHERE status = 'accepted') as "acceptedOrders",
        COUNT(*) FILTER (WHERE status = 'preparing') as "preparingOrders",
        COUNT(*) FILTER (WHERE status = 'completed') as "completedOrders"
      FROM orders
    `);

    const stats = {
      totalOrders: parseInt(statsResult.rows[0].totalOrders),
      pendingOrders: parseInt(statsResult.rows[0].pendingOrders),
      acceptedOrders: parseInt(statsResult.rows[0].acceptedOrders),
      preparingOrders: parseInt(statsResult.rows[0].preparingOrders),
      completedOrders: parseInt(statsResult.rows[0].completedOrders)
    };

    res.json({
      success: true,
      data: orders,
      stats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/:id
 * 특정 주문 상세 조회
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 주문 조회
    const orderResult = await query(`
      SELECT 
        id,
        order_date as "orderDate",
        total_amount as "totalAmount",
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM orders
      WHERE id = $1
    `, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }

    // 주문 상세 항목 조회
    const itemsResult = await query(`
      SELECT 
        id,
        menu_id as "menuId",
        menu_name as "menuName",
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        options
      FROM order_items
      WHERE order_id = $1
    `, [id]);

    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows.map(item => ({
        ...item,
        options: item.options ? JSON.parse(item.options) : []
      }))
    };

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/orders
 * 새 주문 생성 + 재고 차감
 */
router.post('/', async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { items, totalAmount } = req.body;

    // 유효성 검사
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 필요합니다.'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: '유효한 총 금액이 필요합니다.'
      });
    }

    // 트랜잭션 시작
    await client.query('BEGIN');

    // 재고 확인
    for (const item of items) {
      const stockResult = await client.query(
        'SELECT id, name, temperature, stock FROM menus WHERE id = $1',
        [item.menuId]
      );

      if (stockResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: `메뉴를 찾을 수 없습니다. (menuId: ${item.menuId})`
        });
      }

      const menu = stockResult.rows[0];
      if (menu.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: '재고가 부족합니다.',
          details: {
            menuId: item.menuId,
            menuName: `${menu.name}(${menu.temperature})`,
            requested: item.quantity,
            available: menu.stock
          }
        });
      }
    }

    // 주문 생성
    const orderResult = await client.query(`
      INSERT INTO orders (total_amount, status)
      VALUES ($1, 'pending')
      RETURNING id, order_date as "orderDate", total_amount as "totalAmount", status
    `, [totalAmount]);

    const order = orderResult.rows[0];

    // 주문 상세 항목 저장 및 재고 차감
    for (const item of items) {
      // 주문 상세 저장
      await client.query(`
        INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, total_price, options)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        order.id,
        item.menuId,
        item.menuName,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        JSON.stringify(item.options || [])
      ]);

      // 재고 차감
      await client.query(`
        UPDATE menus
        SET stock = stock - $1, updated_at = NOW()
        WHERE id = $2
      `, [item.quantity, item.menuId]);
    }

    // 트랜잭션 커밋
    await client.query('COMMIT');

    // 생성된 주문 반환
    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        orderDate: order.orderDate,
        items: items.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          options: item.options || [],
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        totalAmount: order.totalAmount,
        status: order.status
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

/**
 * PATCH /api/orders/:id/status
 * 주문 상태 변경
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 유효한 상태 값 확인
    const validStatuses = ['pending', 'accepted', 'preparing', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 상태 값입니다.',
        validStatuses
      });
    }

    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, status, updated_at as "updatedAt"
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
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

