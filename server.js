require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

var db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/quotes', (req, res) => {
    db.collection('quotes').find().toArray(function (err, result) {
        if (err) {
            console.log(err);
        }
        return res.json(result);
    });
});

app.post('/quotes', (req, res) => {
    console.log('/quotes', req.body.data);
    db.collection('quotes').save(req.body.data, (err, result) => {
        if (err) {
            console.log(err);
        }
        return res.json(result);
    });
});

app.put('/quotes', (req, res) => {
    db.collection('quotes')
        .findOneAndUpdate({ _id: new ObjectID(req.body.data._id) }, {
            $set: {
                quote: req.body.data.quote
            }
        }, {
                sort: { _id: -1 },
                upsert: true
            }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            });
});

app.delete('/quotes', (req, res) => {
    console.log('delete', req);
    db.collection('quotes').findOneAndDelete({ _id: new ObjectID(req.body._id) },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send({ message: 'Quote deleted' })
        });
});

app.use(express.static('public'));

MongoClient.connect(process.env.MONGO_URL, (err, client) => {
    if (err) return console.log(err);

    db = client.db('quotes-list');

    app.listen(3000, function () {
        console.log('listening on 3000');
    });
});