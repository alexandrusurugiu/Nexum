require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const componentsRoutes = require('./routes/componentsRouter');
const peripheralsRoutes = require('./routes/peripheralsRouter');

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

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
})