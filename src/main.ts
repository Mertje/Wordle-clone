import { Words } from './words'

initGame()

export function initGame() {
    const playBoard = document.getElementById('play-board') as HTMLDivElement

    let attempt = 0;
    const userWord: string[] = [];
    const guesThisWord = randomWord(Words);
    console.log(guesThisWord);

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row!.className = 'box-rows flex';
        playBoard!.appendChild(row);

        for (let i = 0; i < 5; i++) {
            const input = document.createElement("div");
            input!.className = 'box uppercase font-bold text-4xl m-0.5 rounded border border-gray-500 h-12 w-12 flex justify-items-center items-center';
            row.appendChild(input)
        }
    }

    listenInput(userWord, Words, guesThisWord, attempt)
  
}

function listenInput(userWord: string[], words: string[], guesThis: string[], attempt: number) {
    document.addEventListener('keyup', (event) => {
        let currentRow = document.getElementsByClassName('box-rows')[attempt];

        console.log(attempt, currentRow)
        if (userWord.length < 5 && event.key.match(/[a-z]/gi) && event.key !== 'Backspace') {
            userWord.push(event.key.toString())
            currentRow.children[userWord.length -1].innerHTML = userWord[userWord.length -1]
        }
        if (event.key === 'Backspace') {
            currentRow.children[userWord.length -1].innerHTML = ''
            userWord.splice(-1)
        }

        if (event.key === 'Enter' && userWord.length === 5) {
            if (words.includes(userWord.join(''))) {
                userWord.forEach((uword: string, index: number) => {
                    if (guesThis.join('').includes(uword)) {
                        if (guesThis[index] === uword) {
                            currentRow.children[index].classList.add('bg-green-700')
                        } else {
                            currentRow.children[index].classList.add('bg-orange-700')
                        }
                    } else {
                        currentRow.children[index].classList.add('bg-gray-700')                 
                    }

                })
                attempt++ 
                userWord = []
            } else {
                console.log('this word doesnt exist in our DB')
            }

        }
        if(attempt > 5) return console.log('its over')
    })
}


function randomWord(wordArray: string[]): string[] {
    const chosenWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    return chosenWord.split('')
}