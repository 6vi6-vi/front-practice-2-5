const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    {
        id: nanoid(6),
        name: 'Стиральная машина',
        category: 'Бытовая техника',
        description: '7 кг, 1200 об/мин',
        price: 35000,
        stock: 15
    },
    {
        id: nanoid(6),
        name: 'Холодильник',
        category: 'Бытовая техника',
        description: 'No Frost, общий объем 325 л',
        price: 46000,
        stock: 8
    },
    {
        id: nanoid(6),
        name: 'Телевизор',
        category: 'Электроника',
        description: 'Smart TV, HDR, Android TV',
        price: 68000,
        stock: 12
    },
    {
        id: nanoid(6),
        name: 'Ноутбук',
        category: 'Компьютеры',
        description: 'Intel Core i7, 16GB RAM',
        price: 90000,
        stock: 5
    },
    {
        id: nanoid(6),
        name: 'iPhone 15',
        category: 'Смартфоны',
        description: '128GB, двойная камера',
        price: 90000,
        stock: 23
    },
    {
        id: nanoid(6),
        name: 'Планшет',
        category: 'Электроника',
        description: '256GB',
        price: 110000,
        stock: 7
    },
    {
        id: nanoid(6),
        name: 'Наушники',
        category: 'Аксессуары',
        description: 'Беспроводные, шумоподавление',
        price: 28000,
        stock: 42
    },
    {
        id: nanoid(6),
        name: 'Кофемашина',
        category: 'Бытовая техника',
        description: 'Автоматическая',
        price: 46000,
        stock: 11
    },
    {
        id: nanoid(6),
        name: 'Фитнес-браслет',
        category: 'Аксессуары',
        description: 'AMOLED экран, пульсометр',
        price: 4000,
        stock: 150
    },
    {
        id: nanoid(6),
        name: 'Монитор',
        category: 'Компьютеры',
        description: '240Hz, изогнутый',
        price: 35000,
        stock: 18
    },
    {
        id: nanoid(6),
        name: 'Пылесос',
        category: 'Бытовая техника',
        description: 'Беспроводной, лазерная подсветка',
        price: 60000,
        stock: 6
    },
    {
        id: nanoid(6),
        name: 'Умные часы',
        category: 'Аксессуары',
        description: 'GPS, кислород в крови',
        price: 43000,
        stock: 21
    }
];

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

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

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

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

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const exists = products.some((p) => p.id == id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((p) => p.id != id);

    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});