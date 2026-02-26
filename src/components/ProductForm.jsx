import React, { useState } from 'react';
import { createProduct } from '../api';

export function ProductForm({ onProductCreated }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.category || !form.description) {
      setError('Заполните название, категорию и описание.');
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (Number.isNaN(price) || Number.isNaN(stock) || price <= 0 || stock < 0) {
      setError('Цена должна быть > 0, количество — неотрицательное число.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await createProduct({
        name: form.name,
        category: form.category,
        description: form.description,
        price,
        stock,
      });
      onProductCreated(created);
      setForm({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2 className="product-form__title">Добавить товар</h2>
      <p className="product-form__hint">Все поля обязательны для заполнения.</p>

      <div className="product-form__grid">
        <div className="product-form__field">
          <label className="product-form__label" htmlFor="name">
            Название
          </label>
          <input
            id="name"
            name="name"
            className="product-form__input"
            value={form.name}
            onChange={handleChange}
            placeholder="Например, Rick Owens Sneakers"
          />
        </div>

        <div className="product-form__field">
          <label className="product-form__label" htmlFor="category">
            Категория
          </label>
          <input
            id="category"
            name="category"
            className="product-form__input"
            value={form.category}
            onChange={handleChange}
            placeholder="Одежда, Обувь, Аксессуары..."
          />
        </div>

        <div className="product-form__field product-form__field--full">
          <label className="product-form__label" htmlFor="description">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            className="product-form__textarea"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Коротко опишите товар"
          />
        </div>

        <div className="product-form__field">
          <label className="product-form__label" htmlFor="price">
            Цена, ₽
          </label>
          <input
            id="price"
            name="price"
            className="product-form__input"
            value={form.price}
            onChange={handleChange}
            placeholder="2499"
            inputMode="decimal"
          />
        </div>

        <div className="product-form__field">
          <label className="product-form__label" htmlFor="stock">
            Количество на складе
          </label>
          <input
            id="stock"
            name="stock"
            className="product-form__input"
            value={form.stock}
            onChange={handleChange}
            placeholder="10"
            inputMode="numeric"
          />
        </div>
      </div>

      {error && <div className="product-form__error">{error}</div>}

      <div className="product-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Сохраняем...' : 'Добавить товар'}
        </button>
      </div>
    </form>
  );
}

