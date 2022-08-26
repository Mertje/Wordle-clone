import { Words } from "./words";

endgame();
function endgame() {
    const infoID = document.getElementById("information") as HTMLDivElement;
    const startOver = document.createElement("div");
    startOver.className = "px-4 py-1 rounded bg-lime-600 text-white";
    startOver.innerText = "Start Game";
    infoID.appendChild(startOver);

    clearKeyboard();

    startOver.addEventListener("click", () => {
        infoID.removeChild(startOver);
        initGame();
    });
}

function initGame() {
    const playBoard = document.getElementById("play-board") as HTMLDivElement;
    playBoard.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row!.className = "box-rows flex";
        playBoard!.prepend(row);

        for (let i = 0; i < 5; i++) {
            const input = document.createElement("div");
            input!.className =
                "box uppercase font-bold text-4xl m-0.5 rounded border border-gray-500 h-12 w-12 flex justify-center items-center duration-500 delay-200";
            row.prepend(input);
        }
    }
    listenInput();
}

function listenInput() {
    const keyboard = <HTMLElement>document.getElementById("keyboard-count");
    const trysAt = { attempt: 0 };
    const userWord: string[] = [];
    const guesThis = randomWord(Words);
    console.log(guesThis)

    document.addEventListener("keyup", (event) => {
        const { key } = event;
        checkInput({ userWord, guesThis, key, trysAt });
        if (trysAt.attempt > 5) endgame()
    });

    keyboard.addEventListener("click", (event) => {
        const key = (event.target as Element).innerHTML
        checkInput({ userWord, guesThis, key, trysAt });

    })
}

function checkInput({ userWord, guesThis, key, trysAt }: inputChecker) {
    let currentRow = document.getElementsByClassName("box-rows")[trysAt.attempt];

    pushArray({ userWord, key, currentRow })
    sliceArray({ userWord, key, currentRow })

    if (key === "Enter" && userWord.length === 5) {
        if (Words.includes(userWord.join(""))) {
            userWord.forEach((uword: string, index: number) => {
                setTimeout(() => {
                    if (guesThis.join("").includes(uword)) {
                        if (guesThis[index] === uword) {
                            currentRow.children[index].classList.add(
                                "bg-green-500",
                                "text-white"
                            );
                            keyboardColor("bg-green-500", uword);
                        } else {
                            currentRow.children[index].classList.add(
                                "bg-amber-500",
                                "text-white"
                            );
                            keyboardColor("bg-amber-500", uword);
                        }
                    } else {
                        currentRow.children[index].classList.add(
                            "bg-gray-400",
                            "text-white"
                        );
                        keyboardColor("bg-gray-400", uword);
                    }
                }, index * 400);
            });
            if (userWord.join("") === guesThis.join("")) setTimeout(() => endgame(), 2000);
            trysAt.attempt++;
            userWord.length = 0;
        } else {
            const infoID = document.getElementById("information") as HTMLDivElement;
            const notExist = document.createElement("div");
            notExist.className = "px-4 py-1 rounded bg-cyan-400 text-white";
            notExist.innerText = "This word doesn't exist in our DB";
            infoID.appendChild(notExist);
            setTimeout(() => infoID.removeChild(notExist), 2500)
        }
    }
}

function pushArray({ userWord, key, currentRow }: arrayChecker) {
    const rules = userWord.length < 5 && key.match(/[a-z]/gi) && key.length < 2;
    if (rules) {
        userWord.push(key.toString());
        currentRow.children[userWord.length - 1].innerHTML = userWord[userWord.length - 1];
    };
};

function sliceArray({ userWord, key, currentRow }: arrayChecker) {
    const rules = key === "Backspace" && userWord.length !== 0 || key === "Del" && userWord.length !== 0;
    if (rules) {
        currentRow.children[userWord.length - 1].innerHTML = "";
        userWord.splice(-1);
    };
};

function randomWord(wordArray: string[]): string[] {
    const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    return chosenWord.split("");
};

type inputChecker = {
    userWord: string[];
    guesThis: string[];
    key: string;
    trysAt: { attempt: number };
};
type arrayChecker = {
    userWord: string[];
    key: string;
    currentRow: Element;
}

// not happy with this code
function clearKeyboard() {
    const letterbuttons = document.getElementsByTagName("button");
    setTimeout(() => {
        for (let button of letterbuttons) {
            if (!button.className.includes("bg-gray-300")) {
                const colorButton = button.className.match(/(bg-.*?00)/g) as RegExpMatchArray;
                button.classList.replace(colorButton[0], "bg-gray-300");
            }
        }
    }, 2500)
}
// not happy with this code
function keyboardColor(color: string, pressedLetter: string) {
    const button = document.getElementsByClassName(pressedLetter);
    const colorButton = button[0].className.match(/(bg-.*?00)/g) as RegExpMatchArray;
    if (colorButton[0] !== 'bg-green-500') button[0].classList.replace(colorButton[0], color);
};
