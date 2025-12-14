import express from "express";
import 'dotenv/config.js';
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

let corsOptions = {
    origin: process.env.ORIGIN
}
//middleware
app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) =>{
    console.log(req.path, req.method);
    next();
})

try {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Listening to port ${process.env.PORT || 3000}...`);    
    });
} catch(e){
    console.log(e);
}

app.use('/users', UserRoutes);  

