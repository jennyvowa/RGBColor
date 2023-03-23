var express = require('express');
var router = express.Router();

//random color list on server
let serverRandomColorList = [];
let serverFavoriteColorList = [];
let serverMoColorList = [];

// color constructor, so the server can create color objects
let Color = function (colorID, R, G, B) {
  this.colorID = colorID;
  this.objectID = Math.random().toString(16).slice(5);
  this.valueR = R;
  this.valueG = G;
  this.valueB = B;
  this.colorName = "RGB" + this.valueR + this.valueG + this.valueB;
};

Color.prototype.displayColor = function (colorClassName, dataParm, elementType) {
  let aColor = document.createElement(elementType);
  aColor.className = colorClassName;
  aColor.id = this.colorName;
  localStorage.setItem('INDEX', aColor.id);
  aColor.setAttribute(dataParm, aColor.id);
  aColor.textContent = `ColorID ${this.colorID} :  RGB ${this.valueR} : ${this.valueG} : ${this.valueB}`;
  aColor.style.background = "rgb(" + this.valueR + "," + this.valueG + "," + this.valueB + ")";
  return aColor;
};

Color.prototype.displayButton = function (colorClassName, buttonName, buttonColor) {
  let rgbButton = document.createElement("button");
  rgbButton.className = colorClassName + "-btn";
  rgbButton.id = this.colorID;
  rgbButton.setAttribute(colorClassName + "-parm", rgbButton.id);
  rgbButton.textContent = buttonName;
  rgbButton.style.background = buttonColor;
  return rgbButton;
};

Color.prototype.MonochromaticColor = function (i, aMonoColor, r, g, b) {

  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // have to use jQuery to get data serverRandomColorList from the server and overwrite randoColorList
  serverRandomColorList.forEach(element => {
    //aMonoColor1 has -50% of value
    if (aMonoColor.id == element.colorName + 0) {
      s *= 0.50;
    }
    //aMonoColor2 has +50% of value
    if (aMonoColor.id == element.colorName + 1) {
      s *= 1.50;
    }
    //aMonoColor3 has -50% of satuation
    if (aMonoColor.id == element.colorName + 2) {
      v *= 0.50
    }
    //aMonoColor4 has +50% of satuation
    if (aMonoColor.id == element.colorName + 3) {
      v *= 1.50;
    }
  });

  return HSVtoRGB(i, aMonoColor.id, h, s, v);


  // console.log(`when color id is ${aMonoColor.id} monochromatic color's HSB` + h, s, v)


};


function HSVtoRGB(i, aMonoColorID, h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  if (r > 255) {
    r = 255;
  }
  if (g > 255) {
    g = 255;
  }
  if (b > 255) {
    b = 255;
  }
  if (r < 0) {
    r = 0;
  }
  if (g < 0) {
    g = 0;
  }
  if (b < 0) {
    b = 0;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return [getInboundValue(r), getInboundValue(g), getInboundValue(b)];

};

function getInboundValue(aValue) {
  if (aValue < 0) {
    return Math.max(aValue, 0);
  }
  else if (aValue > 255) {
    return Math.min(aValue, 255);
  }
  else {
    return aValue;
  }
}

//putting data into a file
var fs = require("fs");
let fileManager = {
  // x: 33,
  read: function () {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverRandomColorList = goodData;
  },

  write: function () {
    let data = JSON.stringify(serverRandomColorList);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function () {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if (rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if (!fileManager.validData()) {
  // add colors to file random color list to confirm
  // serverRandomColorList.push(new Color(0, 20, 20, 20));
  // serverRandomColorList.push(new Color(1, 100, 100, 100));
  fileManager.write();
}
else {
  fileManager.read(); // do have prior movies so load up the array
}





/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/colorLibrary', function (req, res, next) {
  fileManager.read();
  //reply to the get
  res.status(200).json(serverRandomColorList);
});

router.get('/favoriteColorLibrary', function (req, res, next) {
  //reply to the get
  res.status(200).json(serverFavoriteColorList);
});

router.get('/monoColorLibrary', function (req, res, next) {
  //reply to the get
  res.status(200).json(serverMoColorList);
});



/* POST home page. */

router.post('/AddColor', function (req, res, next) {
  //reply to the post
  let newServerRandomColor = req.body;
  serverRandomColorList.push(newServerRandomColor);
  fileManager.write();
  res.status(200).json(serverRandomColorList);
});

router.post('/AddFavColor', function (req, res, next) {
  //reply to the post
  let newServerFavoriteColor = req.body;
  serverFavoriteColorList.push(newServerFavoriteColor);
  res.status(200).json(serverFavoriteColorList);
});

router.post('/AddMoColor', function (req, res, next) {
  //reply to the post
  let newServerMoColor = req.body;
  serverMoColorList.push(newServerMoColor);
  res.status(200).json(serverMoColorList);
});


module.exports = router;
