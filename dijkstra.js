class Dijkstra {
    constructor(grid, startNode, targetNode) {
        this.grid = grid;
        this.startNode = startNode;
        this.targetNode = targetNode;

        this.queue = [[startNode[0], startNode[1], 0]];

        this.isFinished = false;

        this.parents = [];

        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(false);
            }
            this.parents.push(temp);
        }

        this.parents[this.startNode[1]][this.startNode[0]] = [-1, -1];

        this.gScores = [];

        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(Infinity);
            }
            this.gScores.push(temp);
        }

        this.gScores[this.startNode[1]][this.startNode[0]] = 0;

        this.nodesProccessed = 0;
        this.pathLen = 0;
    }

    step() {
        if (this.isFinished) {
            return;
        }

        if (this.queue.length == 0) {
            this.isFinished = true;
            return;
        }

        let bestIndex = -1;
        let leastScore = Infinity;

        for (let i = 0; i < this.queue.length; i++) {
            let [x, y, gScore] = this.queue[i];

            if (gScore < leastScore) {
                bestIndex = i;
                leastScore = gScore;
            }
        }

        let currentNode = this.queue[bestIndex];
        this.queue.splice(bestIndex, 1);

        this.nodesProccessed++;
        nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

        if (currentNode[2] > this.gScores[currentNode[1]][currentNode[0]]) {
            return;
        }

        if (currentNode[0] == this.targetNode[0] && currentNode[1] == this.targetNode[1]) {
            this.tracePath();
            this.isFinished = true;
            return;
        }

        this.grid.set([currentNode[0], currentNode[1]], 2);
        isNotClear = true;

        for (let n of getNeighbours(currentNode, this.grid)) {
            let newGScore = currentNode[2] + (currentNode[0] == n[0] || currentNode[1] == n[1] ? 1 : Math.SQRT2);
            if ((!this.parents[n[1]][n[0]] || this.gScores[n[1]][n[0]] > newGScore)) {
                this.queue.push([n[0], n[1], newGScore]);
                this.parents[n[1]][n[0]] = [currentNode[0], currentNode[1]];
                this.gScores[n[1]][n[0]] = newGScore;
                this.grid.set(n, 4);
            }
        }
    }

    tracePath() {
        this.pathLen = 0;
        let currentNode = this.targetNode;
        let prevNode = null;
        while (!(currentNode[0] == -1 && currentNode[1] == -1)) {
            if (prevNode) {
                this.pathLen += (currentNode[0] - prevNode[0] === 0 || currentNode[1] - prevNode[1] === 0) ? 1 : Math.SQRT2;
            }

            this.grid.set(currentNode, 3);

            prevNode = currentNode;
            currentNode = this.parents[currentNode[1]][currentNode[0]];
        }
        isNotClear = true;

        pathLenText.textContent = "Path Length: " + Math.round(this.pathLen * 100) / 100;
    }
}






















