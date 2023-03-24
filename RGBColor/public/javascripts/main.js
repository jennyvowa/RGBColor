let randomColorList = [];
let favoriteColorList = [];
let moColorList = [];
let favoriteColorID = 0;


document.addEventListener("DOMContentLoaded", function (event) {
    // color maker page
    document.getElementById("random-color-btn").addEventListener("click", showRandomColorList);

    //add color page
    document.getElementById("buttonAdd").addEventListener("click", addColor);
    document.getElementById("buttonClear").addEventListener("click", clearAddForm);



    // color library page 
    $(document).on("pagebeforeshow", "#colorLibrary", function (event) {
        // have to use jQuery to get data serverRandomColorList from the server and overwrite randoColorList
        $.get("/colorLibrary", function (data, status) {
            randomColorList = data;
            showLibraryPage("lbr", "index.html#libraryDetails", randomColorList);
            let libraryColorUL = document.getElementById('lbr-list-color');
            libraryColorUL.innerHTML = "";

            randomColorList.forEach(oneColor => {   // use handy array forEach method
                appendAColor(oneColor, 'lbr-list-color', 'lbr-color-classname', 'lbr-data-parm', "li");
            });
            activateAColor('lbr-color-classname', 'lbr-data-parm', 'lbrColorName', 'lbrColorID', "index.html#libraryDetails");
        });
    });

    // color library detail page
    // document.getElementById("list-favorite-btn").addEventListener("click", showFavoriteColors);

    // Color Library details page
    $(document).on("pagebeforeshow", "#libraryDetails", function (event) {
        $.get("/colorLibrary", function (data, status) {
            randomColorList = data;

            showLibraryDetailPage("lbr", randomColorList);
        });
    });

    // Color favorite details page
    $(document).on("pagebeforeshow", "#favoriteDetails", function (event) {

        $.get("/favColorLibrary", function (data, status) {
            favoriteColorList = data;

            let showContainer = document.getElementById('frv-show-pick-color');
            let pickContainer = document.createElement('div');
            pickContainer.id = 'frv-pick-color';
            pickContainer.className = 'frv-pick-color';
            showContainer.append(pickContainer);

            showLibraryDetailPage("frv", favoriteColorList);
        });
    });

});

// Color Maker method
function showRandomColorList() {
    let randomColor;

    $.get("/colorLibrary", function (data, status) {
        randomColorList = data;
        randomColor = createObject(randomColorList);
        console.log(randomColor)
        // localStorage.setItem('randomColorObject', randomColor);

        //to confirm 
        // let indexOfRandomColor = randomColor.colorID;
        // console.log(indexOfRandomColor);


        $.ajax({
            url: "/AddColor",
            type: "POST",
            data: JSON.stringify(randomColor),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                document.location.href = "index.html#colorMaker";
            }
        });

        //original code (doesn't work anymore)
        // let indexOfRandomColor = randomColorList.indexOf(randomColor.colorID);
        appendAColor(randomColor, "random-color-list", "random-color-classname", "data-parm", "div");
        activateAColor("random-color-classname", "data-parm", "colorName", "colorIndex", "index.html#details");
    });
    // detail page
    // need one for our details page to fill in the info based on the passed in ID


    $(document).on("pagebeforeshow", "#details", function (event) {
        $.get("/colorLibrary", function (data, status) {
            randomColorList = data;
            let colorElementIndexID;
            // let colorElementIndexID = localStorage.getItem('colorIndex'); // get the unique key back from the storage dictionairy
            // let colorElementIndexID = indexOfRandomColor;
            let colorElementName = localStorage.getItem('colorName');
            console.log(colorElementName, colorElementIndexID);
            console.log(randomColorList)
            randomColorList.forEach((element, i) => {
                if (colorElementName == element.colorName) {
                    console.log(element.colorName, i);
                    return colorElementIndexID = i;
                }
            });

            console.log(colorElementIndexID)
            fillRGBinputValues(randomColorList, colorElementIndexID, "color-item-detail", "inputR", "inputG", "inputB");
            createMonochromaticColorDiv(randomColor, "m", "monochromatic-class-name", colorElementIndexID);

            //original code
            // fillRGBinputValues(randomColorList, colorElementIndexID, "color-item-detail", "inputR", "inputG", "inputB");
            // createMonochromaticColorDiv(randomColorList, "m", "monochromatic-class-name", colorElementIndexID);
        });
    });


};

// function indexPointer(colorNamePara){
//     $.get("/colorLibrary", function (data, status) {
//         randomColorList = data;

//         console.log()
//         randomColorList.forEach((element, i) => {
//             if(colorNamePara == element.colorName){
//                 console.log(i);
//                 return i;
//             }
//         })

//     })
// }



