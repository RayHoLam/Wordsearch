const initialWords = ["APPLE", "BANANA", "CHERRY", "DURIAN", "ELDERBERRY", "FIG", "GRAPE", "HONEYDEW", "KIWI", "LEMON", "MANGO", "NECTARINE", "ORANGE", "PAPAYA", "QUINCE", "RASPBERRY", "STRAWBERRY", "TANGERINE", "WATERMELON", "VANILLA", "PIZZA", "BURGER", "PASTA", "ICECREAM", "TACO", "BROWNIE", "CUPCAKE", "DUMPLING", "EGG", "FRUITCAKE", "GRANOLA", "HAMBURGER", "JELLY", "KETCHUP", "LASAGNA", "MEATBALL", "NOODLES", "OATMEAL", "QUICHE", "RAVIOLI", "SUSHI", "TORTILLA", "YOGURT", "ZUCCHINI", "AVOCADO", "BISCUIT", "CROISSANT", "DONUT", "GINGER", "JAM", "KALBI", "LOBSTER", "MOUSSE", "NACHOS", "OUTBACK", "POTATO", "QUINOA", "RICE", "SAUSAGE", "VERMICELLI", "WAFFLE", "XMAS COOKIES", "YAKITORI"];

document.addEventListener("DOMContentLoaded", function() {
    generateNewWords();
});

let words = [];
const gridSize = 10;
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
let selectedCells = [];
let foundWords = [];
let isSelecting = false;

const newWordsButton = document.getElementById("new-words");
const wordSearchDiv = document.getElementById("word-search");

newWordsButton.addEventListener("click", generateNewWords);
wordSearchDiv.addEventListener("mouseleave", resetSelection);

function generateNewWords() {
    console.log("New game started");
    resetGame();
    words = getRandomWords(initialWords, 10);
    console.log("Words generated:", words);
    generateGrid();
    updateWordList();
}

function getRandomWords(arr, num) {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, num);
}

function resetGame() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    selectedCells = [];
    foundWords = [];
    wordSearchDiv.innerHTML = "";
    isSelecting = false;
}

function generateGrid() {
    words.forEach(word => {
        placeWord(word);
    });
    fillEmptyCells();
    displayGrid();
}

function placeWord(word) {
    const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
    const shuffledNumbers = () => {
        const numbers = Array.from({ length: gridSize }, (_, i) => i);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    };

    const rows = shuffledNumbers();
    const cols = shuffledNumbers();
    
    for (let row of rows) {
        for (let col of cols) {
            if (canPlaceWord(word, row, col, direction)) {
                for (let i = 0; i < word.length; i++) {
                    if (direction === "horizontal") {
                        grid[row][col + i] = word[i];
                    } else {
                        grid[row + i][col] = word[i];
                    }
                }
                console.log(`Placed "${word}" at (${row}, ${col}) ${direction}`);
                return;
            }
        }
    }
}

function checkForWord() {
    const selectedLetters = selectedCells.map(cell => grid[cell.row][cell.col]).join("");
    console.log("Selected Letters:", selectedLetters);

    if (words.includes(selectedLetters)) {
        foundWords.push(selectedLetters);
        highlightFoundWord(selectedLetters);
        console.log("Found Word:", selectedLetters);

        if (foundWords.length === words.length) { // Check against total words
            alert("Congratulations! You've found all the words!");
        }
    } else {
        console.log("Word not found");
        resetSelection();
    }
    selectedCells = [];
}

function canPlaceWord(word, row, col, direction) {
    if (direction === "horizontal" && col + word.length > gridSize) {
        return false;
    }
    if (direction === "vertical" && row + word.length > gridSize) {
        return false;
    }

    for (let i = 0; i < word.length; i++) {
        const r = direction === "horizontal" ? row : row + i;
        const c = direction === "horizontal" ? col + i : col;
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
            return false;
        }
    }
    return true;
}

function fillEmptyCells() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === "") {
                grid[r][c] = String.fromCharCode(Math.random() * 26 + 65);
            }
        }
    }
}

function displayGrid() {
    wordSearchDiv.innerHTML = "";
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            cellDiv.textContent = cell;
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            cellDiv.addEventListener("mousedown", () => {
                startSelection(cellDiv);
            });
            cellDiv.addEventListener("mouseenter", () => {
                if (isSelecting) {
                    selectCell(cellDiv);
                }
            });
            cellDiv.addEventListener("mouseup", endSelection);
            wordSearchDiv.appendChild(cellDiv);
        });
    });
}

function updateWordList() {
    const wordListDiv = document.getElementById("word-list");
    const wordListHtml = words.map(word => `<li>${word}</li>`).join("");

    wordListDiv.innerHTML = `
        <h2>Words to Find:</h2>
        <ul>
            ${wordListHtml}
        </ul>
    `;
}

function startSelection(cellDiv) {
    isSelecting = true;
    selectedCells = [{ row: cellDiv.dataset.row, col: cellDiv.dataset.col }];
    cellDiv.classList.add("selected");
}

function selectCell(cellDiv) {
    const row = parseInt(cellDiv.dataset.row, 10);
    const col = parseInt(cellDiv.dataset.col, 10);

    if (isAdjacent(row, col)) {
        selectedCells.push({ row: row, col: col });
        cellDiv.classList.add("selected");
    }
}

function isAdjacent(row, col) {
    if (selectedCells.length === 0) return true;

    const lastCell = selectedCells[selectedCells.length - 1];
    const rowDiff = Math.abs(lastCell.row - row);
    const colDiff = Math.abs(lastCell.col - col);

    return (rowDiff + colDiff === 1);
}

function endSelection() {
    isSelecting = false;
    checkForWord();
}

function checkForWord() {
    const selectedLetters = selectedCells.map(cell => grid[cell.row][cell.col]).join("");
    
    if (words.includes(selectedLetters)) {
        foundWords.push(selectedLetters);
        highlightFoundWord(selectedLetters);

        if (foundWords.length === 10) {
            alert("Congratulations! You've found all the words!");
        }
    } else {
        resetSelection();
    }
    selectedCells = [];
}

function highlightFoundWord(word) {
    selectedCells.forEach(cell => {
        const cellDiv = document.querySelector(
            `.cell[data-row='${cell.row}'][data-col='${cell.col}']`
        );
        if (cellDiv) {
            cellDiv.classList.add("found");
        }
    });
}

function resetSelection() {
    const cells = document.querySelectorAll(".cell.selected");
    cells.forEach(cell => {
        cell.classList.remove("selected");
    });
}
