class BFS {
    constructor(grid, startNode, targetNode) {
        this.grid = grid;
        this.startNode = startNode;
        this.targetNode = targetNode;

        this.queue = [this.startNode];

        this.isFinished = false;

        this.parents = [];

        for (let i = 0; i < grid.height; i++) {
            let temp = [];
            for (let j = 0; j < grid.width; j++) {
                temp.push(null);
            }
            this.parents.push(temp);
        }

        this.parents[this.startNode[1]][this.startNode[0]] = [-1, -1];

        if (this.startNode[0] == this.targetNode[0] && this.startNode[1] == this.targetNode[1]) {
            this.isFinished = true;
        }

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

        let currentNode = this.queue.shift();

        this.nodesProccessed++;
        nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

        this.grid.set(currentNode, 2);
        isNotClear = true;

        for (let n of getNeighbours(currentNode, this.grid)) {
            if (!this.parents[n[1]][n[0]]) {
                this.queue.push(n);
                this.parents[n[1]][n[0]] = currentNode;
                this.grid.set(n, 4);

                if (n[0] == this.targetNode[0] && n[1] == this.targetNode[1]) {
                    this.tracePath();
                    this.isFinished = true;
                    return;
                }
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



class BidirectionalBFS {
    constructor(grid, startNode, targetNode) {
        this.grid = grid;
        this.startNode = startNode;
        this.targetNode = targetNode;

        this.queue1 = [this.startNode];
        this.queue2 = [this.targetNode];

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

        if (this.startNode[0] == this.targetNode[0] && this.startNode[1] == this.targetNode[1]) {
            this.isFinished = true;
        }

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
            let currentNode = this.queue1.shift();

            this.nodesProccessed++;
            nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

            this.grid.set(currentNode, 2);
            isNotClear = true;

            for (let n of getNeighbours(currentNode, this.grid)) {
                if (!this.parents1[n[1]][n[0]]) {
                    this.queue1.push(n);
                    this.parents1[n[1]][n[0]] = currentNode;
                    this.grid.set(n, 4);

                    if (this.parents2[n[1]][n[0]]) {
                        this.tracePath(n);
                        this.isFinished = true;
                        return;
                    }
                }
            }
        } else {
            let currentNode = this.queue2.shift();

            this.nodesProccessed++;
            nodesProcessedText.textContent = "Nodes Processed: " + this.nodesProccessed;

            this.grid.set(currentNode, 2);
            isNotClear = true;

            for (let n of getNeighbours(currentNode, this.grid)) {
                if (!this.parents2[n[1]][n[0]]) {
                    this.queue2.push(n);
                    this.parents2[n[1]][n[0]] = currentNode;
                    this.grid.set(n, 4);

                    if (this.parents1[n[1]][n[0]]) {
                        this.tracePath(n);
                        this.isFinished = true;
                        return;
                    }
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