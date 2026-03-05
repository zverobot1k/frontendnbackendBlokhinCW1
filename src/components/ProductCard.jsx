import React, { useState } from 'react';
import { updateProduct, deleteProduct } from '../api';

export function ProductCard({ product, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    stock: product.stock,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name || !form.category || !form.description) {
      setError('Заполните все поля.');
      return;
    }
    if (Number.isNaN(price) || price <= 0 || Number.isNaN(stock) || stock < 0) {
      setError('Цена > 0, количество ≥ 0.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateProduct(product.id, { ...form, price, stock });
      onUpdated(updated);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Удалить «${product.name}»?`)) return;
    try {
      await deleteProduct(product.id);
      onDeleted(product.id);
    } catch (e) {
      setError(e.message);
    }
  }

  if (editing) {
    return (
      <div className="product-card product-card--editing">
        <input name="name" className="product-form__input" value={form.name} onChange={handleChange} placeholder="Название" />
        <input name="category" className="product-form__input" value={form.category} onChange={handleChange} placeholder="Категория" />
        <textarea name="description" className="product-form__textarea" value={form.description} onChange={handleChange} rows={2} />
        <input name="price" className="product-form__input" value={form.price} onChange={handleChange} placeholder="Цена" inputMode="decimal" />
        <input name="stock" className="product-form__input" value={form.stock} onChange={handleChange} placeholder="Количество" inputMode="numeric" />
        {error && <div className="product-form__error">{error}</div>}
        <div className="product-card__actions">
          <button className="btn btn--primary" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Сохраняем...' : 'Сохранить'}
          </button>
          <button className="btn btn--ghost" onClick={() => { setEditing(false); setError(null); }}>
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p className="product-card__category">Категория: {product.category}</p>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__price">Цена: {product.price} ₽</p>
      <p className="product-card__stock">На складе: {product.stock} шт.</p>
      {error && <div className="product-form__error">{error}</div>}
      <div className="product-card__actions">
        <button className="btn btn--secondary" onClick={() => setEditing(true)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
}