// Add a color method
function addColor() {
    //get r,g,b values from input boxes
    let rValue = document.getElementById("r-add-value").value;
    let gValue = document.getElementById("g-add-value").value;
    let bValue = document.getElementById("b-add-value").value;
    console.log(rValue, gValue, bValue)
    // print exception message if r,g,b not in (0, 255)
    if (rValue < 0 || rValue > 255 || gValue < 0 || gValue > 255 || bValue < 0 || bValue > 255) {
        document.getElementById("exception-container").textContent = "RGB value must be between 0 and 255";
    }
    // if r,g,b in (0, 255) and the color with this r,g,b value not in the color library array yet

    // else if (isAddable(rValue, gValue, bValue)) {
    else {

        let answer = false;

        $.get("/colorLibrary", function (data, status) {
            randomColorList = data;
            if (randomColorList.length === 0) {
                answer = true;
            }
            else {
                for (let i = 0; i < randomColorList.length; i++) {
                    if (randomColorList[i].valueR === rValue && randomColorList[i].valueG === gValue && randomColorList[i].valueB === bValue) {
                        answer = false;
                    }
                }
                answer = true;
            }


            if (answer == true) {
                console.log("this is addable!")
                //original code
                // randomColorList.push(new Color(randomColorList.length, rValue, gValue, bValue));
                let newRandomColor = new Color(randomColorList.length, rValue, gValue, bValue);

                $.ajax({
                    url: "/AddColor",
                    type: "POST",
                    data: JSON.stringify(newRandomColor),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        document.getElementById("exception-container").textContent = "";
                        document.location.href = "index.html#colorLibrary";
                    }
                });

            } else {
                console.log("this is NOT addable!")

                // print exception message this color  existing
                let message = "This color: RGB(" + rValue + ", " + gValue + ", " + bValue + ") already existing in your color library";
                document.getElementById("exception-container").textContent = message;
            }
        });

    };
};


function clearAddForm() {
    document.getElementById("r-add-value").value = "";
    document.getElementById("g-add-value").value = "";
    document.getElementById("b-add-value").value = "";
    document.getElementById("exception-container").textContent = "";
};


function activateAColor(aColorToActivate, dataParm, keyName, keyIndex, page) {

    console.log("to test  " + aColorToActivate, dataParm, keyName, keyIndex, page)
    let arrayRandomColor = document.querySelectorAll(`.${aColorToActivate}`);

    arrayRandomColor.forEach((element, i) => {
        element.addEventListener('click', function () {
            var colorIDName = this.getAttribute(dataParm);
            console.log('ColorIDName is ' + colorIDName + ' and i is ' + i)
            // now save THIS ID value in the localStorage "dictionairy"
            localStorage.setItem(keyName, colorIDName);
            localStorage.setItem(keyIndex, i)
            document.location.href = page;  // this will jump us to the page
        });
    });

};



function fillRGBinputValues(colorArray, colorElementIndex, containerName, rInputName, gInputName, bInputName) {

    $.get("/colorLibrary", function (data, status) {
        colorArray = data;
        document.getElementById(rInputName).value = colorArray[colorElementIndex].valueR;
        document.getElementById(gInputName).value = colorArray[colorElementIndex].valueG;
        document.getElementById(bInputName).value = colorArray[colorElementIndex].valueB;
        document.getElementById(containerName).style.background
            = "rgb(" + colorArray[colorElementIndex].valueR + "," + colorArray[colorElementIndex].valueG + "," + colorArray[colorElementIndex].valueB + ")";
    });

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
};

function createObject(array) {

    colorID = array.length;
    let valueR = parseInt(Math.random() * 256);
    let valueG = parseInt(Math.random() * 256);
    let valueB = parseInt(Math.random() * 256);
    let newColor = new Color(colorID, valueR, valueG, valueB);
    return newColor;
    //original code
    //return new Color(colorID, valueR, valueG, valueB);


};




// Append the created object color to the page
function appendAColor(aColor, listContainerName, colorClassName, dataParm, elementType) {
    let pageRandomColorPlaceHolder = document.getElementById(listContainerName);
    pageRandomColorPlaceHolder.append(displayColor(aColor, colorClassName, dataParm, elementType));

};

function displayButton(aColor, colorClassName, buttonName, buttonColor) {
    let rgbButton = document.createElement("button");
    rgbButton.className = colorClassName + "-btn";
    rgbButton.id = aColor.colorID;
    rgbButton.setAttribute(colorClassName + "-parm", rgbButton.id);
    rgbButton.textContent = buttonName;
    rgbButton.style.background = buttonColor;
    return rgbButton;
};


function displayColor(oneColor, colorClassName, dataParm, elementType) {
    let aColor = document.createElement(elementType);
    aColor.className = colorClassName;
    aColor.id = oneColor.colorName;
    aColor.setAttribute(dataParm, aColor.id);
    aColor.textContent = `ColorID ${oneColor.colorID} :  RGB ${oneColor.valueR} : ${oneColor.valueG} : ${oneColor.valueB}`;
    aColor.style.background = "rgb(" + oneColor.valueR + "," + oneColor.valueG + "," + oneColor.valueB + ")";
    return aColor;
};

