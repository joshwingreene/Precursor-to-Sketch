// Precursor-to-Sketch Copy - Version 1 


// FUNCTIONS

// getClipboardText - return any text that is currently on the clipboard
//       source: http://stackoverflow.com/questions/28618766/get-current-text-from-clipboard-in-chrome-app
function getClipboardText() {
    // create div element for pasting into
    var pasteDiv = document.createElement("div");

    // place div outside the visible area
    pasteDiv.style.position = "absolute";
    pasteDiv.style.left = "-10000px";
    pasteDiv.style.top = "-10000px";

    // set contentEditable mode
    pasteDiv.contentEditable = true;

    // find a good place to add the div to the document
    var insertionElement = document.activeElement; // start with the currently active element
    var nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { // if have not reached an element that it is valid to insert a div into (stopping eventually with 'body' if no others are found first)
        insertionElement = insertionElement.parentNode; // go up the hierarchy
        nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    }

    // add element to document
    insertionElement.appendChild(pasteDiv);

    // paste the current clipboard text into the element
    pasteDiv.focus();
    document.execCommand('paste');

    // get the pasted text from the div
    var clipboardText = pasteDiv.innerText;

    // remove the temporary element
    insertionElement.removeChild(pasteDiv);

    // return the text
    return clipboardText;
}

// source: http://stackoverflow.com/questions/13899299/write-text-to-clipboard/18258178#18258178
function copyToClipboard(str){
        document.oncopy = function(event) {
    event.clipboardData.setData("Text", str);
    event.preventDefault();
        };
    document.execCommand("Copy");
        document.oncopy = undefined;
}

// call filterRectangle or filterCircle depending on the values of rx and ry 
function returnFilteredRectangleOrCircle(rect) {
    if (rect.rx.baseVal.value == 0 && rect.ry.baseVal.value == 0) { // no values that define a radius
        return filterRectangle(rect);
    } else {
        return filterCircle(rect);
    }
}

function filterRectangle(rect) { // TODO: Refactor to use attributes if I can
    return new Rect(rect.height.baseVal.value, rect.width.baseVal.value, rect.x.baseVal.value, rect.y.baseVal.value, []);
}

function filterCircle(rect) { // created if rx and ry are zero // TODO: Refactor to use attributes if I can
    return new Circle(rect.height.baseVal.value,
                      rect.width.baseVal.value, 
                      rect.x.baseVal.value, 
                      rect.y.baseVal.value, 
                      rect.rx.baseVal.value, 
                      rect.ry.baseVal.value,
                      []);
}

function filterLine(line) { // x1,y1, x2, y2
    // Wierd... this isn't needed for my target layout
    /*
    if (Number(line.attributes.item(5).value) == Number(line.attributes.item(6).value)) { // horizontal + straight line (switch x1 and y1 since they are switched in the svg for some reason)
        return new Line(Number(line.attributes.item(4).value), // x2
                    Number(line.attributes.item(5).value), // y1
                    Number(line.attributes.item(3).value), // x1
                    Number(line.attributes.item(6).value)); // y2
    } else if (Number(line.attributes.item(3).value) == Number(line.attributes.item(4).value)) { // vertical + straight line (no switches needed)
        return new Line(Number(line.attributes.item(3).value), // x1
                    Number(line.attributes.item(5).value), // y1
                    Number(line.attributes.item(4).value), // x2
                    Number(line.attributes.item(6).value)); // y2
    } else { // diagonal (no switches needed) ( look into other related cases later if needed )
        return new Line(Number(line.attributes.item(3).value), // x1
                    Number(line.attributes.item(5).value), // y1
                    Number(line.attributes.item(4).value), // x2
                    Number(line.attributes.item(6).value)); // y2
    }
    */
    return new Line(Number(line.attributes.item(3).value), // x1
                    Number(line.attributes.item(5).value), // y1 // y values are fine
                    Number(line.attributes.item(4).value), // x2
                    Number(line.attributes.item(6).value)); // y2
}

function filterText(text) {
    return new Text(text.textContent.trim(), 
                    text.attributes.item(1).value, 
                    Number(text.attributes.item(2).value), 
                    Number(text.attributes.item(4).value), 
                    Number(text.attributes.item(5).value));
}

