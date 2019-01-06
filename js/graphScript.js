/*global jQuery:false */
jQuery(document).ready(function($) {
"use strict";


});

var canvas = document.getElementById("canvasDisplay");
var context = canvas.getContext("2d");
var graph = new Graph();
var vertexList = [];
var vertexColors = ['#CCCCFF', "#FA03E7"];
var btnVertex = document.getElementById("imgVertex");
var btnEdge = document.getElementById("imgEdge");
var btnSelection = document.getElementById("imgSelector");
var curAction = "Selection";
var toolbarAction = ['Selection', 'Vertex', 'Edge', 'Tree', 'Copy','Paste','Settings','Save','Algorithm','Trash'];
var curToolbarAction = "Selection";
var selectedVerticesIndex = [];
var mouseX = 0, mouseY = 0;

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

function setAction(newToolbarAction) {
    //remove highlight of past action
    if(toolbarAction.indexOf(curToolbarAction) > -1)
      document.getElementById("toolbar_" +curToolbarAction).className = "";

    prevToolbarAction = curToolbarAction;
    curToolbarAction = newToolbarAction;
    console.log("New Action: " + curToolbarAction);

    //add highlight to new action
    document.getElementById("toolbar_" + curToolbarAction).className = "active-toolbar";

    curAction = curToolbarAction;
    //disable all buttons
    //enableAllButtonsInToolbar(false);

    switch (curToolbarAction) {
      case "Vertex":
          //btnVertex.style.opacity = "1";
        break;
      case "Edge":
          //btnEdge.style.opacity = "1";
        break;
      case "Selection":
          //btnSelection.style.opacity = "1";
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

  while ((i < graph.vertexList.length) && (!found)) {

    if(graph.vertexList[i].isMouseInside(posx, posy)) {
      found = true;
      indexFound = i;
    }

    i++;
  }

  return indexFound;
}

function createNewVertex(e) {
    var vlabel = graph.vertexList.length;
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;

    graph.addVertex(posx, posy, 10, vlabel, vertexColors[0], "#0000AA", 2);
    refreshCanvas(context);
}

fitCanvasToContainer();

function onMouseMove(e) {
    var pos = getMousePos(canvas, e);
    mouseX = pos.x;
    mouseY = pos.y;

    if((curAction == 'AddEdge') && (selectedVerticesIndex.length == 1)) {
      refreshCanvas(context);
      return;
    }

    if(curAction != 'MoveVertex')
      return;

    if(selectedVerticesIndex.length > 0)
        index = selectedVerticesIndex[0];  //use current vertex selected
    else return;

    graph.vertexList[index].setXY(mouseX, mouseY);

    refreshCanvas(context);

     //console.log("Index = "+ index +" X = " + pos.x + " Y = " + pos.y);
}

function mouseClick(e) {
  switch (curAction) {
    case 'Vertex':

        console.log("vertex mode");
        curAction = 'AddVertex';
      break;
    case 'AddVertex':
      createNewVertex(e);
      break;
    case 'Edge':
        curAction = "AddEdge";
        console.log("Edge addition mode");
      break;
    case 'Selection':
        console.log("Selection mode");
        var pos = getMousePos(canvas, e);
        var index = findVertexIndex(pos.x, pos.y);

        if(index > -1) {
          //Add vertex to selected list
          selectedVerticesIndex.push(index);
          curAction = 'MoveVertex';
          console.log("Vertex ="+index+" was selected");
        }
        else return; //if no vertices were selected, quit
      break;
    case 'MoveVertex':
        selectedVerticesIndex = [];
        curAction = "Selection";
      break;
    case 'AddEdge':
        console.log("Adding edge");
        var pos = getMousePos(canvas, e);
        var index = findVertexIndex(pos.x, pos.y);

        if(index > -1) {
          //Add vertex to selected list
          selectedVerticesIndex.push(index);
          console.log("added vertex "+index+" to selected");
          if(selectedVerticesIndex.length == 2) {
            //add edges
            var v0 = selectedVerticesIndex[0];
            var v1 = selectedVerticesIndex[1];

            //Make sure v1 is >= v0, if not, swap them
            if(v1 < v0)
              v1 = [v0, v0 = v1][0];

            graph.addEdge(v0, v1);
            console.log("Added edge ["+v0+","+v1+"]");
            selectedVerticesIndex = [];
            refreshCanvas(context);
          }
          //curAction = 'MoveVertex';

        }
        else return; //if no vertices were selected, quit

      break;
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

function refreshCanvas(context) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw partial edge if edge selection is enabled
  if((curAction == 'AddEdge') && (selectedVerticesIndex.length == 1)) {
    //Add line to represent partial edges
    var x0 = graph.vertexList[selectedVerticesIndex[0]].x;
    var y0 = graph.vertexList[selectedVerticesIndex[0]].y;
    var x1 = mouseX;
    var y1 = mouseY;
    var curStrokeColor = context.strokeStyle;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = "#FF0000";
    context.setLineDash([8,3]);
    context.stroke();
    context.strokeStyle = curStrokeColor;
    context.setLineDash([]);
  }

  //draw graph
  graph.draw(context);
}
