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

function selectObject(object) {
    if (object === null) {
        return;
    } else if (object.nodeName === "line") {
        selectEdge(object);
    } else if (object.nodeName === "circle") {
        selectNode(object);
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
    if (selectedObject === node) {
        // if the currently selected node is the circle, deselect it
        deselectNode(node);
        selectedObject = null;
    } else {
        // selected object is either null or not equal to current node
        deselectObject(selectedObject);
        selectNode(node);
        selectedObject = node;
    }
}