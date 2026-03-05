import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../api';
import { ProductCard } from '../../components/ProductCard';
import { ProductForm } from '../../components/ProductForm';
import './ProductsPage.scss';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  function handleProductCreated(product) {
    setProducts((prev) => [product, ...prev]);
  }

  function handleProductUpdated(updated) {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }
  
  function handleProductDeleted(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }
  

  if (loading) {
    return <div className="state">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="state state--error">Ошибка: {error}</div>;
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-header__title">Интернет‑магазин стритвир‑брендов</h1>
        <p className="app-header__subtitle">
          Управляйте товарами: добавляйте новые и смотрите актуальный список.
        </p>
      </header>

      <div className="layout">
        <ProductForm onProductCreated={handleProductCreated} />

        <section className="products-section">
          <h2 className="products-section__title">Список товаров</h2>
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onUpdated={handleProductUpdated}
                onDeleted={handleProductDeleted}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

