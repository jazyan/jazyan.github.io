var mousedElement = null;
var prevPos = null;  // used for whole graph dragging

function startDrag(evt) {
    var index = checkBoundary(evt, radius);
    if (index >= 0 && svg.children[index].nodeName === "circle") {
        mousedElement = svg.children[index];
    } else {
        var pos = getMousePos(canvas, evt);
        prevPos = [parseFloat(pos.x), parseFloat(pos.y)];
    }
}

function updateEdge(x1, y1, x2, y2, edge) {
    var bp1 = computeBoundaryPoint(x1, y1, x2, y2);
    var bp2 = computeBoundaryPoint(x2, y2, x1, y1);
    edge.setAttribute("x1", bp1[0]);
    edge.setAttribute("y1", bp1[1]);
    edge.setAttribute("x2", bp2[0]);
    edge.setAttribute("y2", bp2[1]);
}

// return whether or not we want to shift graph
function checkDragBoundary(deltaX, deltaY) {
    for (var i = 0; i < svg.children.length; ++i) {
        var node = svg.children[i];
        if (node.nodeName === "circle") {
            var x = parseFloat(node.getAttribute("cx")) - deltaX;
            var y = parseFloat(node.getAttribute("cy")) - deltaY;
            // -radius because we want to be stricter in terms of boundary touching
            if (!checkWithinCanvas(x, y, -radius)) {
                return false; // do not shift
            }
        }
    }
    return true;
}

// shift all circles and lines by delta
function shiftWholeGraph(deltaX, deltaY) {
    for (var i = 0; i < svg.children.length; ++i) {
        var node = svg.children[i];
        if (node.nodeName === "circle") {
            var currX = node.getAttribute("cx");
            var currY = node.getAttribute("cy");
            node.setAttribute("cx", parseFloat(currX) - deltaX);
            node.setAttribute("cy", parseFloat(currY) - deltaY);
        } else if (node.nodeName === "line") {
            var currX1 = node.getAttribute("x1");
            var currY1 = node.getAttribute("y1");
            var currX2 = node.getAttribute("x2");
            var currY2 = node.getAttribute("y2");
            node.setAttribute("x1", parseFloat(currX1) - deltaX);
            node.setAttribute("y1", parseFloat(currY1) - deltaY);
            node.setAttribute("x2", parseFloat(currX2) - deltaX);
            node.setAttribute("y2", parseFloat(currY2) - deltaY);
        }
    }
}

// shift mousedElement to pos, and update mousedElement's edges accordingly
function shiftMousedElementAndEdges(posX, posY) {
    for (var i = 0; i < edgeList.length; ++i) {
        var node1 = edgeList[i][0];
        var node2 = edgeList[i][1];
        var edge = edgeList[i][2];
        if (mousedElement === node1){
            updateEdge(
                parseInt(posX),
                parseInt(posY),
                parseInt(node2.getAttribute("cx")),
                parseInt(node2.getAttribute("cy")),
                edge
            );
        } else if (mousedElement === node2) {
            updateEdge(
                parseInt(node1.getAttribute("cx")),
                parseInt(node1.getAttribute("cy")),
                parseInt(posX),
                parseInt(posY),
                edge
            );
        }
    }
    mousedElement.setAttribute("cx", posX);
    mousedElement.setAttribute("cy", posY);
}

function drag(evt) {
    evt.preventDefault();
    var pos = getMousePos(canvas, evt);
    if (!mousedElement) {
        if (prevPos !== null) {
            // update all the elements by delta
            var deltaX = prevPos[0] - parseFloat(pos.x);
            var deltaY = prevPos[1] - parseFloat(pos.y);
            // update prevPos here to make dragging smooth
            prevPos[0] = parseFloat(pos.x);
            prevPos[1] = parseFloat(pos.y);
            if (checkDragBoundary(deltaX, deltaY)) {
                shiftWholeGraph(deltaX, deltaY);
            }
        }
    } else {
        shiftMousedElementAndEdges(pos.x, pos.y);
    }
}

function endDrag(evt) {
    mousedElement = null;
    prevPos = null;
}