import { Words } from './words'

endgame()
function endgame() {
    const infoID = document.getElementById('information') as HTMLDivElement;
    const startOver = document.createElement("div");
    startOver.className = 'px-4 py-1 rounded bg-lime-600 text-white';
    startOver.innerText = 'Start Game';
    infoID.appendChild(startOver);

    startOver.addEventListener('click', () => {
        infoID.removeChild(startOver)
        initGame()
    })
}

function initGame() {
    const playBoard = document.getElementById('play-board') as HTMLDivElement
    playBoard.innerHTML = ''

    // creating the play board
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row!.className = 'box-rows flex';
        playBoard!.prepend(row);

        for (let i = 0; i < 5; i++) {
            const input = document.createElement("div");
            input!.className = 'box uppercase font-bold text-4xl m-0.5 rounded border border-gray-500 h-12 w-12 flex justify-center items-center duration-500 delay-200';
            row.prepend(input)
        }
    }
    listenInput()
}

function listenInput() {
    const trysAt = { 'attempt': 0 }
    const userWord: string[] = [];
    const guesThis = randomWord(Words);

    document.addEventListener('keyup', (event) => {
        checkInput({ userWord, guesThis, event, trysAt })
        if (trysAt.attempt > 5) return endgame()
    })
}

type checker = {
    userWord: string[],
    guesThis: string[],
    event: KeyboardEvent,
    trysAt: { "attempt": number },
}

function checkInput({ userWord, guesThis, event, trysAt }: checker) {
    let currentRow = document.getElementsByClassName('box-rows')[trysAt.attempt];

    if (userWord.length < 5 && event.key.match(/[a-z]/gi) && event.key.length < 2) {
        userWord.push(event.key.toString())
        currentRow.children[userWord.length - 1].innerHTML = userWord[userWord.length - 1]
        console.log(userWord)
    }
    if (event.key === 'Backspace' && userWord.length !== 0) {
        currentRow.children[userWord.length - 1].innerHTML = ''
        userWord.splice(-1)
    }
    if (event.key === 'Enter' && userWord.length === 5) {
        if (Words.includes(userWord.join(''))) {
            userWord.forEach((uword: string, index: number) => {
                setTimeout(() => {
                    if (guesThis.join('').includes(uword)) {
                        if (guesThis[index] === uword) {
                            currentRow.children[index].classList.add('bg-green-500', 'text-white')
                        } else {
                            currentRow.children[index].classList.add('bg-amber-500', 'text-white')
                        }
                    } else {
                        currentRow.children[index].classList.add('bg-gray-400', 'text-white')
                    }
                }, index * 400);
            })
            if (userWord.join('') === guesThis.join('')) return endgame()
            trysAt.attempt++
            userWord.length = 0
        } else {
            const infoID = document.getElementById('information') as HTMLDivElement;
            const notExist = document.createElement("div");
            notExist.className = 'px-4 py-1 rounded bg-cyan-400 text-white';
            notExist.innerText = 'you fucked up';
            infoID.appendChild(notExist);

            setTimeout(() => {
                infoID.removeChild(notExist)
            }, 2500);
        }
    }
}

function randomWord(wordArray: string[]): string[] {
    const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    return chosenWord.split('')
}