const express = require('express');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
const port = 5001;

// База данных товаров 
let products = [
  {
    id: nanoid(10),
    name: 'Rick Owens Sneakers',
    category: 'Обувь',
    description: 'Высокие кеды из кожи, черно‑белые.',
    price: 2499,
    stock: 5,
  },
  {
    id: nanoid(10),
    name: 'Balenciaga Hoodie',
    category: 'Одежда',
    description: 'Оверсайз худи с логотипом.',
    price: 3599,
    stock: 8,
  },
  {
    id: nanoid(10),
    name: 'Maison Margiela Tabi Boots',
    category: 'Обувь',
    description: 'Фирменные кожаные ботинки Tabi.',
    price: 4499,
    stock: 3,
  },
  {
    id: nanoid(10),
    name: 'Off-White Industrial Belt',
    category: 'Аксессуары',
    description: 'Жёлтый ремень с брендингом.',
    price: 799,
    stock: 15,
  },
  {
    id: nanoid(10),
    name: 'Fear of God Essentials Tee',
    category: 'Одежда',
    description: 'Базовая футболка oversize.',
    price: 999,
    stock: 20,
  },
  {
    id: nanoid(10),
    name: 'Palm Angels Track Pants',
    category: 'Одежда',
    description: 'Спортивные штаны с лампасами.',
    price: 1899,
    stock: 7,
  },
  {
    id: nanoid(10),
    name: 'Yeezy 700',
    category: 'Обувь',
    description: 'Кроссовки Yeezy 700 Wave Runner.',
    price: 2999,
    stock: 6,
  },
  {
    id: nanoid(10),
    name: 'Stone Island Jacket',
    category: 'Одежда',
    description: 'Куртка с фирменной нашивкой-компасом.',
    price: 4299,
    stock: 4,
  },
  {
    id: nanoid(10),
    name: 'Vetements Cap',
    category: 'Аксессуары',
    description: 'Бейсболка Vetements с вышивкой.',
    price: 699,
    stock: 12,
  },
  {
    id: nanoid(10),
    name: 'Alyx Rollercoaster Belt',
    category: 'Аксессуары',
    description: 'Ремень с фирменной пряжкой‑карабином.',
    price: 1199,
    stock: 9,
  },
];

// Middleware для парсинга JSON
app.use(express.json());

// (Сервер только для API, фронт крутится на отдельном дев-сервере React)

// Middleware для логирования запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${res.statusCode} ${req.path}`,
    );
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', req.body);
    }
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Продукт не найден' });
    return null;
  }
  return product;
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Products API работает' });
});

// Получить список продуктов
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Добавить новый продукт
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;

  if (!name || !category || !description || price == null || stock == null) {
    return res.status(400).json({ error: 'Не все поля товара заполнены' });
  }

  const newProduct = {
    id: nanoid(10),
    name: String(name).trim(),
    category: String(category).trim(),
    description: String(description).trim(),
    price: Number(price),
    stock: Number(stock),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Получить продукт по id
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

// Обновить продукт по id
app.patch('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  const { name, category, description, price, stock } = req.body;

  if (
    name === undefined &&
    category === undefined &&
    description === undefined &&
    price === undefined &&
    stock === undefined
  ) {
    return res.status(400).json({ error: 'Нечего обновлять' });
  }

  if (name !== undefined) product.name = String(name).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined)
    product.description = String(description).trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

// Удалить продукт по id
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: 'Продукт не найден' });

  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

// 404 для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Не найдено' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Неизвестная ошибка', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
  console.log(`API сервер запущен на http://localhost:${port}`);
});

