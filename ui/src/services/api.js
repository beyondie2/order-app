/**
 * API 서비스 모듈
 * 백엔드 서버와 통신하는 함수들
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 디버깅: API URL 출력
console.log('🔗 API_BASE_URL:', API_BASE_URL);
console.log('🔗 VITE_API_URL env:', import.meta.env.VITE_API_URL);

/**
 * 공통 fetch 함수
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('📡 Fetching:', url);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    console.log('📡 Response status:', response.status);
    
    // 응답이 JSON이 아닐 수 있음
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('📡 Response is not JSON:', text);
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('📡 Fetch error:', error);
    
    // 네트워크 오류인 경우 더 친절한 메시지
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw error;
  }
};

// ==================== 메뉴 API ====================

/**
 * 메뉴 목록 조회
 */
export const getMenus = async () => {
  const result = await fetchAPI('/menus');
  return result.data;
};

/**
 * 특정 메뉴 조회
 */
export const getMenu = async (id) => {
  const result = await fetchAPI(`/menus/${id}`);
  return result.data;
};

/**
 * 메뉴 재고 수정
 */
export const updateMenuStock = async (id, stock) => {
  const result = await fetchAPI(`/menus/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  });
  return result.data;
};

// ==================== 옵션 API ====================

/**
 * 옵션 목록 조회
 */
export const getOptions = async () => {
  const result = await fetchAPI('/options');
  return result.data;
};

// ==================== 주문 API ====================

/**
 * 주문 목록 조회
 */
export const getOrders = async () => {
  const result = await fetchAPI('/orders');
  return { orders: result.data, stats: result.stats };
};

/**
 * 특정 주문 조회
 */
export const getOrder = async (id) => {
  const result = await fetchAPI(`/orders/${id}`);
  return result.data;
};

/**
 * 주문 생성
 */
export const createOrder = async (orderData) => {
  const result = await fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return result.data;
};

/**
 * 주문 상태 변경
 */
export const updateOrderStatus = async (id, status) => {
  const result = await fetchAPI(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return result.data;
};

// API URL 확인용 함수
export const getApiUrl = () => API_BASE_URL;
