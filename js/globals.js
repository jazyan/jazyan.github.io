var svg = document.getElementById("svg");
// radius of nodes
var radius = 15;
// either a node or an edge
var selectedObject = null;
// map of nodes keys to edge list values
var nodeEdgeMap = new Map();

// canvas bounds
var XLOW = 20;
var XHIGH = 800;
var YLOW = 20;
var YHIGH = 800;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");