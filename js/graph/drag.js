var mousedElement = null;

function startDrag(node) {
    if (node !== null && node.nodeName === "circle") {
        mousedElement = node;
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

function drag(evt) {
    if (!mousedElement) {
        return;
    }
    evt.preventDefault();
    var pos = getMousePos(canvas, evt);
    for (var i = 0; i < edgeList.length; ++i) {
        var node1 = edgeList[i][0];
        var node2 = edgeList[i][1];
        var edge = edgeList[i][2];
        if (mousedElement === node1){
            updateEdge(
                parseInt(pos.x),
                parseInt(pos.y),
                parseInt(node2.getAttribute("cx")),
                parseInt(node2.getAttribute("cy")),
                edge
            );
        } else if (mousedElement === node2) {
            updateEdge(
                parseInt(node1.getAttribute("cx")),
                parseInt(node1.getAttribute("cy")),
                parseInt(pos.x),
                parseInt(pos.y),
                edge
            );
        }
    }
    mousedElement.setAttribute("cx", pos.x);
    mousedElement.setAttribute("cy", pos.y);
}

function endDrag(evt) {
    mousedElement = null;
}