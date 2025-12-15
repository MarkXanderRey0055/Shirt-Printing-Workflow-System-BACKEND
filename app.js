import express from "express";
import 'dotenv/config.js';
import UserRoutes from "./routers/UserRoutes.js";
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



app.use('/users', UserRoutes);
app.use('/orders', OrderRoutes);
app.use('/inventory', InventoryRoutes);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});