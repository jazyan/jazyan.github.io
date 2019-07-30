// TODO: dragging logic
// TODO: taken from https://www.kirupa.com/html5/drag.htm, but doesn't quite work
// TODO: NOT CALLED YET
var initialX;
var initialY;
var currentX;
var currentY;
var draggedObject = null;
svg.addEventListener("mousedown", dragStart, false);
svg.addEventListener("mouseup", dragEnd, false);
svg.addEventListener("mousemove", drag, false);

function dragStart(e) {
    var index = checkBoundary(e, radius);
    if (index > 0) {
        draggedObject = svg.children[index];
        initialX = draggedObject.getAttribute("cx");
        initialY = draggedObject.getAttribute("cy");
    }
    console.log("START DRAG");
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    draggedObject = null;
}

function drag(e) {
    console.log("dragging");
    if (draggedObject != null) {
        var currentPos = getMousePos(e);
        currentX = currentPos.x;
        currentY = currentPos.y;
        draggedObject.setAttribute("cx", currentX);
        draggedObject.setAttribute("cy", currentY);
    }
}