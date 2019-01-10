class Graph {
  constructor() {
    this.vertexList = [];
    this.maxNumRows = 5;
    this.maxNumCols = 5;
    this.adjacencyMatrix = [[]];
    this.selectedEdge = [-1, -1]; //contains index of vertices vi, vj adjacent to the selected edge
    this.selectedEdgeColor = "#FF0000";
  }

  addVertex(x, y, radius, label, fillColor, strokeColor, strokeWeight) {
    var newVertex = new Vertex(x, y, radius, label, fillColor, strokeColor, strokeWeight);

    //add new vertex to list
    this.vertexList.push(newVertex);

    //enlarge adjacencyMatrix
    var newRow = new Array(this.adjacencyMatrix[0].length).fill(0);

    //add new row
    this.adjacencyMatrix.push(newRow);

    //add new column
    for(var row = 0; row < this.adjacencyMatrix.length; row++)
      this.adjacencyMatrix[row].push(0);
  }

  addEdge(v0_index, v1_index) {
    if((v0_index < this.vertexList.length) && (v1_index < this.vertexList.length))
      this.adjacencyMatrix[v0_index][v1_index] = 1;
  }

  setSelectedEdge(vi, vj) {
    this.selectedEdge = [vi, vj];
  }

  deselectEdge() {
    this.selectedEdge = [-1, -1];
  }

  //returns array with [vi, vj] of the selected edge
  getSelectedEdge() {
    return this.selectedEdge;
  }

  makeComplement() {
    for(var row = 0; row < this.vertexList.length; row++)
      for(var col = row + 1; col < this.vertexList.length; col++)
          if(this.adjacencyMatrix[row][col] == 1)
            this.adjacencyMatrix[row][col] = 0;
          else
            this.adjacencyMatrix[row][col] = 1;          
  }

  draw(context) {
    //draw edges
    for(var row = 0; row < this.vertexList.length; row++)
      for(var col = row + 1; col < this.vertexList.length; col++)
        if(this.adjacencyMatrix[row][col] > 0) {
          var v0 = this.vertexList[row];
          var v1 = this.vertexList[col];
          context.beginPath();
          context.moveTo(v0.x, v0.y);
          context.lineTo(v1.x, v1.y);
          context.stroke();
          //console.log("Edge drawn: " + v0 + "-->" + v1);
        }

    //Draw Selected Edge
    if(this.selectedEdge[0] > -1) {
      var curStrokeColor = context.strokeStyle;
      var v0 = this.vertexList[this.selectedEdge[0]];
      var v1 = this.vertexList[this.selectedEdge[1]];
      context.beginPath();
      context.moveTo(v0.x, v0.y);
      context.lineTo(v1.x, v1.y);
      context.strokeStyle = this.selectedEdgeColor;
      context.stroke();
      context.strokeStyle = curStrokeColor;
    }

    //Draw vertices
    for(var i = 0; i < this.vertexList.length; i++)
      this.vertexList[i].draw(context);
  }

  //find distance in pixels from the mouse coordinates to the
  //edge vi --> vj
  getDistanceFromPointToEdge(x0, y0, vi, vj) {
    var x1 = this.vertexList[vi].x;
    var y1 = this.vertexList[vi].y;
    var x2 = this.vertexList[vj].x;
    var y2 = this.vertexList[vj].y;

    var numerator = Math.abs((y2-y1) * x0 - (x2-x1) * y0 + x2*y1-y2*x1);
    var denominator = Math.sqrt((y2-y1) * (y2-y1) + (x2-x1) * (x2-x1));

    return numerator/denominator;
  }

  //returns an array of 3 elements where
  //[0] --> index vertex vi, adjacent to the min distance edge
  //[1] --> index vertex vj, adjacent to the min distance edge
  //[2] --> distance from edge to point (x0,y0)
  getEdgeIndexWithClosestDistanceToPoint(x0, y0) {
    var minDistance = Number.MAX_VALUE, vi = -1, vj = -1;
    var result = [-1, -1, -1];

    for(var i = 0; i < this.vertexList.length; i++)
      for(var j = i + 1; j < this.vertexList.length; j++)
        if(this.adjacencyMatrix[i][j] > 0) {
          var distance = this.getDistanceFromPointToEdge(x0, y0, i, j);

          if(distance < minDistance) {
            minDistance = distance;
            vi = i;
            vj = j;
            result = [vi, vj, minDistance];
          }
        }

    return result;
  }

  //returns an array with 2 elements.
  //[0] --> index vertex vi or -1 if not found
  //[1] --> index vertex vj or -1 if not found
  getSelectedEdgeIndex(x0, y0, minDistanceRequired) {
    var closestDistanceArray = this.getEdgeIndexWithClosestDistanceToPoint(x0, y0);
    var minDistance = closestDistanceArray[2];
    var result = [-1, -1];

    if(minDistance <= minDistanceRequired) {
      result[0] = closestDistanceArray[0];
      result[1] = closestDistanceArray[1];
    }

    return result;
  }

}
