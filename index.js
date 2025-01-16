const express = require('express');
const connectDB = require('./backend/config/db'); 
const dotenv = require("dotenv")
const authRoutes = require('./backend/routes/authRoute');



dotenv.config();
connectDB();

app = express();

app.use(express.json());
app.use('/api/auth', authRoutes)


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
