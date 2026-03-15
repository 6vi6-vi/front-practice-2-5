import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedCategory = category.trim();
        const trimmedDescription = description.trim();
        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!trimmedName) {
            alert("Введите название товара");
            return;
        }
        if (!trimmedCategory) {
            alert("Введите категорию товара");
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            alert("Введите корректную цену");
            return;
        }
        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            alert("Введите корректное количество на складе");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: trimmedName,
            category: trimmedCategory,
            description: trimmedDescription,
            price: parsedPrice,
            stock: parsedStock,
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название товара *
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например, Холодильник LG"
                            autoFocus
                            required
                        />
                    </label>

                    <label className="label">
                        Категория *
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Например, Бытовая техника"
                            required
                        />
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Краткое описание товара"
                            rows="3"
                        />
                    </label>

                    <div className="form__row">
                        <label className="label">
                            Цена (₽) *
                            <input
                                className="input"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="35000"
                                inputMode="numeric"
                                required
                            />
                        </label>

                        <label className="label">
                            На складе (шт.) *
                            <input
                                className="input"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="10"
                                inputMode="numeric"
                                required
                            />
                        </label>
                    </div>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}