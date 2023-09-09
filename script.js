const gridContainer = document.getElementById('gridContainer')
const findButton = document.getElementById('findButton')
const algorithmElement = document.getElementById('algorithm')
const clearButton = document.getElementById('clearButton')

const numRows = 18 // Number of rows in the grid
const numCols = 40 // Number of columns in the grid
var startNode = null
var endNode = null
var gridArray = new Array(numRows).fill().map(() => new Array(numCols).fill(0))
// 0 -> not visited
// 1 -> visited

async function BFSSearch() {
    let queue = []
    queue.push([parseInt(startNode.dataset.row), parseInt(startNode.dataset.col)])
    while(queue.length > 0) {
        currentNode = queue.pop()
        if(gridArray[currentNode[0]][currentNode[1]] == 1) continue
        if(gridContainer.children[currentNode[0] * numCols + currentNode[1]] === endNode) return
        gridArray[currentNode[0]][currentNode[1]] = 1
        if(currentNode[0] != parseInt(startNode.dataset.row) || currentNode[1] != parseInt(startNode.dataset.col)) {
            gridContainer.children[currentNode[0] * numCols + currentNode[1]].style.backgroundColor = '#ADD8E6'
        }
        await new Promise(resolve => setTimeout(resolve, 5))
        if(currentNode[1] + 1 < numCols) queue.unshift([currentNode[0], currentNode[1] + 1])
        if(currentNode[0] + 1 < numRows) queue.unshift([currentNode[0] + 1, currentNode[1]])
        if(currentNode[1] - 1 >= 0) queue.unshift([currentNode[0], currentNode[1] - 1])
        if(currentNode[0] - 1 >= 0) queue.unshift([currentNode[0] - 1, currentNode[1]])
    }
}

async function DFSRecursive(currentNode) {
    if(currentNode[0] < 0 || currentNode[0] >= numRows || currentNode[1] < 0 || currentNode[1] >= numCols) {
        return false;
    }
    if(gridArray[currentNode[0]][currentNode[1]] == 1) return false
    if(gridContainer.children[currentNode[0] * numCols + currentNode[1]] === endNode) return true
    gridArray[currentNode[0]][currentNode[1]] = 1
    await new Promise(resolve => setTimeout(resolve, 20))
    if(currentNode[0] != parseInt(startNode.dataset.row) || currentNode[1] != parseInt(startNode.dataset.col)) {
        gridContainer.children[currentNode[0] * numCols + currentNode[1]].style.backgroundColor = '#ADD8E6'
    }
    let founded = false
    if(await DFSRecursive([currentNode[0], currentNode[1] + 1])) founded = true
    else if(await DFSRecursive([currentNode[0] + 1, currentNode[1]])) founded = true
    else if(await DFSRecursive([currentNode[0], currentNode[1] - 1])) founded = true
    else if(await DFSRecursive([currentNode[0] - 1, currentNode[1]])) founded = true
    if(founded) {
        if(currentNode[0] != parseInt(startNode.dataset.row) || currentNode[1] != parseInt(startNode.dataset.col)) {
            gridContainer.children[currentNode[0] * numCols + currentNode[1]].style.backgroundColor = '#FFFFE0'
        }
        return true
    }
    return false
}

function DFSSearch() {
    DFSRecursive([parseInt(startNode.dataset.row), parseInt(startNode.dataset.col)])
}

async function DijkstraSearch() {
    const customComparator = (a, b) => a.distance - b.distance;
    let minHeap = new Heap(customComparator)
    let distance = new Array(numRows).fill().map(() => new Array(numCols).fill(Number.MAX_VALUE))
    // distance[parseInt(startNode.dataset.row)][parseInt(startNode.dataset.col)] = 0
    minHeap.push({nodePosition: [parseInt(startNode.dataset.row), parseInt(startNode.dataset.col)], distance: 0})
    while(!minHeap.isEmpty()) {
        let currentNode = minHeap.pop()
        if(gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1]] == 1) continue
        distance[currentNode.nodePosition[0]][currentNode.nodePosition[1]] = currentNode.distance
        if(gridContainer.children[currentNode.nodePosition[0] * numCols + currentNode.nodePosition[1]] === endNode) return 
        gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1]] = 1
        if(currentNode.nodePosition[0] != parseInt(startNode.dataset.row) || currentNode.nodePosition[1] != parseInt(startNode.dataset.col)) {
            gridContainer.children[currentNode.nodePosition[0] * numCols + currentNode.nodePosition[1]].style.backgroundColor = '#ADD8E6'
        }
        await new Promise(resolve => setTimeout(resolve, 20))
        if(currentNode.nodePosition[0] + 1 < numRows && currentNode.distance + 1 < distance[currentNode.nodePosition[0] + 1][currentNode.nodePosition[1]]) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0] + 1, currentNode.nodePosition[1]], distance: currentNode.distance + 1})
        } if(currentNode.nodePosition[0] - 1 >= 0 && currentNode.distance + 1 < distance[currentNode.nodePosition[0] - 1][currentNode.nodePosition[1]]) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0] - 1, currentNode.nodePosition[1]], distance: currentNode.distance + 1})
        } if(currentNode.nodePosition[1] + 1 < numCols && currentNode.distance + 1 < distance[currentNode.nodePosition[0]][currentNode.nodePosition[1] + 1]) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0], currentNode.nodePosition[1] + 1], distance: currentNode.distance + 1})
        } if(currentNode.nodePosition[1] - 1 >= 0 && currentNode.distance + 1 < distance[currentNode.nodePosition[0]][currentNode.nodePosition[1] - 1]) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0], currentNode.nodePosition[1] - 1], distance: currentNode.distance + 1})
        }
    }
    
}



