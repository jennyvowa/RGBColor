var express = require('express');
var router = express.Router();

//random color list on server
let serverRandomColorList = [];

// color constructor, so the server can create color objects
let Color = function (colorID, R, G, B) {
  this.colorID = colorID;
  this.objectID = Math.random().toString(16).slice(5);
  this.valueR = R;
  this.valueG = G;
  this.valueB = B;
  this.colorName = "RGB" + this.valueR + this.valueG + this.valueB;
};


// add colors to server random color list 
serverRandomColorList.push(new Color(0, 20, 20, 20));
serverRandomColorList.push(new Color(1, 100, 100, 100));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/colorLibrary', function(req, res, next) {
  //reply to the get
  res.status(200).json(serverRandomColorList);
});

module.exports = router;
