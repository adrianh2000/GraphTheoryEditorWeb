class Graph {
  constructor() {
    this.vertexList = [];
    this.maxNumRows = 30;
    this.maxNumCols = 30;
    this.adjacencyMatrix = new Array(this.maxNumRows);

    for (var row=0; row < this.adjacencyMatrix.length; row++) {
      this.adjacencyMatrix[row]=new Array(this.maxNumCols);
      for(var col = 0; col < this.adjacencyMatrix[row].length; col++)
        this.adjacencyMatrix[row][col] = 0;
    }
  }

  addVertex(x, y, radius, label, fillColor, strokeColor, strokeWeight) {
    var newVertex = new Vertex(x, y, radius, label, fillColor, strokeColor, strokeWeight);

    this.vertexList.push(newVertex);
  }

  addEdge(v0_index, v1_index) {
    if((v0_index < this.vertexList.length) && (v1_index < this.vertexList.length))
      this.adjacencyMatrix[v0_index][v1_index] = 1;
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
          console.log("Edge drawn: " + v0 + "-->" + v1);
        }

    //Draw vertices
    for(var i = 0; i < this.vertexList.length; i++)
      this.vertexList[i].draw(context);
  }
}
