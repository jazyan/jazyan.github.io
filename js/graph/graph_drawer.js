document.onkeydown = function (e) {
    if (e.keyCode === 8) {  // backspace
        deleteSelectedObject();
    } else if (e.keyCode === 9) {  // tab
        e.preventDefault();
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
    canvas.onclick = function (e) {
        var index = checkBoundary(e, radius);
        if (index >= 0) {
            var node = svg.children[index];
            if (node.nodeName === "line") {
                clickEdge(node);
            } else {
                clickNode(node);
            }
        } else {
            // clicking outside the graph deselects selected object
            deselectObject(selectedObject);
        }
    }

    // drag start
    canvas.onmousedown = function (e) {
        startDrag(e);
    }

    // drag
    canvas.onmousemove = function (e) {
        drag(e);
    }

    // drag end
    canvas.onmouseup = function (e) {
        endDrag(e);
    }

    // drag end
    canvas.onmouseleave = function (e) {
        endDrag(e);
    }

    // right-click to create edge
    canvas.oncontextmenu = function(e) {
        e.preventDefault();
        var index = checkBoundary(e, radius);
        if (index >= 0) {
            var node = svg.children[index];
            if (node.nodeName === "circle") {
                createEdge(node);
            }
        }
    }
    // TODO: shift click for text?
    /*
    canvas.addEventListener("click", function (e) {
        if (e.shiftKey) {
            console.log("SHIFTY");
        }
    });
    */
    /*
    // TODO: zoom
    canvas.addEventListener('wheel', function(e) {
        if (e.shiftKey) {
            var delta = Math.sign(e.deltaY);
            // scroll up is -1
            // scroll down is 1
            console.log(delta);
            var scale = svg.getAttribute("transform");
            var zoom = 1;
            if (scale !== null) {
                zoom = parseFloat(scale.substring(6, scale.length - 1));
                console.log(zoom);
            }
            if (delta === 1) {
                zoom += 0.1;
            } else {
                zoom -= 0.1;
            }
            var scale = "scale(" + zoom + ")";
            console.log(scale);
            svg.setAttribute("transform", scale);
        }
    }, false);*/
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
        // clear the drawings we made on the canvas
        // otherwise it will be overlaid by the SVG images
        ctx.clearRect(XLOW, YLOW, XHIGH, YHIGH);
    };
    img.src = url;
});