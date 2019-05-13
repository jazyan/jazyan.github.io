var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var BLOCK_SIZE = 5;
canvas.height = canvas.width * 0.5;
var ROWS = canvas.width / BLOCK_SIZE;
var COLUMNS = canvas.height / BLOCK_SIZE;

// function to initialize array of 0s and 1s
// 1 is an alive cell, 0 is a dead cell
function initRandomBinaryArr(rows, columns) {
    var returnArr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        returnArr[i] = Array(columns).fill().map(() => Math.round(Math.random()))
    }
    return returnArr;
}

// our binary data array that we will mutate at every tick
var data = initRandomBinaryArr(ROWS, COLUMNS);

// return an array with the new state according the game rules
// the rules apply simultaneously to all cells
// also, update the canvas with new state
function update(arr, rows, columns) {
    var returnArr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        returnArr[i] = Array(columns);
    }
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var cellState = arr[i][j];
            var numAliveNeighbors = checkAliveNeighbors(arr, i, j);
            returnArr[i][j] = conwayRules(cellState, numAliveNeighbors);
            // update the canvas
            if (returnArr[i][j] == 0) {
                ctx.fillStyle = 'rgb(255, 255, 255)';
            } else {
                ctx.fillStyle = 'rgb(0, 0, 0)'
            }
            ctx.fillRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    return returnArr;
}

// returns the state of the cell, which depends on the cell's
// current state, and the state of its neighbors
function conwayRules(cellState, numAliveNeighbors) {
    if (cellState == 1) { // cell is alive
        if (numAliveNeighbors < 2) {
            return 0; // underpopulation
        } 
        if (numAliveNeighbors < 4) {
            return 1; // nothing changes
        } 
        return 0;  // >= 4 live neighbors, die from overpopulation
    }
    // cell is dead 
    if (numAliveNeighbors == 3) {
        return 1; // reproduction, be born again!
    } 
    return 0; // stay dead :(
}

// helper function to return neighbors: N, S, E, W, and diagonals
function checkAliveNeighbors(arr, x, y) {
    var neighbors = [
        [1, 0], [-1, 0], [0, 1], [0, -1], 
        [1, 1], [-1, -1], [1, -1], [-1, 1]
    ]
    var liveNeighbors = 0;
    for (var i = 0; i < neighbors.length; i++) {
        c_x = x + neighbors[i][0];
        c_y = y + neighbors[i][1]
        // check bounds
        if (c_x < 0 || c_x >= ROWS || c_y < 0 || c_y >= COLUMNS) {
            continue;
        }
        liveNeighbors += arr[c_x][c_y];
    }
    return liveNeighbors;
}

// update, then draw the new state of the binary array on the canvas
function draw() {
    data = update(data, ROWS, COLUMNS);    
}

setInterval(draw, 1000);