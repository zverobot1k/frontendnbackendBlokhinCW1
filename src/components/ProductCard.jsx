import React from 'react';

export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p className="product-card__category">Категория: {product.category}</p>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__price">Цена: {product.price} ₽</p>
      <p className="product-card__stock">
        На складе: {product.stock} шт.
      </p>
    </div>
  );
}

