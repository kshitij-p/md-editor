const wrapSelectedWord = (wrapperLetter: string, word: string, wrapUsingOpposite: boolean) => {


    let newWord = '';


    if (wrapUsingOpposite) {
        if (wrapperLetter === '(') {

            newWord = wrapperLetter + word + String.fromCharCode(wrapperLetter.charCodeAt(0)+1);

        } else {
            newWord = wrapperLetter + word + String.fromCharCode(wrapperLetter.charCodeAt(0)+2);
        }
    }

    
    return newWord;
}

export default wrapSelectedWord;