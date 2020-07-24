const express = require('express')
const app = express();
var cors = require('cors');
const data = require('./data.json')
const {connect} = require('getstream');
const moment = require('moment');

app.use(cors());
const port = 8080;

const client = connect('jagsx3acyacg', 'n3bk8f7mwzzpa5tckt6q2rqb329e4ekbr7ukdtsnghnrv6sh5773h35hukjb7dau', "86962", {'location': 'us-east'});

const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2Vzc2lvbl9pZCJ9.e_aA_ujjw5I897T2VlbLDZZP8IRLszl01XPVORrYdx0"
// const
// console.log('userToken', userToken)

const screenshotFeed = client.feed('screenshot', 'session_id', userToken);
const eventFeed = client.feed('event_critical', 'session_id', userToken);

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/screenshot', (req, res) => {
  res.send({
    actor: "session_id",
    verb: "screenshot",
    object: "event_id",
    participants: data.participants
  })
});

app.post('/screenshot', async (req, res) => {
  let count = 0
  await screenshotFeed.addActivity({
    actor: client.user("session_id"),
    verb: "screenshot",
    object: "event_id",
    participants: data.participants
  });
  res.send('Got a POST request')
})

app.get('/candidate', (req, res) => {
  res.send(data.candidate)
})

app.get('/candidate/:candidate_id', (req, res) => {
  let params = req.params
  let value = data.candidate.find((c) => c.id == params.candidate_id)
  res.send(value)
})

app.get('/event-log', (req, res) => {
  res.send(data.eventLog)
})

app.post('/event-log', async (req, res) => {
  const time = moment(Date.now()).toISOString()
  await eventFeed.addActivity({
    actor: client.user("session_id"),
    verb: "event_critical",
    object: "event_id",
    foreign_id: "1234",
    event: {
      name: "Multiple Face",
      event_type_id: 16
    },
    candidate: {
      id: 1,
      name: "John Doe"
    },
    time: time
  })
  console.log(time)
  res.sendStatus(201)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))