function calculateDistance(row, col) {
    let startDx = (parseInt(startNode.dataset.row) - row)
    let startDy = (parseInt(startNode.dataset.col) - col)
    let startDistance = Math.sqrt(startDx * startDx + startDy * startDy)
    let endDx = (parseInt(endNode.dataset.row) - row)
    let endDy = (parseInt(endNode.dataset.col) - col)
    let endDistance = Math.sqrt(endDx * endDx + endDy * endDy)
    return startDistance + endDistance
}

async function aStarSearch() {
    const customComparator = (a, b) => a.fCost - b.fCost;
    let minHeap = new Heap(customComparator)
    minHeap.push({nodePosition: [parseInt(startNode.dataset.row), parseInt(startNode.dataset.col)], fCost: 0})
    while(!minHeap.isEmpty()) {
        let currentNode = minHeap.pop()
        if(gridContainer.children[currentNode.nodePosition[0] * numCols + currentNode.nodePosition[1]] === endNode) return 
        if(currentNode.nodePosition[0] != parseInt(startNode.dataset.row) || currentNode.nodePosition[1] != parseInt(startNode.dataset.col)) {
            gridContainer.children[currentNode.nodePosition[0] * numCols + currentNode.nodePosition[1]].style.backgroundColor = '#ADD8E6'
        } 
        await new Promise(resolve => setTimeout(resolve, 40))
        if(currentNode.nodePosition[0] + 1 < numRows && gridArray[currentNode.nodePosition[0] + 1][currentNode.nodePosition[1]] == 0) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0] + 1, currentNode.nodePosition[1]], fCost: calculateDistance(currentNode.nodePosition[0] + 1, currentNode.nodePosition[1])})
            gridArray[currentNode.nodePosition[0] + 1][currentNode.nodePosition[1]] = 1
        } if(currentNode.nodePosition[0] - 1 >= 0 && gridArray[currentNode.nodePosition[0] - 1][currentNode.nodePosition[1]] == 0) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0] - 1, currentNode.nodePosition[1]], fCost: calculateDistance(currentNode.nodePosition[0] - 1, currentNode.nodePosition[1])})
            gridArray[currentNode.nodePosition[0] - 1][currentNode.nodePosition[1]] = 1
        } if(currentNode.nodePosition[1] + 1 < numCols && gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1] + 1] == 0) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0], currentNode.nodePosition[1] + 1], fCost: calculateDistance(currentNode.nodePosition[0], currentNode.nodePosition[1] + 1)})
            gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1] + 1] = 1
        } if(currentNode.nodePosition[1] - 1 >= 0 && gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1] - 1] == 0) {
            minHeap.push({nodePosition: [currentNode.nodePosition[0], currentNode.nodePosition[1] - 1], fCost: calculateDistance(currentNode.nodePosition[0], currentNode.nodePosition[1] - 1)})
            gridArray[currentNode.nodePosition[0]][currentNode.nodePosition[1] - 1] = 1
        }
    }
}

function createGrid() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div')
            cell.classList.add('grid-cell')
            cell.dataset.row = i
            cell.dataset.col = j
            cell.addEventListener('click', function () {
                if (!startNode) {
                    startNode = cell
                    startNode.classList.add('start-node')
                } else if (!endNode) {
                    if(cell == startNode){
                        startNode = null
                        cell.classList.remove('start-node')
                    } else {
                        endNode = cell
                        endNode.classList.add('end-node')
                    }
                } else {
                    if(cell == endNode) {
                        endNode = null
                        cell.classList.remove('end-node')
                    } else {
                        endNode.classList.remove('end-node')
                        endNode = cell
                        endNode.classList.add('end-node')
                    }
                }
            })

            gridContainer.appendChild(cell)
        }
    }
}

function handleFindButton() {
    let currentAlgorithm = algorithmElement.value
    switch(currentAlgorithm) {
        case "dfs":
            DFSSearch()
            break
        case "bfs":
            BFSSearch()
            break
        case "dijkstra":
            DijkstraSearch()
            break
        case "aStar":
            aStarSearch()
            break
    }
}

function handleClearButton() {
    gridContainer.innerHTML = ''
    createGrid()
    gridArray = new Array(numRows).fill().map(() => new Array(numCols).fill(0))
    startNode = null
    endNode = null
}

clearButton.addEventListener('click', handleClearButton)
findButton.addEventListener('click', handleFindButton)
window.addEventListener('load', createGrid)