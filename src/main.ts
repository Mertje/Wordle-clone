import { Words } from "./words";

endgame();
function endgame() {
    const infoID = document.getElementById("information") as HTMLDivElement;
    const startOver = document.createElement("div");
    const keyboard = document.getElementById("keyboard-count") as HTMLElement;

    keyboard.classList.add('hidden')
    startOver.className = "px-4 py-1 rounded bg-lime-600 text-white";
    startOver.innerText = "Start Game";
    infoID.appendChild(startOver);

    clearKeyboard();

    startOver.addEventListener("click", () => {
        infoID.removeChild(startOver);
        initGame();
        keyboard.classList.remove('hidden')
    });
}

function initGame() {
    const playBoard = document.getElementById("play-board") as HTMLDivElement;
    playBoard.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const row = (document.createElement("div"));
        row!.className = "box-rows flex";
        playBoard!.prepend(row);

        for (let i = 0; i < 5; i++) {
            const input = document.createElement("div");
            input!.className = "letter-boxes";
            row.prepend(input);
        }
    }
    listenInput();
}

function listenInput() {
    const keyboard = document.getElementById("keyboard-count") as HTMLElement;
    const trysAt = { attempt: 0, wait: 0 };
    const userWord: string[] = [];
    const guesThis = randomWord(Words);

    document.addEventListener("keyup", (event) => {
        const { key } = event;
        checkInput({ userWord, guesThis, key, trysAt });
    });

    keyboard.addEventListener("click", (event) => {
        const key = (event.target as Element).innerHTML;
        checkInput({ userWord, guesThis, key, trysAt });
    });
}

function checkInput({ userWord, guesThis, key, trysAt }: inputChecker) {
    if (trysAt.wait) return;
    let currentRow = document.getElementsByClassName("box-rows")[trysAt.attempt];

    pushArray({ userWord, key, currentRow });
    sliceArray({ userWord, key, currentRow });
    checkArray({ userWord, key, currentRow, guesThis, trysAt });

    if (trysAt.attempt > 5) {
        message(`You lost, The word was ${guesThis.join("")}`);
        return endgame();
    };

}

function checkArray({ userWord, key, currentRow, guesThis, trysAt }: arrayValidation) {
    if (key === "Enter" && userWord.length === 5) {
        if (Words.includes(userWord.join(""))) {
            trysAt.wait = 1;
            loopArray({ userWord, guesThis, currentRow, trysAt });
            if (userWord.join("") === guesThis.join("")) {
                trysAt.wait = 1;
                setTimeout(() => message('You have won the game'), 2200);
                return endgame();
            };
            trysAt.attempt++;
            userWord.length = 0;
        } else message("This word doesn't exist in our DB");
    }
}

function loopArray({ userWord, guesThis, currentRow, trysAt }: loopArray) {
    userWord.forEach((uword: string, index: number) => {
        setTimeout(() => {
            const color = guesThis[index] === uword ? "bg-green-500" : "bg-amber-500";
            const finalcolor = !guesThis.join("").includes(uword) ? "bg-gray-400" : color;
            giveColor(currentRow, index, uword, finalcolor)
            trysAt.wait = guesThis.length - 1 === index ? 0 : 1;
        }, index * 400);
    });
}

function giveColor(currentRow: Element, index: number, uword: string, color: string) {
    currentRow.children[index].classList.add(color, "text-white");
    keyboardColor(color, uword);
}

function message(message: string) {
    const infoID = document.getElementById("information") as HTMLDivElement;
    const notExist = document.createElement("div");
    notExist.className = "px-4 py-1 rounded bg-cyan-400 text-white";
    notExist.innerText = message;
    infoID.appendChild(notExist);
    setTimeout(() => infoID.removeChild(notExist), 2500);
}

function pushArray({ userWord, key, currentRow }: arrayNeeds) {
    const rules = userWord.length < 5 && key.match(/[a-z]/gi) && key.length < 2;
    if (rules) {
        userWord.push(key.toString());
        currentRow.children[userWord.length - 1].innerHTML = userWord[userWord.length - 1];
    }
}

function sliceArray({ userWord, key, currentRow }: arrayNeeds) {
    const rules = key === "Backspace" && userWord.length !== 0 || key === "Del" && userWord.length !== 0;
    if (rules) {
        currentRow.children[userWord.length - 1].innerHTML = "";
        userWord.splice(-1);
    }
}

function randomWord(wordArray: string[]): string[] {
    const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    return chosenWord.split("");
}


interface basis {
    userWord: string[];
    guesThis: string[];
    trysAt: { attempt: number; wait: number };
}

interface inputChecker extends basis {
    key: string;
};

interface loopArray extends basis {
    currentRow: Element;
}

interface arrayValidation extends basis, inputChecker, loopArray { };

interface arrayNeeds {
    userWord: string[];
    key: string;
    currentRow: Element;
};



// not happy with this code
function clearKeyboard() {
    const letterbuttons = document.getElementsByTagName("button");
    setTimeout(() => {
        for (let button of letterbuttons) {
            if (!button.className.includes("bg-gray-300")) {
                const colorButton = button.className.match(
                    /(bg-.*?00)/g
                ) as RegExpMatchArray;
                button.classList.replace(colorButton[0], "bg-gray-300");
            }
        }
    }, 2500);
}
// not happy with this code
function keyboardColor(color: string, pressedLetter: string) {
    const button = document.getElementsByClassName(pressedLetter);
    const colorButton = button[0].className.match(
        /(bg-.*?00)/g
    ) as RegExpMatchArray;
    if (colorButton[0] !== "bg-green-500")
        button[0].classList.replace(colorButton[0], color);
}