function checkIfContainerContainsObj(container, objectToCheck) { // check if container contains objectToCheck
    if(container == objectToCheck || checkContainerEquality(container, objectToCheck)) {
        console.log("first");
        return false;
    } else if (container.type != "Rect" && container.type != "Circle") { // only rects and circles can contain objects
        console.log("second");
        return false;                                                                       // and possibly paths (later)
    } else if (objectToCheck.type == "Line") { 
        if (objectToCheck.x1 >= container.x && objectToCheck.y1 >= container.y && // line is not to the left or above the container
            objectToCheck.x2 >= container.x && objectToCheck.y2 >= container.y &&
            objectToCheck.x1 <= (container.x) + container.width && // line doesn't extend past the container
            objectToCheck.y1 <= (container.y) + container.height &&
            objectToCheck.x2 <= (container.x) + container.width &&
            objectToCheck.y2 <= (container.y) + container.height) {
                return true;
            } else {
                return false;
            }
    }
    else { // actual check
        console.log("third");
        
        // False if object is bigger than container
        if(objectToCheck.width > container.width && objectToCheck.height > container.height) {
            console.log("object is bigger");
            return false;
        }
        
        // Check if the object is within the container obj's bounds 
        if(objectToCheck.x >= container.x && objectToCheck.y >= container.y &&
           objectToCheck.x <= (container.x) + container.width && // removed -1 because of what I found for the line case
           objectToCheck.y <= (container.y) + container.height) {
            console.log("true");
            return true;
        } else {
            console.log("false");
            return false;
        }
    }   
}

function recursiveStore(arr, containedObj) { // given array and the contained object
    console.log("inside recursiveStore");
    console.log("map values", objContainedByMap);
    if (arr.length == 1) {
        var lastObject = arr[0];
        lastObject.children.push(containedObj);
        return lastObject;
    } else if (arr.length > 1) {
        var poppedObj = arr.pop();
        poppedObj.children.push(recursiveStore(arr, containedObj));
        return poppedObj;
    }
}

function createCopy(origObj) { // create a copy of the given object // good
    if (origObj.type == "Rect") {
        console.log("rect");
        return new Rect(origObj.height, origObj.width, origObj.x, origObj.y, origObj.children.slice()); // array - pass by ref (reason for slice)
                                                                        // future issue - object references in the array will be passed
                                                                            // although objects aren't added to the children's array until recursiveStore'
                                                                                // so their children's array will be empty
    } else if (origObj.type == "Circle") {
        console.log("circle");
        return new Circle(origObj.height, origObj.width, origObj.x, origObj.y, origObj.rx, origObj.ry, origObj.children.slice()); // array - pass by ref (reason for slice)

    } else if (origObj.type == "Line") {
        console.log("line");
        return new Line(origObj.x1, origObj.y1, origObj.x2, origObj.y2); // all pass by value

    } else if (origObj.type == "Text") {
        console.log("text");
        return new Text(origObj.textContent, origObj.fontFamily, origObj.fontSize, origObj.x, origObj.y);     // all pass by value     
    }
}

function Rect(height, width, x, y, children) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.children = children;
    this.type = "Rect";
}

function Circle(height, width, x, y, rx, ry, children) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.children = children;
    this.type = "Circle";
}

function Line(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = "Line";
}

function Text(textContent, fontFamily, fontSize, x, y) {
    this.textContent = textContent;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.type = "Text";
}

// NEW FUNCTIONS

function checkObjectsInResult(key, resultArray) { // check if the given object is in the array
    resultArray.forEach(function(resultObj) {
        if (recursiveCheck(key, resultObj)) {
            return true;
        };
    });
    return false;
}

function recursiveCheck(key, resultObj) {
    if (resultObj.type == "Text" || resultObj.type == "Line" || // base
        (resultObj.type == "Rect" && resultObj.children.length == 0) || 
        (resultObj.type == "Circle" && resultObj.children.length == 0))  {
        return checkEquality(key, resultObj);
    } else { // Rect or Circle with a chiild
        // check the object first
        if (checkEquality(key, resultObj)) {
            return true;
        } else { // check the objects in its children property
            var isFound = false;
            resultObj.children.forEach(function(child) {
                if (recursiveCheck(key, child)) {
                    isFound = true;
                } 
            });
        }
        return isFound;
    }
}

function checkEquality(a, b) {
    if (a.type == b.type) {
        return checkIfAttributesEqual(a,b);
    } else {
        return false;
    } 
}

