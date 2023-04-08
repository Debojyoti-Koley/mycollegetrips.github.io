// Step 3

var mongoose = require('mongoose');
  
var imageSchema = new mongoose.Schema({
    name: String,
    distance: String,
    date: String,
    author: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('Image', imageSchema);




// MONGO_URL=mongodb://localhost/imagesInMongoApp