const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const port = 3000
require('dotenv').config()


app.use('/', express.static('public'));
app.get('/auth/', (req, res) => {
  const body = {
    "client_id" : process.env.CLIENT_ID,
    "client_secret" : process.env.CLIENT_SECRET,
    "redirect_uri" : process.env.REDIRECT_URI
  };
  console.log(body);
  res.send(body);
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/auth/', (req, res) => {
  console.log('post:auth');
  console.log(req.body);
  const options = {
    method: 'POST',
    url: "https://accounts.secure.freee.co.jp/public_api/token",
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    },
    form: req.body,
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.post('/revoke/', (req, res) => {
  console.log(req.body.access_token);
  const options = {
    method: 'POST',
    url: "https://accounts.secure.freee.co.jp/public_api/revoke",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.body.access_token,
    },
    form: {
      "token" : req.body,
    },
    json: true
  };
  request(options, function(error, response, body) {
    res.send(body);
  });
});
app.get('/user/me/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/users/me",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/companies/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/companies",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/company/', (req, res) => {
  console.log(req.query.id)
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/companies/" + req.query.id,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
