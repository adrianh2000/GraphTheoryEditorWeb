class Vertex {
  constructor(x, y, radius, label, fillColor, strokeColor, strokeWeight) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.label = label;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeight = strokeWeight;
  }

  setFillColor(newColor) { this.fillColor = newColor;  }
  
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.fillColor;
    context.strokeStyle = this.strokeColor;
    context.lineWidth = this.strokeWeight;
    context.fill();
    context.stroke();
    context.font = "15px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(this.label, this.x, this.y + this.radius/2);
  }

  isMouseInside(mouseX, mouseY) {
    return (mouseX >= this.x - this.radius) && (mouseX <= this.x + this.radius) &&
           (mouseY >= this.y - this.radius) && (mouseY <= this.y + this.radius);
  }
}
