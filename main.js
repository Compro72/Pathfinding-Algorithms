const canvas = document.getElementById("mainCanvas");

canvas.width = window.innerWidth * 0.72;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const cellSize = 25;
let cols = Math.floor((window.innerWidth * 0.7) / cellSize);
let rows = Math.floor((window.innerHeight) / cellSize);

cols += cols % 2 - 1;
rows += rows % 2 - 1;

let grid = new Grid(cols, rows, cellSize);

let startPos = [1, 1];
let targetPos = [cols - 2, rows - 2];

let activeSearch = null;
let isNotClear = false;
let toClear = false;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;


// UI

function updateUi() {
    drawBtn.style.backgroundColor = drawMode === "draw" ? "#4365ff" : "#141f52";
    eraseBtn.style.backgroundColor = drawMode === "erase" ? "#4365ff" : "#141f52";
    setStartBtn.style.backgroundColor = drawMode === "setStart" ? "#4365ff" : "#141f52";
    setTargetBtn.style.backgroundColor = drawMode === "setTarget" ? "#4365ff" : "#141f52";

    bfsBtn.style.backgroundColor = searchMode === "bfs" ? "#4365ff" : "#141f52";
    dfsBtn.style.backgroundColor = searchMode === "dfs" ? "#4365ff" : "#141f52";
    dijkstraBtn.style.backgroundColor = searchMode === "dijkstra" ? "#4365ff" : "#141f52";
    aStarBtn.style.backgroundColor = searchMode === "aStar" ? "#4365ff" : "#141f52";

    singleDirBtn.style.backgroundColor = directionalMode === "single" ? "#4365ff" : "#141f52";
    biDirBtn.style.backgroundColor = directionalMode === "double" ? "#4365ff" : "#141f52";

    startSearchBtn.style.backgroundColor = searchRunning ? "#4365ff" : "#141f52";
}

let drawMode = "draw";
let searchMode = "bfs";
let directionalMode = "single";
let searchRunning = false;

const drawBtn = document.getElementById("drawBtn");
const eraseBtn = document.getElementById("eraseBtn");
const setStartBtn = document.getElementById("setStartBtn");
const setTargetBtn = document.getElementById("setTargetBtn");

const bfsBtn = document.getElementById("bfsBtn");
const dfsBtn = document.getElementById("dfsBtn");
const dijkstraBtn = document.getElementById("dijkstraBtn");
const aStarBtn = document.getElementById("aStarBtn");

const singleDirBtn = document.getElementById("singleDirBtn");
const biDirBtn = document.getElementById("biDirBtn");

const startSearchBtn = document.getElementById("startSearchBtn");

const nodesProcessedText = document.getElementById("nodesProcessedText");
const pathLenText = document.getElementById("pathLenText");

updateUi();




window.addEventListener("mousedown", (e) => {
    mouseDown = true;
    handleDrawing();
});

window.addEventListener("mouseup", () => {
    mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (((e.clientX - rect.left) / rect.width) * canvas.width) - (canvas.width / 2);
    mouseY = (canvas.height / 2) - (((e.clientY - rect.top) / rect.height) * canvas.height);

    if (mouseDown) {
        handleDrawing();
    }
});

function handleDrawing() {
    if (searchRunning) {
        return;
    }

    let gridPos = grid.getGridIndex(mouseX, mouseY);
    if (gridPos) {
        if (drawMode === "draw") {
            grid.set(gridPos, 1);
            toClear = true;
        } else if (drawMode === "erase") {
            grid.set(gridPos, 0);
            toClear = true;
        } else if (drawMode === "setStart") {
            startPos = gridPos;
            toClear = true;
        } else if (drawMode === "setTarget") {
            targetPos = gridPos;
            toClear = true;
        }
    }
}

function loop() {
    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);

    if (toClear && isNotClear && !searchRunning) {
        grid.clearTemp();
        toClear = false;
        isNotClear = false;
    }

    if (searchRunning && activeSearch) {
        activeSearch.step();
        if (activeSearch.isFinished) {
            searchRunning = false;
            updateUi();
        }
    }

    grid.draw();

    ctx.restore();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);