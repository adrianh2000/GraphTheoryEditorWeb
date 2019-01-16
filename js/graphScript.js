/*global jQuery:false */
jQuery(document).ready(function($) {
"use strict";


});

var canvas = document.getElementById("canvasDisplay");
var context = canvas.getContext("2d");
var graph = new Graph();
var vertexList = [];
var vertexColors = ['#CCCCFF', "#FA03E7"];
var vertexStrokeColors = ['#0000AA', '#AA0000'];
var btnVertex = document.getElementById("imgVertex");
var btnEdge = document.getElementById("imgEdge");
var btnSelection = document.getElementById("imgSelector");
var curAction = "Selection";
var toolbarAction = ['Selection', 'Vertex', 'Edge', 'Complement', 'Cycle','CompleteGraph','Algorithm','DeleteGraph'];
var curToolbarAction = "Selection";
var selectedVerticesIndex = [];
var mouseX = 0, mouseY = 0, vertexRadius = 10;

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
      case "Complement":
          graph.makeComplement();
          curToolbarAction = "Selection";
          //curAction = curToolbarAction;
          selectedVerticesIndex = [];
          document.getElementById("toolbar_Complement").className = "";
          document.getElementById("toolbar_Selection").className = "active-toolbar";
          refreshCanvas(context);
        break;
      case "Cycle":
        var w = canvas.width, h = canvas.height;
        var r = Math.sqrt(w*w + h*h);
        curToolbarAction = "Selection";
        //curAction = curToolbarAction;
        selectedVerticesIndex = [];
        graph.makeCycle(20, w/2, h/2, r/8, vertexRadius, vertexColors[0],vertexStrokeColors[0], 2);
        document.getElementById("toolbar_Cycle").className = "";
        document.getElementById("toolbar_Selection").className = "active-toolbar";
        refreshCanvas(context);
        break;
      case "CompleteGraph":
        var w = canvas.width, h = canvas.height;
        var r = Math.sqrt(w*w + h*h);
        curToolbarAction = "Selection";
        //curAction = curToolbarAction;
        selectedVerticesIndex = [];
        graph.makeCompleteGraph(20, w/2, h/2, r/8, vertexRadius, vertexColors[0],vertexStrokeColors[0], 2);
        document.getElementById("toolbar_CompleteGraph").className = "";
        document.getElementById("toolbar_Selection").className = "active-toolbar";
        refreshCanvas(context);
        break;
      case "DeleteGraph":
        graph.clearGraph();
        curToolbarAction = "Selection";
        selectedVerticesIndex = [];
        //curAction = curToolbarAction;
        document.getElementById("toolbar_DeleteGraph").className = "";
        document.getElementById("toolbar_Selection").className = "active-toolbar";
        refreshCanvas(context);
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

    graph.addVertex(posx, posy, vertexRadius, vlabel, vertexColors[0], vertexStrokeColors[0], 2);
    refreshCanvas(context);
}

fitCanvasToContainer();

function onMouseMove(e) {
    var pos = getMousePos(canvas, e);
    var prevMouseX = mouseX;
    var prevMouseY = mouseY;
    mouseX = pos.x;
    mouseY = pos.y;

    if((curAction == 'AddEdge') && (selectedVerticesIndex.length == 1)) {
      refreshCanvas(context);
      return;
    }

    if(curAction == 'MoveEdge') {
      var xdif = mouseX - prevMouseX;
      var ydif = mouseY - prevMouseY;
      var selectedEdgeArray = graph.getSelectedEdge();
      var v0 = graph.vertexList[selectedEdgeArray[0]];
      var v1 = graph.vertexList[selectedEdgeArray[1]];

      v0.setXY(v0.x + xdif, v0.y + ydif);
      v1.setXY(v1.x + xdif, v1.y + ydif);

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
        //find out if a vertex was selected
        var pos = getMousePos(canvas, e);
        var index = findVertexIndex(pos.x, pos.y);

        if(index > -1) {
          //Add vertex to selected list
          selectedVerticesIndex.push(index);
          curAction = 'MoveVertex';
          console.log("Vertex ="+index+" was selected");
          //graph.selectVertex(index);
          return;
        }

        //find out if an edge was selected
        var selectedEdgeIndex = graph.getSelectedEdgeIndex(pos.x, pos.y, 5);

        if(selectedEdgeIndex[0] > -1) {
          //Edge was selected
          curAction = 'MoveEdge';
          selectedVerticesIndex = [];
          selectedVerticesIndex.push(selectedEdgeIndex[0]);
          selectedVerticesIndex.push(selectedEdgeIndex[1]);
          graph.setSelectedEdge(selectedEdgeIndex[0], selectedEdgeIndex[1]);
          console.log("Edge was selected. " + selectedEdgeIndex[0] + " --> " + selectedEdgeIndex[1]);
        }
      break;
    case 'MoveVertex':
        selectedVerticesIndex = [];
        curAction = "Selection";
      break;
    case 'MoveEdge':
        selectedVerticesIndex = [];
        curAction = "Selection";
        graph.deselectEdge();
        console.log('Edge deselected');
        refreshCanvas(context);
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
        }
        else return; //if no vertices were selected, quit
      break;
    default:
      curAction = "Selection";
      break;
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

  // if(curAction == 'MoveEdge'){
  //   var x0 = graph.vertexList[selectedVerticesIndex[0]].x;
  //   var y0 = graph.vertexList[selectedVerticesIndex[0]].y;
  //   var x1 = graph.vertexList[selectedVerticesIndex[1]].x;
  //   var y1 = graph.vertexList[selectedVerticesIndex[1]].y;
  //
  //   context.beginPath();
  //   context.moveTo(x0, y0);
  //   context.lineTo(x1, y1);
  //   context.strokeStyle = "#FF0000";
  //   context.stroke();
  //   context.strokeStyle = curStrokeColor;
  //
  // }
}
