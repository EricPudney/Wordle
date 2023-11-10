// variables relating to player statistics
let gamesPlayed = 0;
let gamesWon = 0;
let winPercentage = 0;
let winStreak = 0;

// creates variables for gameplay and runs initial setup functions
const boxes = document.getElementById("box-space");
const statistics = document.getElementById("stats");
let wordList = [];
let answer = "";
createBoxes(6);
createWordlist();
let currentLetter = 1;
let currentAttempt = 1;
const attempt = [];
const lettersFound = [];
document.getElementById("l1let1").focus();
document.addEventListener("input", checkLetter);
document.addEventListener("keydown", otherKeys);
document.addEventListener("click", clickIgnorer);

// imports 5-letter words from wordlist, chooses a random word to guess
function createWordlist() {
    fetch('./words_dictionary.json')
        .then((response) => response.json())
        .then((json) => {
            let wds = Object.keys(json);
            for (let wrd of wds) {
                if (wrd.length === 5) {
                    wordList.push(wrd.toUpperCase());
                }
            }
        })
        .then(() => {
            let randomWordNo = Math.floor(Math.random() * wordList.length);
            answer = wordList[randomWordNo];
        })
}

// ensures that players cannot click into the wrong input box
function clickIgnorer() {
    document.getElementById("l" + currentAttempt + "let" + currentLetter).focus();
}

// deals with letters typed in by player
function checkLetter(event) {
    if (currentLetter < 6) {
        let key = event.data;
        let display = key.toUpperCase();
        document.getElementById("l" + currentAttempt + "let" + currentLetter).value = display;
        attempt.push(display);
        currentLetter++;
    }
    if (currentLetter !== 6) { document.getElementById("l" + currentAttempt + "let" + currentLetter).focus(); }
}

// deals with backspace, tab and enter
function otherKeys(event) {
    if (event.key === "Backspace") {
        const lastLetter = document.getElementById("l" + currentAttempt + "let" + (currentLetter - 1));
        lastLetter.value = "";
        attempt.pop();
        lastLetter.focus();
        currentLetter--;
        return;
    }
    if (event.key === "Tab") {
        event.preventDefault();
        return;
    }
    if (currentLetter === 6 && event.key === "Enter") {
        checkWord();
    }
}

// clears previous guesses at end of turn and game
function clearGuesses() {
    while (attempt.length > 0) {
        attempt.pop();
    }
    while (lettersFound.length > 0) {
        lettersFound.pop();
    }
}


// creates boxes for each letter and assigns ids
function createBoxes(rows) {
    for (i = 1; i <= rows; i++) {
        let newLine = document.createElement("div");
        newLine.classList.add("row");
        for (j = 1; j < 6; j++) {
            let newBox = document.createElement("input");
            newBox.minLength = "1";
            newBox.maxLength = "1";
            newBox.id = "l" + i + "let" + j;
            newLine.append(newBox);
        }
        boxes.append(newLine);
    }
}

// highlights correct guesses, tests for win condition
function checkWord() {
    const tryWord = (attempt[0] + attempt[1] + attempt[2] + attempt[3] + attempt[4]);
    if (wordList.includes(tryWord)) {
        updateKeyboard();
        for (i = 0; i < answer.length; i++) {
            if (attempt[i] === answer.charAt(i)) {
                document.getElementById("l" + currentAttempt + "let" + (i + 1)).style.backgroundColor = "green";
                lettersFound.push(attempt[i]);
            }
        }
        for (i = 0; i < answer.length; i++) {
            if (attempt[i] !== answer.charAt(i) && answer.includes(attempt[i]) && !lettersFound.includes(attempt[i])) {
                document.getElementById("l" + currentAttempt + "let" + (i + 1)).style.backgroundColor = "yellow";
            }
            else if (!answer.includes(attempt[i])) {
                document.getElementById("l" + currentAttempt + "let" + (i + 1)).style.backgroundColor = "grey";
            }
            else if (attempt[i] !== answer.charAt(i) && answer.includes(attempt[i]) && lettersFound.includes(attempt[i])) {
                let noInAnswer = 0;
                for (j=0; j<5; j++) {
                    if (attempt[i] === answer.charAt(j))
                    noInAnswer++;
                }
                let noFound = 0;
                for (k=0; k<5; k++) {
                    if (attempt[i] === lettersFound[k])
                    noFound++;
                }
                if (noInAnswer > noFound)  {
                    document.getElementById("l" + currentAttempt + "let" + (i + 1)).style.backgroundColor = "yellow";
                }
                else {
                    document.getElementById("l" + currentAttempt + "let" + (i + 1)).style.backgroundColor = "grey";
                    console.log("got a grey");
                }
            }
        }

        if (attempt.toString().replaceAll(",", "") === answer) {
            victory();
        }
        else if (currentAttempt === 6) {
            defeat();
        }

        else {
            clearGuesses();
            currentAttempt++;
            currentLetter = 1;
            document.getElementById("l" + currentAttempt + "let1").focus();
        }
    }
    else { alert("Sorry, that word is not in our dictionary"); }
}

// updates keyboard to right of box area
function updateKeyboard() {
    for (let digit of attempt) {
        let letters = document.getElementById("alphabet");
        let alphabet = letters.getElementsByTagName("button");
        for (i=0; i<alphabet.length; i++) {
            if (digit === alphabet[i].innerText) {
                alphabet[i].style.backgroundColor = "grey";
            }
        }
    }
}


// runs in event of a win
function victory() {
    alert("Congratulations! You won.");
    gamesPlayed++;
    gamesWon++;
    winStreak++;
    updateStats();
}

// runs in event of a loss
function defeat() {
    alert("You lost. The correct word was " + answer);
    gamesPlayed++;
    winStreak = 0;
    updateStats();
}

// adds stats to left of screen
function updateStats() {
    winPercentage = Math.round(((gamesWon / gamesPlayed) * 100));
    statistics.innerHTML = "Statistics";
    const played = document.createElement("p");
    played.innerText = "Games played: " + gamesPlayed;
    const won = document.createElement("p");
    won.innerText = "Games won: " + gamesWon;
    const percent = document.createElement("p");
    percent.innerText = "Games won (%): " + winPercentage;
    const streak = document.createElement("p");
    streak.innerText = "Current win streak: " + winStreak;
    statistics.append(played, won, percent, streak);
    resetGame();
}

// resets variables and shows button to start a new game
function resetGame() {
    let letters = document.getElementById("alphabet");
    let alphabet = letters.getElementsByTagName("button");
    for (i=0; i<alphabet.length; i++) {
        alphabet[i].style.backgroundColor = "azure";
        }
    document.removeEventListener("input", checkLetter);
    document.removeEventListener("keydown", otherKeys);
    document.removeEventListener("click", clickIgnorer);
    let btn = document.getElementById("restart")
    btn.addEventListener("click", newGame);
    btn.style.display = "block";
    boxes.style.opacity = "20%";
}

// starts a new game
function newGame() {
    document.getElementById("restart").style.display = "none";
    boxes.style.opacity = "100%";
    boxes.innerHTML = "";
    createBoxes(6);
    document.getElementById("l1let1").focus();
    document.addEventListener("input", checkLetter);
    document.addEventListener("keydown", otherKeys);
    document.addEventListener("click", clickIgnorer);
    clearGuesses();
    currentLetter = 1;
    currentAttempt = 1;
    let randomWordNo = Math.floor(Math.random() * wordList.length);
    answer = wordList[randomWordNo];
}