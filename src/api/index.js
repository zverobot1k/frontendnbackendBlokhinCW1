const API_BASE = '/api/products';

export async function fetchProducts() {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error('Ошибка загрузки товаров');
  }
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Ошибка при создании товара';
    try {
      const body = await res.json();
      if (body && body.error) {
        message = body.error;
      }
    } catch (e) {
      // игнорирование ошибки парсинга
    }
    throw new Error(message);
  }

  return res.json();
}

console.log('Happy developing ✨')
