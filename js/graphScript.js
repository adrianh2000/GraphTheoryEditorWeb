/*global jQuery:false */
jQuery(document).ready(function($) {
"use strict";


});

var canvas = document.getElementById("canvasDisplay");
var context = canvas.getContext("2d");
var vertexList = [];
var vertexColors = ['#CCCCFF', "#FA03E7"];
var btnVertex = document.getElementById("imgVertex");
var btnEdge = document.getElementById("imgEdge");
var btnSelection = document.getElementById("imgSelector");
var curAction = "Vertex";

//var theDiv = document.getElementById("divDisplay");
//canvas.width = theDiv.clientWidth;
//canvas.height = theDiv.clientHeight;

fitToContainer(canvas);

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}


function enableAllButtonsInToolbar(enableAll) {
  if(enableAll) {
      btnSelection.style.opacity = "1";
      btnVertex.style.opacity = "1";
      btnEdge.style.opacity = "1";
  }
  else {
    btnSelection.style.opacity = ".2";
    btnVertex.style.opacity = ".2";
    btnEdge.style.opacity = ".2";
  }
}

function setAction(newAction) {
    prevAction = curAction;
    curAction = newAction;
    console.log("New Action: " + curAction);

    //disable all buttons
    enableAllButtonsInToolbar(false);

    switch (curAction) {
      case "Vertex":
          btnVertex.style.opacity = "1";
        break;
      case "Edge":
          btnEdge.style.opacity = "1";
        break;
      case "Selection":
          btnSelection.style.opacity = "1";
        break;
      default:

    }
}


function fitCanvasToContainer() {
  var parent = document.getElementById("divDisplay");
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
}

// finds vertex index based on position
function findVertexIndex(posx, posy) {
  var found = false;
  var i = 0, indexFound = -1;

  while ((i < vertexList.length) && (!found)) {

    if(vertexList[i].isMouseInside(posx, posy)) {
      found = true;
      indexFound = i;
    }

    i++;
  }

  return indexFound;
}

function createNewVertex(e) {
    var vlabel = vertexList.length;
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;

    var vertex = new Vertex(posx, posy, 10, vlabel, vertexColors[0], "#0000AA", 2);
    vertexList.push(vertex);

    vertex.draw(context);
}

fitCanvasToContainer();

function onMouseMove(e) {
    if(curAction != 'Selection')
      return;

    var pos = getMousePos(canvas, e);
    var index = findVertexIndex(pos.x, pos.y);

    if(index > -1) {
      vertexList[index].setFillColor(vertexColors[1]);
      vertexList[index].draw(context);
    }

    //console.log("Index = "+ index +" X = " + pos.x + " Y = " + pos.y);
}

function mouseClick(e) {
  switch (curAction) {
    case 'Vertex':
      console.log("vertex mode");
      createNewVertex(e);
      break;
    case 'Edge':
      console.log("edge mode");
      break;
    case 'Selection':
      console.log("Selection mode");
    default:

  }
}

//window.addEventListener('mousemove', draw, false);
window.addEventListener('click', mouseClick, false);
window.addEventListener("mousemove", onMouseMove, false);


// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
//         y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
//     };
// }

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
