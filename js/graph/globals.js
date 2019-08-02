var svg = document.getElementById("svg");
// radius of nodes
var radius = 12;
// either a node or an edge
var selectedObject = null;
// map of nodes keys to edge list values
var nodeEdgeMap = new Map();
// current color of edges
var currToggleColor = "blue";
var toggleColorText = document.querySelector("p");
toggleColorText.style.color = currToggleColor;

// toggle directed or undirected edges
var directed = false;

// canvas bounds
var XLOW = 5;
var XHIGH = 800;
var YLOW = 5;
var YHIGH = 800;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");