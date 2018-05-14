const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')

var db
MongoClient.connect('mongodb://pandah3:coolio3@ds119800.mlab.com:19800/star-wars-quotes', (err, client) => {
  if (err) return console.log(err);
  db = client.db('star-wars-quotes')
  app.listen(3000, () => {
    console.log('listening on 3000');
  })
})

app.get('/', (req, res) => {
  // res.sendFile('/Users/Loo/Downloads/startnew/index.html');
  db.collection('quotes').find().toArray((err,result) => {
    if (err) return console.log(err);
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('saved to database');
  res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
