function createSVGCircle(x, y, r, strokeColor) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "black");
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", "2px");
    return circle;
}

function drawNode(event) {
    var pos = getMousePos(canvas, event);
    // ensure that nodes do not touch the boundary
    if (!checkWithinCanvas(pos.x, pos.y, radius / 2)) {
        return;
    }
    var circle = createSVGCircle(pos.x, pos.y, radius, "black");
    svg.appendChild(circle);
}

// given node centers (x1, y1) of circle C1 and (x2, y2) of circle C2
// draw an edge from the boundary of C1 to the boundary of C2
function drawEdge(x1, y1, x2, y2) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    var bp1 = computeBoundaryPoint(x1, y1, x2, y2);
    var bp2 = computeBoundaryPoint(x2, y2, x1, y1);
    line.setAttribute("x1", bp1[0]);
    line.setAttribute("y1", bp1[1]);
    line.setAttribute("x2", bp2[0]);
    line.setAttribute("y2", bp2[1]);
    line.setAttribute("stroke-width", 6);
    line.setAttribute("stroke", currToggleColor);
    if (directed) {
        line.setAttribute("marker-end", "url(#triangle-" + currToggleColor + ")")
    }
    svg.appendChild(line);
    return line;
}

function toggleColor() {
    if (currToggleColor === "blue") {
        currToggleColor = "red";
    } else {
        currToggleColor = "blue";
    }
    toggleColorText.style.color = currToggleColor;
}

function colorSelectedObject() {
    if (selectedObject === null) {
        return;
    } else if (selectedObject.nodeName === "line") {
        var currColor = selectedObject.getAttribute("stroke");
        if (currColor === "blue") {
            currColor = "red";
        } else {
            currColor = "blue";
        }
        selectedObject.setAttribute("stroke", currColor);
        if (directed) {
            selectedObject.setAttribute("marker-end", "url(#triangle-" + currColor + ")");
        }
    }
}

function toggleDirected() {
    directed = directed ? false : true;
    console.log(directed);
    for (var i = 0; i < svg.children.length; ++i) {
        var currNode = svg.children[i];
        if (currNode.nodeName === "line") {
            if (!directed) {
                currNode.setAttribute("marker-end", null);
            } else {
                console.log("bello");
                var currColor = currNode.getAttribute("stroke");
                currNode.setAttribute("marker-end", "url(#triangle-" + currColor + ")");
            }
        }
    }
}