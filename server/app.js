const dotenv = require('dotenv').config();
const express = require('express');
const connectDataBase = require('../bdd');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

const {justifyText,getToken,getEmail} = require('../bdd/function');

// Permet de regler quelques problèmes 
const cors = require('cors');
app.use(cors({
  origin:["http://localhost:3000"],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}));
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}))


app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/api/token',getToken)

app.post('/api/justify',justifyText)

app.get('/api/getemail/:token',getEmail)

connectDataBase();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
