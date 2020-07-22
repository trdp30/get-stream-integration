const express = require('express')
const app = express();
var cors = require('cors');
const data = require('./data.json')
const {connect} = require('getstream')

app.use(cors());
const port = 8080;

const client = connect('5np4fp9ukx9f', 'z2pah49pwyzurdw42eq7zkb8r4h28bqcegt3kd8ahrv47am35b3kp246488yqq5k', "86322");

const ericFeed = client.feed('user', 'eric', 'IaeKUlwInP1Uf9wpsnPokjpNkmo');

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/screenshot', (req, res) => {
  res.send({
    actor: "session_id",
    verb: "screenshot",
    object: "event_id",
    participants: data.participants
  })
});

app.post('/screenshot', (req, res) => {
  ericFeed.addActivity({
    actor: "session_id",
    verb: "screenshot",
    object: "event_id",
    participants: data.participants
  });
  res.send('Got a POST request')
})

app.get('/candidate', (req, res) => {
  res.send(data.candidate)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))