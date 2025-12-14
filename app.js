import express from "express";
import 'dotenv/config.js';
import InventoryRoutes from "./routers/InventoryRoutes.js"
import OrderRoutes from "./routers/OrderRoutes.js"; 
import cors from "cors";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'ShirtPrint API is running',
        time: new Date().toISOString(),
        endpoints: {
            users: '/users',
            orders: '/orders',
            inventory: '/inventory',
            test: '/test'
        }
    });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/orders', OrderRoutes);


import UserRoutes from "./routers/UserRoutes.js"; 
import cors from "cors";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/inventory', InventoryRoutes);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});