const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    {
        id: nanoid(6),
        name: 'Стиральная машина Samsung',
        category: 'Бытовая техника',
        description: 'Фронтальная загрузка, 7 кг, класс A+++, 1200 об/мин',
        price: 34990,
        stock: 15
    },
    {
        id: nanoid(6),
        name: 'Холодильник LG',
        category: 'Бытовая техника',
        description: 'No Frost, общий объем 325 л, инверторный компрессор',
        price: 45990,
        stock: 8
    },
    {
        id: nanoid(6),
        name: 'Телевизор Sony Bravia',
        category: 'Электроника',
        description: '4K UHD, 55", Smart TV, HDR, Android TV',
        price: 67990,
        stock: 12
    },
    {
        id: nanoid(6),
        name: 'Ноутбук ASUS ROG',
        category: 'Компьютеры',
        description: 'Intel Core i7, 16GB RAM, 512GB SSD, RTX 3060',
        price: 89990,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'Смартфон iPhone 15',
        category: 'Смартфоны',
        description: '6.1", A16 Bionic, 128GB, двойная камера 48MP',
        price: 89990,
        stock: 23
    },
    {
        id: nanoid(6),
        name: 'Планшет iPad Pro',
        category: 'Электроника',
        description: '12.9", M2 чип, 256GB, Liquid Retina XDR',
        price: 109990,
        stock: 7
    },
    {
        id: nanoid(6),
        name: 'Наушники Sony WH-1000XM5',
        category: 'Аксессуары',
        description: 'Беспроводные, шумоподавление, 30ч работы',
        price: 27990,
        stock: 42
    },
    {
        id: nanoid(6),
        name: 'Кофемашина DeLonghi',
        category: 'Бытовая техника',
        description: 'Автоматическая, 15 бар, капучинатор',
        price: 45990,
        stock: 11
    },
    {
        id: nanoid(6),
        name: 'Фитнес-браслет Xiaomi',
        category: 'Аксессуары',
        description: 'Mi Band 8, AMOLED экран, пульсометр',
        price: 3990,
        stock: 150
    },
    {
        id: nanoid(6),
        name: 'Монитор Samsung Odyssey',
        category: 'Компьютеры',
        description: '27", 240Hz, 1ms, QLED, изогнутый',
        price: 34990,
        stock: 18
    },
    {
        id: nanoid(6),
        name: 'Пылесос Dyson V15',
        category: 'Бытовая техника',
        description: 'Беспроводной, лазерная подсветка, 60 мин работы',
        price: 59990,
        stock: 6
    },
    {
        id: nanoid(6),
        name: 'Умные часы Apple Watch',
        category: 'Аксессуары',
        description: 'Series 9, GPS, Always-On Retina, кислород в крови',
        price: 42990,
        stock: 21
    }
];

app.use(express.json());

// CORS для React приложения
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для получения товара из списка
function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

// POST /api/products
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock } = req.body;

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description ? description.trim() : '',
        price: Number(price),
        stock: Number(stock),
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// GET /api/products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    res.json(product);
});

// PATCH /api/products/:id
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    // Нельзя PATCH без полей
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }

    const { name, category, description, price, stock } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    res.json(product);
});

// DELETE /api/products/:id
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const exists = products.some((p) => p.id == id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((p) => p.id != id);

    // 204 без тела
    res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});