class BidirectionalDijkstra {
    constructor(grid, startNode, targetNode) {
        this.grid = grid;
        this.startNode = startNode;
        this.targetNode = targetNode;

        this.dxStart = this.startNode[0] - this.targetNode[0];
        this.dyStart = this.startNode[1] - this.targetNode[1];

        this.queue1 = [[startNode[0], startNode[1], 0]];
        this.queue2 = [[targetNode[0], targetNode[1], 0]];

        this.isFinished = false;

        this.parents1 = [];
        this.parents2 = [];


        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(false);
            }
            this.parents1.push(temp);
        }
        this.parents1[this.startNode[1]][this.startNode[0]] = [-1, -1];


        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(false);
            }
            this.parents2.push(temp);
        }
        this.parents2[this.targetNode[1]][this.targetNode[0]] = [-1, -1];



        this.gScores1 = [];

        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(Infinity);
            }
            this.gScores1.push(temp);
        }

        this.gScores1[this.startNode[1]][this.startNode[0]] = 0;


        this.gScores2 = [];

        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(Infinity);
            }
            this.gScores2.push(temp);
        }

        this.gScores2[this.targetNode[1]][this.targetNode[0]] = 0;

        this.nodesProccessed = 0;
        this.pathLen = 0;
    }

    step() {
        if (this.isFinished) {
            return;
        }

        if (this.queue1.length == 0 || this.queue2.length == 0) {
            this.isFinished = true;
            return;
        }






        if (this.queue1.length <= this.queue2.length) {
            let bestIndex = -1;
            let leastScore = Infinity;

            for (let i = 0; i < this.queue1.length; i++) {
                let [x, y, gScore] = this.queue1[i];

                if (gScore < leastScore) {
                    bestIndex = i;
                    leastScore = gScore;
                }
            }

            let currentNode = this.queue1[bestIndex];
            this.queue1.splice(bestIndex, 1);

            this.nodesProccessed++;
            nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

            if (currentNode[2] > this.gScores1[currentNode[1]][currentNode[0]]) {
                return;
            }

            if (this.parents2[currentNode[1]][currentNode[0]]) {
                this.tracePath(currentNode);
                this.isFinished = true;
                return;
            }

            this.grid.set(currentNode, 2);
            isNotClear = true;

            for (let n of getNeighbours(currentNode, this.grid)) {
                let newGScore = currentNode[2] + (currentNode[0] == n[0] || currentNode[1] == n[1] ? 1 : Math.SQRT2);
                if ((!this.parents1[n[1]][n[0]] || this.gScores1[n[1]][n[0]] > newGScore)) {
                    this.queue1.push([n[0], n[1], newGScore]);
                    this.parents1[n[1]][n[0]] = [currentNode[0], currentNode[1]];
                    this.gScores1[n[1]][n[0]] = newGScore;
                    this.grid.set(n, 4);
                }
            }
        } else {
            let bestIndex = -1;
            let leastScore = Infinity;

            for (let i = 0; i < this.queue2.length; i++) {
                let [x, y, gScore] = this.queue2[i];

                if (gScore < leastScore) {
                    bestIndex = i;
                    leastScore = gScore;
                }
            }

            let currentNode = this.queue2[bestIndex];
            this.queue2.splice(bestIndex, 1);

            this.nodesProccessed++;
            nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

            if (currentNode[2] > this.gScores2[currentNode[1]][currentNode[0]]) {
                return;
            }

            if (this.parents1[currentNode[1]][currentNode[0]]) {
                this.tracePath(currentNode);
                this.isFinished = true;
                return;
            }

            this.grid.set([currentNode[0], currentNode[1]], 2);
            isNotClear = true;

            for (let n of getNeighbours(currentNode, this.grid)) {
                let newGScore = currentNode[2] + (currentNode[0] == n[0] || currentNode[1] == n[1] ? 1 : Math.SQRT2);
                if ((!this.parents2[n[1]][n[0]] || this.gScores2[n[1]][n[0]] > newGScore)) {
                    this.queue2.push([n[0], n[1], newGScore]);
                    this.parents2[n[1]][n[0]] = [currentNode[0], currentNode[1]];
                    this.gScores2[n[1]][n[0]] = newGScore;
                    this.grid.set(n, 4);
                }
            }
        }
    }

    tracePath(node) {
        this.pathLen = 0;

        let currentNode = node;
        let prevNode = null;
        while (!(currentNode[0] == -1 && currentNode[1] == -1)) {
            if (prevNode) {
                this.pathLen += (currentNode[0] - prevNode[0] === 0 || currentNode[1] - prevNode[1] === 0) ? 1 : Math.SQRT2;
            }

            this.grid.set(currentNode, 3);

            prevNode = currentNode;
            currentNode = this.parents1[currentNode[1]][currentNode[0]];
        }

        currentNode = node;
        prevNode = null;
        while (!(currentNode[0] == -1 && currentNode[1] == -1)) {
            if (prevNode) {
                this.pathLen += (currentNode[0] - prevNode[0] === 0 || currentNode[1] - prevNode[1] === 0) ? 1 : Math.SQRT2;
            }

            this.grid.set(currentNode, 3);

            prevNode = currentNode;
            currentNode = this.parents2[currentNode[1]][currentNode[0]];
        }
        isNotClear = true;

        pathLenText.textContent = "Path Length: " + Math.round(this.pathLen * 100) / 100;
    }
}

