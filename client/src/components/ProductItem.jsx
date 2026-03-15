import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    const getStockStatus = (stock) => {
        if (stock === 0) return { text: "Нет в наличии", class: "stock--out" };
        if (stock < 5) return { text: "Мало", class: "stock--low" };
        if (stock < 15) return { text: "Средне", class: "stock--medium" };
        return { text: "Много", class: "stock--high" };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <div className="productCard">
            <div className="productCard__header">
                <div className="productCard__id">#{product.id}</div>
                <div className="productCard__category">{product.category}</div>
            </div>

            <div className="productCard__body">
                <h3 className="productCard__title">{product.name}</h3>
                <p className="productCard__description">{product.description}</p>
            </div>

            <div className="productCard__footer">
                <div className="productCard__price">
                    {product.price.toLocaleString()} ₽
                </div>
                <div className={`productCard__stock ${stockStatus.class}`}>
                    {stockStatus.text}: {product.stock} шт.
                </div>
            </div>

            <div className="productCard__actions">
                <button className="btn" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}