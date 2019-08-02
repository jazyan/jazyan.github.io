function selectEdge(edge) {
    edge.setAttribute("stroke-width", 10);
}

function deselectEdge(edge) {
    edge.setAttribute("stroke-width", 6);
}

function selectNode(node) {
    node.setAttribute("r", radius + 3);
}

function deselectNode(node) {
    node.setAttribute("r", radius);
}

function deselectObject(object) {
    if (object === null) {
        return;
    } else if (object.nodeName === "line") {
        deselectEdge(object);
    } else if (object.nodeName === "circle") {
        deselectNode(object);
    }
}

function clickEdge(edge) {
    if (selectedObject === null) {
        selectEdge(edge);
        selectedObject = edge;
    } else if (selectedObject.nodeName === "circle") {
        deselectNode(selectedObject);
        selectEdge(edge);
        selectedObject = edge;
    } else if (selectedObject === edge) {
        deselectEdge(edge);
        selectedObject = null;
    } else {
        // selectedObject is a line other than current edge
        deselectEdge(selectedObject)
        selectEdge(edge);
        selectedObject = edge;
    }
}

function clickNode(node) {
    if (selectedObject === null) {
        // if there's no currently selected node, the circle becomes the node
        selectNode(node);
        selectedObject = node;
    } else if (selectedObject.nodeName === "line") {
        deselectEdge(selectedObject);
        selectNode(node);
        selectedObject = node;
    } else if (selectedObject === node) {
        // if the currently selected node is the circle, deselect it
        deselectNode(node);
        selectedObject = null;
    } else {
        // there is a selected circle, and our current circle is another node
        // that means we want to draw an edge! then deselect the node
        x1 = parseInt(selectedObject.getAttribute("cx"));
        y1 = parseInt(selectedObject.getAttribute("cy"));
        x2 = parseInt(node.getAttribute("cx"));
        y2 = parseInt(node.getAttribute("cy"));
        var line = drawEdge(x1, y1, x2, y2);
        // add edge to nodeEdgeMap        
        var n1Edges = nodeEdgeMap.get(selectedObject);
        n1Edges.push(line);
        var n2Edges = nodeEdgeMap.get(node);
        n2Edges.push(line);
        // deselect currently selected node
        deselectNode(selectedObject);
        selectedObject = null;
    }
}