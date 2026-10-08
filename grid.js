class Grid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.data = [];

        this.empty();
    }

    empty() {
        this.data = [];
        for (let i = 0; i < this.height; i++) {
            let temp = [];
            for (let j = 0; j < this.width; j++) {
                temp.push(0);
            }
            this.data.push(temp);
        }
    }

    generateMaze() {
        this.data = [];
        for (let i = 0; i < this.height; i++) {
            let temp = [];
            for (let j = 0; j < this.width; j++) {
                temp.push(1);
            }
            this.data.push(temp);
        }

        let stack = [[1, 1]];

        let parents = [];
        for (let i = 0; i < this.height; i++) {
            let temp = [];
            for (let j = 0; j < this.width; j++) {
                temp.push(false);
            }
            parents.push(temp);
        }

        while (stack.length > 0) {
            let index = Math.floor(Math.random() * stack.length);
            let currentNode = stack[index];
            stack.splice(index, 1);

            let parent = parents[currentNode[1]][currentNode[0]];
            if (parent) {
                this.set([(currentNode[0] + parent[0]) / 2, (currentNode[1] + parent[1]) / 2], 0);
            }
            this.set(currentNode, 0);

            for (let n of this.getMazeNeighbours(currentNode)) {
                stack.push(n);
                parents[n[1]][n[0]] = currentNode;
            }
        }
    }

    getMazeNeighbours(pos) {
        let dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];

        let neighbours = [];

        for (let dir of dirs) {
            let x = pos[0] + dir[0];
            let y = pos[1] + dir[1];
            if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.data[y][x] == 1) {
                neighbours.push([x, y]);
            }
        }

        return neighbours;
    }

    set(gridPos, val) {
        const [x, y] = gridPos;
        this.data[y][x] = val;
    }

    getGridIndex(x, y) {
        let halfWidth = (this.width * this.cellSize) / 2;
        let halfHeight = (this.height * this.cellSize) / 2;

        if (x < -halfWidth || x >= halfWidth || y < -halfHeight || y >= halfHeight) {
            return null;
        }

        let gridX = Math.floor((x + halfWidth) / this.cellSize);
        let gridY = Math.floor((y + halfHeight) / this.cellSize);

        return [gridX, gridY];
    }

    clearTemp() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.data[i][j] != 1) {
                    this.data[i][j] = 0;
                }
            }
        }
    }

    draw() {
        ctx.strokeStyle = "#545454";
        let startX = -this.width / 2;
        let startY = -this.height / 2;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let x = (startX + i) * this.cellSize;
                let y = (startY + j) * this.cellSize;

                ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                if (startPos[0] == i && startPos[1] == j) {
                    ctx.fillStyle = "#007814";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (targetPos[0] == i && targetPos[1] == j) {
                    ctx.fillStyle = "#780000";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (this.data[j][i] == 1) {
                    ctx.fillStyle = "#545454";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (this.data[j][i] == 2) {
                    ctx.fillStyle = "#1e3799";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (this.data[j][i] == 3) {
                    ctx.fillStyle = "#ffffaa";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (this.data[j][i] == 4) {
                    ctx.fillStyle = "#2f55eb";
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
    }
}




function getNeighbours(pos, grid) {
    let dirs = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]

    let neighbours = [];

    for (let dir of dirs) {
        let x = pos[0] + dir[0];
        let y = pos[1] + dir[1];
        if (x >= 0 && x < grid.width && y >= 0 && y < grid.height && grid.data[y][x] !== 1) {
            if (!(dir[0] == 0 || dir[1] == 0)) {
                if (!(grid.data[pos[1]][x] === 1 || grid.data[y][pos[0]] === 1)) {
                    neighbours.push([x, y]);
                }
            } else {
                neighbours.push([x, y]);
            }
        }
    }

    return neighbours;
}

function resetGrid() {
    if(searchRunning) {
        return;
    }
    startPos = [1, 1];
    targetPos = [cols - 2, rows - 2];
    grid.empty();
}

function genMaze() {
    if(searchRunning) {
        return;
    }
    startPos = [1, 1];
    targetPos = [cols - 2, rows - 2];
    grid.generateMaze();
}