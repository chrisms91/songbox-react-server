var Customers = require('../client/models/Customers')
var Owners = require('../client/models/Owners')
var request = require('request')
var songData = require('../data/data.json')

const YouTube_key = 'AIzaSyDwgRsgz8Fcl4OLOIsR3YEl6-ZUhbdkBgA'

module.exports = function (app) {
  app.post('/api/search/:song?', function (req, res) {
  //  console.log('this is process.env.YouTube_key  '+process.env.YouTube_key)
   if (req.params.song === undefined) {
    var youTube = 'bruno+mars'
   } else {
    var youTube = req.params.song 
   }
     
    request('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q='+youTube+'&type=video&videoCategoryId=10&videoDuration=short&fields=items(id(kind%2CvideoId)%2Csnippet(thumbnails%2Ctitle))&key='+ YouTube_key, function (error, response, body) {
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode) 
      return res.json(body)
    })
  })
  
  app.get('/api/recent', function (req, res) {
    Customers.findOne()
      .sort({ field: 'asc', _id: 1 }).limit(1)
      .then(data => res.send(data))
      .catch(err => res.send(err))
  })


  app.get("/api/saved", function (req, res) {
    
    Customers
        .find({}).sort({date:-1})
        .exec(function (err, doc) {
    
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
    });

  app.post('/api/new', function (req, res) {
    Customers.create(req.body)
    .then(data => res.send(data))
    .catch(err => console.log(err))
  })

  app.get('/api/delete', function (req, res) {
    
    Customers.findOne().sort({ field: 'asc', _id: 1 }).limit(1).then(res => res.remove()).catch(err => console.log(err))
  })

  app.get('/api/songs/:id?', function (req, res) {
    var id = req.params.id

    if (id) {
      for (var i = 0; i < songData.length; i++) {
        if (id === songData[i].id) {
          return res.json(songData[i])
        }
      }
      return res.send('<h1>Song Not Found</h>')
    }
    return res.json(songData)
  })

  app.post('/api/remove', function (req, res){
    const id = req.body.id
    
    Customers.findOneAndRemove({ _id: id }, function(err){
      console.log(err)
    })

  })
}
