const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const port = 3000
const csv=require('csvtojson')
const iconv = require('iconv-lite');
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
    qs: {
      details: true
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/account_items/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/account_items/",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: req.query,
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/reports/trial_bs/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/reports/trial_bs/",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: {
      company_id: req.query.company_id,
      account_item_display_type: 'group',
      breakdown_display_type: 'account_item'
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/reports/trial_pl/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/reports/trial_pl/",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: {
      company_id: req.query.company_id,
      account_item_display_type: 'group',
      breakdown_display_type: 'account_item'
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/journals/', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/journals",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: {
      company_id: req.query.company_id,
      download_type: 'generic',
      visible_tags: Array['all']
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/journals/status', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/journals/reports/" + req.query.download_id + "/status",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: {
      company_id: req.query.company_id,
      visible_tags: Array['all']
    },
    json: true
  };
  request(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
app.get('/journals/download', (req, res) => {
  const options = {
    method: 'GET',
    url: "https://api.freee.co.jp/api/1/journals/reports/" + req.query.download_id + "/download",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.header('token'),
    },
    qs: {
      company_id: req.query.company_id
    },
    json: true,
    encoding: null
  };
  request(options, function(error, response, body) {
    console.log(response.headers["content-type"])
    console.log(body);
    const retStr = iconv.decode(body, 'Shift-JIS');
    console.log(retStr.toString('UTF-8'))
    csv({
      // noheader:true
    })
   .fromString(retStr.toString('UTF-8'))
    .then((json)=>{ 
      console.log(json);
      res.send(json);        
    });
  });
});
app.listen(port, () => console.log(`freee API sample app listening on port ${port}!`))
