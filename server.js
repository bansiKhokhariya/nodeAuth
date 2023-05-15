const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const errorHandler = require('./middleware/errorHandler')
const connectionDb = require('./config/dbConnection')
const bodyParser = require('body-parser');


connectionDb();
const port = process.env.PORT;

// app.use(express.json());
app.use(bodyParser.json())
app.use("/api/contact", require('./routes/contactsRoute'));
app.use("/api/user", require('./routes/userRoute'));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});