document.addEventListener("DOMContentLoaded", function () {
  const curveCanvas = document.getElementById("curveCanvas");
  const footballImage = document.getElementById("footballImage");
  const ctx = curveCanvas.getContext("2d");

  let points = [];
  let draggablePointIndex = -1;
  let isDrawing = false;
  let lineStart = null;
  let lineEnd = null;

  function addPointsOnLine() {
    if (lineStart && lineEnd) {
      if (points.length === 0) {
        points.push({ x: lineStart.x, y: lineStart.y });
        points.push({
          x: (lineStart.x + lineEnd.x) / 2,
          y: (lineStart.y + lineEnd.y) / 2,
        });
        points.push({ x: lineEnd.x, y: lineEnd.y });
      } else {
        points[0].x = lineStart.x;
        points[0].y = lineStart.y;
        points[1].x = (lineStart.x + lineEnd.x) / 2;
        points[1].y = (lineStart.y + lineEnd.y) / 2;
        points[2].x = lineEnd.x;
        points[2].y = lineEnd.y;
      }
    }
  }

  function drawCurve() {
    ctx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);

    if (points.length === 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
      ctx.stroke();
    }

    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
      ctx.fillStyle = draggablePointIndex === i ? "red" : "blue";
      ctx.fill();
    }

    if (isDrawing && lineStart && lineEnd) {
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(lineEnd.x, lineEnd.y);
      ctx.stroke();
    }
  }

  function handleMouseDown(event) {
    const rect = curveCanvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const distance = Math.sqrt(
        Math.pow(offsetX - point.x, 2) + Math.pow(offsetY - point.y, 2)
      );
      if (distance <= 5) {
        draggablePointIndex = i;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return;
      }
    }

    if (!isDrawing) {
      isDrawing = true;
      lineStart = { x: offsetX, y: offsetY };
      lineEnd = { x: offsetX, y: offsetY };
      drawCurve();
    } else {
      isDrawing = false;
      lineEnd = { x: offsetX, y: offsetY };
      drawCurve();
    }
  }

  function handleMouseMove(event) {
    const rect = curveCanvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (draggablePointIndex >= 0) {
      if (draggablePointIndex === 1) {
        points[1].x = offsetX;
        points[1].y = offsetY;
      } else {
        points[draggablePointIndex].x = offsetX;
        points[draggablePointIndex].y = offsetY;
      }

      lineStart.x = points[0].x;
      lineStart.y = points[0].y;
      lineEnd.x = points[2].x;
      lineEnd.y = points[2].y;

      drawCurve();
    }

    if (isDrawing && lineStart && lineEnd) {
      lineEnd.x = offsetX;
      lineEnd.y = offsetY;
      drawCurve();
      addPointsOnLine();
    }
  }

  function handleMouseUp() {
    draggablePointIndex = -1;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (isDrawing) {
      isDrawing = false;
      drawCurve();
    } else {
      drawCurve();
    }
  }

  function initializeWidget() {
    curveCanvas.width = footballImage.clientWidth;
    curveCanvas.height = footballImage.clientHeight;

    points = [];

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    drawCurve();
  }

  window.addEventListener("load", initializeWidget);
});