function checkIfAttributesEqual(a,b) {
    if (a.type == "Rect") {
        return a.height == b.height && a.width == b.width && a.x == b.x && a.y == b.y && a.children == b.children;
    } else if (a.type == "Circle") {
        return a.height == b.height && a.width == b.width && a.x == b.x && a.y == b.y && a.rx == b.rx && a.ry == b.ry && a.children == b.children; 
    } else if (a.type == "Text") {
        a.textContent == b.textContent && a.fontFamily == b.fontFamily && a.fontSize == b.fontSize && a.x == b.x && a.y == b.y;
    } else if (a.type == "Line") {
        return a.x1 == b.x1 && a.y1 == b.y1 && a.x2 == b.x2 && a.y2 == b.y2;
    }
}

function checkContainerEquality(a,b) {
    if (a.type == b.type) {
        return checkAttributesExceptChildren(a,b);
    } else {
        return false;
    } 
} 

function checkAttributesExceptChildren(a,b) {
    if (a.type == "Rect") {
        return a.height == b.height && a.width == b.width && a.x == b.x && a.y == b.y;
    } else if (a.type == "Circle") {
        return a.height == b.height && a.width == b.width && a.x == b.x && a.y == b.y && a.rx == b.rx && a.ry == b.ry; 
    }
}

function checkIfEmpty(container, arr) { // Compare the container with all of the objects in arr in order to see if it contains one of them
    for (var i = 0; i < arr.length; i++) {
        if(checkIfContainerContainsObj(container, arr[i])) {
            return false; // container isn't empty
        }
    }
    return true; // container is empty
}

// TODO: When done: Create a shortcut to activate the extension 

// MAIN (CURRENTLY REQUIRES AN ENCLOSING OBJECT - RESET OPERATIONS ONLY USED ON FIRST BASE OBJECT)

var original = getClipboardText();
//alert(getClipboardText()) tested

// parse text to svg dom object
var parser = new DOMParser();
var resultSVGDoc = parser.parseFromString(original, "image/svg+xml");
console.log(resultSVGDoc);

// Get each type of object //TODO: Add path's later
var rects = resultSVGDoc.getElementsByTagName("rect");
var lines = resultSVGDoc.getElementsByTagName("line");
var texts = resultSVGDoc.getElementsByTagName("text");

console.log(rects.length);
console.log(lines.length);
console.log(texts.length);

// Add all of the objects to an array
// using the filter methods to only keep the most relevant data (stroke will be black by default in the sketch plugin)
var arr = [];

for (var i = 0; i < rects.length; i++) {
    arr.push(returnFilteredRectangleOrCircle(rects.item(i)));
}

for (var i = 0; i < lines.length; i++) {
    arr.push(filterLine(lines.item(i)));
}

for (var i = 0; i < texts.length; i++) {
    arr.push(filterText(texts.item(i)));
}

console.log(arr);

// 1) Get all contained Texts, Lines, and empty Circles/Rects
var currArr = [];

arr.forEach(function(smallestObj) {
    if (smallestObj.type == "Text" || smallestObj.type == "Line" ||
       (smallestObj.type == "Rect" && checkIfEmpty(smallestObj, arr)) || // issue: in the beginning, rects and circles will have a length of 0
       (smallestObj.type == "Circle" && checkIfEmpty(smallestObj, arr))) {
           currArr.push(createCopy(smallestObj));
       }
});

console.log("initial currArr", currArr);

// 2) Find what contains each object; choose the smallest container; add the orig object to that container; add the container to the array in the orig obj's place

var containedObjFound = null; // dif approach to the condition for the while loop

