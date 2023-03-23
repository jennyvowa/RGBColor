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

    // $.get("/colorLibrary", function (data, status) {
    //     randomColorList = data;
        randomColorList.forEach(element => {
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

        // console.log(`when color id is ${aMonoColor.id} monochromatic color's HSB` + h, s, v)
        return HSVtoRGB(i, aMonoColor.id, h, s, v);
    // });

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
