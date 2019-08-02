// draw canvas
ctx.strokeStyle = "black";
ctx.strokeRect(XLOW, YLOW, XHIGH, YHIGH);

document.onkeydown = function (e) {
    if (e.keyCode === 8) {  // backspace
        deleteSelectedObject();
    } else if (e.keyCode === 9) {  // tab
        toggleColor();
    } else if (e.keyCode === 16) {  // shift
        colorSelectedObject();
    } else if (e.keyCode === 17) {  // ctrl 
        toggleDirected();
    }
}

window.onload = function () {
    // double click creates a node
    canvas.ondblclick = function (e) {
        // to ensure that the nodes don't overlap
        // they have to be 2 * radius away from each other
        var index = checkBoundary(e, radius * 2);
        if (index === -1) {
            drawNode(e);
        }
    }
    // single click selects / deselects node
    // as well as creates edge
    // TODO: delete edge
    canvas.onclick = function (e) {
        var index = checkBoundary(e, radius);
        if (index >= 0) {
            var node = svg.children[index];
            if (node.nodeName === "line") {
                clickEdge(node);
            } else {
                clickNode(node);
            }
        }
    }
}

// SVG to PNG logic below
// taken from https://stackoverflow.com/a/28226736
var btn = document.querySelector('button');

function triggerDownload (imgURI) {
    var evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
    });
    var a = document.createElement('a');
    a.setAttribute('download', 'graph.png');
    a.setAttribute('href', imgURI);
    a.setAttribute('target', '_blank');
    a.dispatchEvent(evt);
}

btn.addEventListener('click', function () {
    // deselect selectedObject so resulting PNG has no selected objects 
    deselectObject(selectedObject);
    selectedObject = null;
    
    var data = (new XMLSerializer()).serializeToString(svg);
    var DOMURL = window.URL || window.webkitURL || window;
    
    var img = new Image();
    var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svgBlob);
    
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        var imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        triggerDownload(imgURI);
    };
    img.src = url;
});