class Graph {
  constructor() {
    this.vertexList = [];
    this.adjacencyMatrix = new Array(30).fill(new Array(30).fill(0));
  }

  addVertex(x, y, radius, label, fillColor, strokeColor, strokeWeight) {
    var newVertex = new Vertex(x, y, radius, label, fillColor, strokeColor, strokeWeight);

    this.vertexList.push(newVertex);
  }

  addEdge(v0_index, v1_index) {

  }

  draw(context) {
    //draw edges
    for(row=0; row < this.vertexList.length; row++)
      for(col=row+1; col < this.vertexList.length; col++)
        if(this.adjacencyMatrix[row, col] > 0) {
          v0 = this.vertexList[row];
          v1 = this.vertexList[col];
          context.beginPath();
          context.moveTo(v0.x, v0.y);
          context.lineTo(v1.x, v1.y);
          context.stroke();
        }

    //Draw vertices
    for(i=0; i < this.vertexList.length; i++)
      this.vertexList[i].draw(context);
  }
}
