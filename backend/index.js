require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const componentsRoutes = require('./routes/componentsRouter');
const peripheralsRoutes = require('./routes/peripheralsRouter');
const laptopsRoutes = require('./routes/laptopsRouter');
const cartRoutes = require('./routes/cartRouter');
const authRoutes = require('./routes/authRouter');
const monitorsRoutes = require('./routes/monitorsRouter');
const configRoutes = require('./routes/configRouter');
const searchRoutes = require('./routes/searchRouter');

const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.use('/server/components', componentsRoutes);
app.use('/server/peripherals', peripheralsRoutes);
app.use('/server/laptops', laptopsRoutes);
app.use('/server/cart', cartRoutes);
app.use('/server/auth', authRoutes);
app.use('/server/monitors', monitorsRoutes);
app.use('/server/config', configRoutes);
app.use('/server/search', searchRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
})