// deletes the current selected object 
function deleteSelectedObject() {
    if (selectedObject === null) {
        return;
    }
    if (selectedObject.nodeName === "circle") {
        deleteNodesEdges(selectedObject);
    } else {
        deleteEdgeFromList(selectedObject);
    }
    svg.removeChild(selectedObject);
    selectedObject = null;
}

function deleteEdgeFromList(toDeleteEdge) {
    for (var i = 0; i < edgeList.length; ++i) {
        if (edgeList[i][2] === toDeleteEdge) {
            edgeList.splice(i, 1);
            break;  // there should be only one occurrence of edge
        }
    }
}

// given a node that is to be deleted
// delete its edges, and all references to its edges
function deleteNodesEdges(toDeleteNode) {
    var indicesToDelete = [];
    var edgesToDelete = [];
    for (var i = 0; i < edgeList.length; i++) {
        if (edgeList[i][0] === toDeleteNode || edgeList[i][1] === toDeleteNode) {
            indicesToDelete.push(i);
            edgesToDelete.push(edgeList[i][2]);
        }
    }
    for (var i = indicesToDelete.length - 1; i >= 0; --i) {
        edgeList.splice(indicesToDelete[i], 1);
    }
    for (var i = 0; i < edgesToDelete.length; ++i) {
        svg.removeChild(edgesToDelete[i]);
    }
}