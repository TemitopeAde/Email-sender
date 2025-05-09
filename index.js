require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendProtonEmail } = require('./controllers/email');
const cors = require("cors");


const app = express();
app.use(cors("*"))
app.use(bodyParser.json());

app.post('/api/v1/send-email', sendProtonEmail)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
