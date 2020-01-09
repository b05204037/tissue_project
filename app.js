var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//db model create
var iotSchema = new mongoose.Schema({
    tissueData: Number,
    alcoholData: Number,
    key: Number,
    Date: { type: Date, default: Date.now }
})
var Data = mongoose.model('iotData', iotSchema)


//db connect
const dburl = process.env.MONGOLAB_URI || 'mongodb+srv://jason:jason0214@cluster0-ruomr.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('connect to db'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/api/save', (req, res) => {
    console.log(req.body)
    let saveData = new Data(req.body);
    saveData.save()
        .then(() => console.log("save"))
        .catch(err => console.log(err))
    res.send('post')
})

app.get('/api/getDataNoId', (req, res) => {
    Data.findOne({ key: 3 }, (err, getData) => {
        if (err) console.log(err)
        else {
            console.log(getData)
            res.json(getData)
        }
    })
})

app.post('/api/getData', (req, res) => {
    Data.findOne({ key: req.body.key }).sort({ created_at: -1 }).exec((err, getData) => {
        if (err) console.log(err)
        else {
            console.log(getData)
            res.json(getData)
        }
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`connect to ${port}`)
})