// Create an button  
// aColor: an object color
//listContainerName: place holder for RGB button to attach to
function appendAButton(aColor, listContainerName, colorClassName, buttonName, buttonColor) {
    let colorPlaceHolder = document.getElementById(listContainerName);
    colorPlaceHolder.append(displayButton(aColor, colorClassName, buttonName, buttonColor));
};


// function createMonochromaticColorDiv(randomColor, preMonoID, monoClassName, colorIndex) {
function createMonochromaticColorDiv(randomColor, preMonoID, monoClassName, colorIndex) {

    //colorElementID is "RGB" + RandomColorList.valueR + RandomColorList.valueG + RandomColorList.valueB
    $.get("/colorLibrary", function (colorData, status) {
        let colorArray = colorData;

        $.get("/monoColorLibrary", function (data, status) {

            let moColorList = data;
            moColorList = [];


            //to confirm///////
            console.log("Test whether I can get property of array..." + colorArray[colorIndex].colorID + " is the current colorArray object's color ID")



            for (i = 1; i < 5; i++) { //i ...number of 0 to 4 because there are 4 color suggestions


                document.getElementById(`${preMonoID}${i}`).textContent = "";
                let aMonoColor = document.createElement("div")
                aMonoColor.className = monoClassName;

                //to confirm
                console.log(i, aMonoColor, colorArray[colorIndex].valueR, colorArray[colorIndex].valueG, colorArray[colorIndex].valueB);


                let monoColorID = colorArray[colorIndex].colorName + [i];
                aMonoColor.id = monoColorID;
                document.getElementById(`${preMonoID}${i}`).append(aMonoColor);
                //to get similar color suggestions and create these array & ids



                //original code (doesn't work anymore)
                // let newRGB = colorArray[colorIndex].MonochromaticColor(i, aMonoColor, colorArray[colorIndex].valueR, colorArray[colorIndex].valueG, colorArray[colorIndex].valueB);
                let newRGB = randomColor.MonochromaticColor(i, aMonoColor, colorArray[colorIndex].valueR, colorArray[colorIndex].valueG, colorArray[colorIndex].valueB);

                document.getElementById(`${preMonoID}${i}`).style.background = `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;

                document.getElementById(monoColorID).textContent = `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;


                let newMoColor = new Color(moColorList.length, newRGB[0], newRGB[1], newRGB[2]);

                //original code
                // moColorList.push(new Color(moColorList.length, newRGB[0], newRGB[1], newRGB[2]));
                $.ajax({
                    url: "/AddMoColor",
                    type: "POST",
                    data: JSON.stringify(newMoColor),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {

                    }
                });
            };
        });
    });

};


function showLibraryPage(lbr, page, aArray) {
    // $.get("/colorLibrary", function (data, status) {
    //     aArray = data;
    let libraryColorUL = document.getElementById(`${lbr}-list-color`);
    libraryColorUL.innerHTML = "";

    aArray.forEach(function (oneColor) {   // use handy array forEach method
        appendAColor(oneColor, `${lbr}-list-color`, `${lbr}-color-classname`, `${lbr}-data-parm`, "li");

    });
    activateAColor(`${lbr}-color-classname`, `${lbr}-data-parm`, `${lbr}ColorName`, `${lbr}ColorID`, page);
    // });
};

function showLibraryDetailPage(aLbr, aArray) {
    document.getElementById(`${aLbr}-pick-color`).remove();
    //document.getElementById(`${aLbr}-pick-color`).textContent = "";
    let libraryPickContainer = document.createElement("div");
    libraryPickContainer.id = `${aLbr}-pick-color`;
    document.getElementById(`${aLbr}-show-pick-color`).append(libraryPickContainer);

    var colorPickID = localStorage.getItem(`${aLbr}ColorID`);
    appendAColor(aArray[colorPickID], `${aLbr}-pick-color`, `${aLbr}PickColor`, `${aLbr}-data-parm`, "div");
    appendAButton(aArray[colorPickID], `${aLbr}-pick-color`, `${aLbr}-pick`, "getRGB", "lightyellow");
    let RGBInput = document.createElement('input');
    RGBInput.id = `${aLbr}-pick-val`;
    document.getElementById(`${aLbr}-pick-color`).append(RGBInput);

    document.getElementById(colorPickID).addEventListener("click", function () {
        RGBInput.value = "rgb(" + aArray[colorPickID].valueR + ", " + aArray[colorPickID].valueG + ", " + aArray[colorPickID].valueB + ")";
    });
};

// function showFavoriteColors() {
//     $.get("/favoriteColorLibrary", function (data, status) {
//         favoriteColorList = data;

//         if (favoriteColorList.length === 0) {
//             alert('Your favorite list is empty!');
//         }
//         showLibraryPage("frv", "index.html#favoriteDetails", favoriteColorList);
//     });
// };