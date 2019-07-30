// deletes the current selected object 
function deleteSelectedObject() {
    if (selectedObject === null) {
        return;
    }
    if (selectedObject.nodeName === "circle") {
        deleteNodeEdges(selectedObject);
    } else {
        deleteEdgeFromMap(selectedObject);
    }
    svg.removeChild(selectedObject);
    selectedObject = null;
}

function deleteEdgeFromMap(toDeleteEdge) {
    for (var [node, edgeList] of nodeEdgeMap) {
        for (var i = 0; i < edgeList.length; ++i) {
            if (toDeleteEdge === edgeList[i]) {
                edgeList.splice(i, 1);
                break;  // there should only be one occurrence of edge
            }
        }
    }
}

// given a node that is to be deleted
// delete its edges, and all references to its edges
// that includes references in the edge lists of other nodes
function deleteNodeEdges(toDeleteNode) {
    var edges = nodeEdgeMap.get(toDeleteNode);
    for (var [node, edgeList] of nodeEdgeMap) {
        if (node === toDeleteNode) {
            continue;
        }
        var toDelete = []
        for (var i = 0; i < edges.length; ++i) {
            for (var j = 0; j < edgeList.length; ++j) {
                if (edges[i] === edgeList[j]) {
                    toDelete.push(j);
                }
            }
        }
        for (var i = toDelete.length - 1; i >= 0; --i) {
            edgeList.splice(toDelete[i], 1);
        }
    }
    for (var i = 0; i < edges.length; ++i) {
        svg.removeChild(edges[i]);
    }
    nodeEdgeMap.delete(toDeleteNode);
}