do {
    containedObjFound = false;

    currArr.forEach(function(inner_obj, i) { // Find what contains each object; choose the smallest container
        var smallest_container = null;
        arr.forEach(function(possible_container) { // Finds the smallest object that containers inner_obj
                                                    // The reason this works is because this function can access the references of its parent parent, i.e. the outer forEach
                                                        // note - parent functions can't access the references of child functions
            if (checkIfContainerContainsObj(possible_container, inner_obj)) {
                containedObjFound = true;

                if (smallest_container == null) {
                    smallest_container = possible_container;
                } else if (possible_container.width < smallest_container.width && possible_container.height < smallest_container.height) {
                    smallest_container = possible_container;
                }
            }
        });

        if (containedObjFound) { // only do this if the curr object is contained by something
            console.log("smallest_container:", smallest_container);

            // add the orig object to that container; add the container to the array in the orig obj's place
            var temp = createCopy(smallest_container);
            //console.log("temp:",temp);
            temp.children.push(inner_obj);
            //console.log("temp:", temp);
            //currArr[i] = createCopy(smallest_container).children.push(inner_obj); // TODO: Look into later (but this doesn't work)
            currArr[i] = temp;

            containedObjFound = false; // reset
        }
    });

    console.log("before end- containedObjFound:", containedObjFound); // changed to true

    console.log("updated currArray:", currArr);

    // 2.5) Group objects that have the same parent container // TODO: will need to deal with objects that aren't contained by anything (partially supported via the if statement above)

    var updatedArray = [];

    updatedArray.push(currArr.splice(0,1)[0]); // Get the first object

    currArr.forEach(function(curr_obj) { // Go through the remaining objects 
    
        var objectFound = false;
        updatedArray.forEach(function(stored_container) { // see if curr_obj is equal to an object in updatedArray
            if (checkContainerEquality(curr_obj, stored_container)) {
                stored_container.children.push(curr_obj.children[0]); // add the object's child to the stored container 
                objectFound = true;
            } 
        });
        if (!objectFound) {
            updatedArray.push(curr_obj); // add the container and its contents
        }
        
    });

    console.log("After Grouping - updatedArray:", updatedArray);

    // Check if the resulting objects are contained by anythng // use to update the while loop condition value
    updatedArray.forEach(function(inner_obj) {
        arr.forEach(function(possible_container) { 
            if (!checkContainerEquality(possible_container, inner_obj) && checkIfContainerContainsObj(possible_container, inner_obj)) {
                containedObjFound = true;
            }
        });
    });

    console.log("containedObjFound:", containedObjFound);

    // Make updatedArray be the new main array besides arr (which contains the original objects)
    currArr = updatedArray;

    updatedArray = null;
    
    console.log("arrays after wipe");
    console.log("currArr:", currArr);
    console.log("updatedArray:", updatedArray);
    
} while(containedObjFound);

//console.log("json.stringify -", JSON.stringify(currArr)); // testing json stringify (will be able to identify objects via the type property)

// RESET X,Y POSITIONS 

// using to represent an object's position
function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

// recursively reset the positions of children
function recursiveReset(parentInitial, parentAfter, objSearched) { // Parameters: Coordinate, Coordinate, Text/Line/Rect,Circle
    // base case - Text, Line, Empty Rect/Circles
    if (objSearched.type == "Text" || 
        (objSearched.type == "Rect" && objSearched.children.length == 0) ||
        (objSearched.type == "Circle" && objSearched.children.length == 0)) {

        //var savedObjCoord = new Coordinate(objSearched.x, objSearched.y); // not needed

        objSearched.x = (objSearched.x - parentInitial.x) + parentAfter.x;
        objSearched.y = (objSearched.y - parentInitial.y) + parentAfter.y;
    } 
    else if (objSearched.type == "Line") { // have to deal with lines differently

        objSearched.x1 = (objSearched.x1 - parentInitial.x) + parentAfter.x;
        objSearched.y1 = (objSearched.y1 - parentInitial.y) + parentAfter.y;

        objSearched.x2 = (objSearched.x2 - parentInitial.x) + parentAfter.x;
        objSearched.y2 = (objSearched.y2 - parentInitial.y) + parentAfter.y;
    }
    // recursive case (non-empty containers)
    else {
        var savedObjCoord = new Coordinate(objSearched.x, objSearched.y); // needed for recursive call

        objSearched.x = (savedObjCoord.x - parentInitial.x) + parentAfter.x;
        objSearched.y = (savedObjCoord.y - parentInitial.y) + parentAfter.y;

        objSearched.children.forEach(function(child) {
            recursiveReset(savedObjCoord, new Coordinate(objSearched.x, objSearched.y), child);
        });
    }
}

//  reset the base object's position (QUALIFIER - this is only if there is one object in currArr) (if multiple objects, I'm thinking of comparing their positions in order
                                                                                                    // to figure out their new positions before calling the recursive algoritm
                                                                                           // on their children)
var base = currArr[0];

var savedBaseObjectCoord = new Coordinate(base.x, base.y);

base.x = 0;
base.y = 0;

//  call the recursive function on its children
base.children.forEach(function(baseChild) {
    recursiveReset(savedBaseObjectCoord, new Coordinate(base.x, base.y), baseChild);
});

console.log("after recursive reset:", base);

//console.log("json.stringify -", JSON.stringify(base));

// CONVERT TO JSON STR AND COPY TO CLIPBOARD

var baseJSON =  JSON.stringify(base);

copyToClipboard(baseJSON);

console.log("clipboardText:", getClipboardText());

