const calcDisplayField = document.querySelector("#calc-display-field");
const omegaArr = [];
let currentArr = [];
const validNumbers = '0123456789';
const validOperators = '-+*/';
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

// we are going to be checking for numbers and operators for
// a bit. functions help reduce wordy syntax.
function containsNumbers(item) {
    if (typeof item === 'string') {
        return item.split('').some(item => validNumbers.includes(item));
    }
    else if (Array.isArray(item)) {
        return item.some(item => validNumbers.includes(item));
    }
}

function containsOperators(item) {
    if (typeof item === 'string') {
        return item.split('').some(item => validOperators.includes(item));
    }
    else if (Array.isArray(item)) {
        return item.some(item => validOperators.includes(item));
    }
}





function inputSanitizer() {

    calcDisplayField.addEventListener("input", e => {
        // Ensures the input field doesn't accept values that aren't
        // numbers or operators. Replaces * with × for aesthetics.
        e.target.value = e.target.value.replace(/[^0-9+\-*×/]/g, ''); 
        e.target.value = e.target.value.replace('*', '×');            
    })

    calcDisplayField.addEventListener("keydown", e => {
        if (e.target.value === '0' && containsNumbers(e.key)) {

            e.target.value = e.target.value.replace('0', ''); // get rid of initial 0 if a number is pressed
        }

        // Handles operator behaviour in the input field. Things like preventing
        // multiple operators except for *- and /-
        if (containsOperators(e.key)) {
            if (calcDisplayField.value.endsWith('×-') ||
                calcDisplayField.value.endsWith('/-')) {

                calcDisplayField.value = calcDisplayField.value.slice(0, -2);
                console.log('gotcha');
            }
            else if (calcDisplayField.value.endsWith('+') ||
                     calcDisplayField.value.endsWith('-')) {

                calcDisplayField.value = calcDisplayField.value.slice(0, -1);
                console.log('gotcha');
            }
            else if (e.key !== '-' &&
                    (calcDisplayField.value.endsWith('×') ||
                     calcDisplayField.value.endsWith('/'))) {
                
                calcDisplayField.value = calcDisplayField.value.slice(0, -1);
                console.log('gotcha');
            }
        }

        // if the user trys to input a value when the cursor isn't at the end,
        // send their cursor to the end and halt. Not trying to deal with custom array insertion
        // shenanigans
        if (calcDisplayField.selectionStart === calcDisplayField.value.length &&
            e.key.split().some(item => arrowKeys.includes(item))) {
            
            e.preventDefault();
            console.log('Arrow catch!');
            return;
        }
        else if (calcDisplayField.selectionStart < calcDisplayField.value.length) {
            e.preventDefault();
            calcDisplayField.setSelectionRange(calcDisplayField.value.length, calcDisplayField.value.length);
            console.log('YAHTZEE');
            return;
        }

    })
}





// handles various actions when an input is made with the input field in focus.
function inputListener() {

    calcDisplayField.addEventListener("keydown", (e) => {
        // create a new array in omegaArr if it is empty!
        if (!omegaArr.length) {
            omegaArr.push(currentArr);
        }

        // Checks if the key pressed is a number and pushes the value to the last array in
        // omegaArr. Also check if the most recent array in omegaArr contains an
        // operator. True? generate a new array for only numbers.
        (function digitLogger() {
            if (containsNumbers(e.key)) {
                if (containsOperators(currentArr)) {
                    omegaArr.push([]);
                    currentArr = omegaArr[omegaArr.length - 1];
                }

                currentArr.push(e.key);
                console.log(omegaArr);
            }
        })();

        // Checks if the key pressed is an operator and pushes the value to the last array in
        // omegaArr for a fresh array.
        (function operatorLogger() {
            if (containsOperators(e.key)) {
                if (e.target.value === '0' && !currentArr.length) {  // if the user inputs an operator while only 0 is in the input field,
                currentArr.push('0');                                // add zero to an array quickly before adding the operator to its own array.
                }

                if (containsNumbers(currentArr)) {
                    omegaArr.push([]);
                    currentArr = omegaArr[omegaArr.length - 1];
                }

                // the below if block handles standard calculator operator behaviour if an operator is the current input.
                if (currentArr.length === 2 &&
                    containsOperators(currentArr)) {

                    currentArr.splice(0, currentArr.length);
                    currentArr.push(e.key);
                    console.log(omegaArr);
                    return;
                }
                else if (currentArr.includes('+') ||
                         currentArr.includes('-')) {
                
                    currentArr.pop();
                    currentArr.push(e.key);
                    console.log(omegaArr);
                    return;
                }
                else if (e.key === '-' &&
                        (currentArr.includes('*') || currentArr.includes('/'))) {

                    currentArr.push(e.key);
                    console.log(omegaArr);
                    return;
                }
                else if (e.key !== '-' && 
                        (currentArr.includes('*') || currentArr.includes('/'))) {

                    currentArr.pop();
                    currentArr.push(e.key);
                    console.log(omegaArr);
                    return;
                }
                
                currentArr.push(e.key); // This only runs when a fresh, empty array is current
                console.log(omegaArr);
            }
        })();

        // Deletes array items. Also helps clean up arrays in
        // omegaArr if they're empty after deletion
        (function backspaceHelper() {
            if (e.key === 'Backspace' && e.ctrlKey) {
                e.preventDefault();
                return;
            }
            else if (e.key === 'Backspace') {
                currentArr.pop();

                if (!currentArr.length) {
                    omegaArr.pop();
                }
                console.log(omegaArr);
            }
        })();
    })
}



inputListener();
inputSanitizer();