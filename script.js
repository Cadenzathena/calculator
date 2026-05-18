const omegaArr = [];
const calcDisplayField = document.querySelector("#calc-display-field");
const allValidInputs = '0123456789+-/*';
const validDigits = '0123456789';
const validOperators = '-+*/';



// Ensures the input field doesn't accept values that aren't numbers or operators.
// Replaces * with × for aesthetics.
function inputSanitizer() {
    calcDisplayField.addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^0-9+\-*×/]/g, '');
        e.target.value = e.target.value.replace('*', '×');
    })
}



// handles various actions when an input is made with the input field in focus.
function inputListener() {
    calcDisplayField.addEventListener("keydown", (e) => {
        if (e.target.value === '0' && e.key.split('').some(item => validDigits.includes(item))) {
            e.target.value = e.target.value.replace('0', '');
        }

        // create a new array in omegaArr if it is empty!
        if (!omegaArr.length) {
            omegaArr.push([]);
        }


        
        // Checks if the key pressed is a number and pushes the value to the last array in
        // omegaArr. Also check if the most recent array in omegaArr contains an
        // operator. True? generate a new array for only numbers.
        (function digitLogger() {
            if (e.key.split('').some(item => validDigits.includes(item))) {
                if (omegaArr[omegaArr.length - 1].some(item => validOperators.includes(item))) {
                    omegaArr.push([]);
                }

                omegaArr[omegaArr.length - 1].push(e.key);
                console.log(omegaArr);
            }
        })();



        // Checks if the key pressed is an operator and pushes the value to the last array in
        // omegaArr for a fresh array.
        (function operatorLogger() {
            if (e.key.split('').some(item => validOperators.includes(item))) {

                if (e.target.value === '0' && !omegaArr[omegaArr.length - 1].length) {  // if the user inputs an operator while only 0 is in the input field,
                omegaArr[omegaArr.length - 1].push('0');                                // add zero to an array quickly before adding the operator to its own array.
                }

                if (omegaArr[omegaArr.length - 1].some(item => validDigits.includes(item))) {
                    omegaArr.push([]);
                }

                // the below code handles standard calculator operator behaviour if an operator is the current input.
                if (omegaArr[omegaArr.length - 1].length == 2 && omegaArr[omegaArr.length - 1].some(item => validOperators.includes(item))) {
                    omegaArr[omegaArr.length - 1].splice(0, omegaArr[omegaArr.length - 1].length);
                    omegaArr[omegaArr.length - 1].push(e.key);
                    console.log(omegaArr);
                    return;
                
                } else if (omegaArr[omegaArr.length - 1].includes('+') || omegaArr[omegaArr.length - 1].includes('-')) {
                
                    omegaArr[omegaArr.length - 1].pop();
                    omegaArr[omegaArr.length - 1].push(e.key);
                    console.log(omegaArr);
                    return;

                } else if (e.key === '-' && (omegaArr[omegaArr.length - 1].includes('*') || omegaArr[omegaArr.length - 1].includes('/'))) {

                    omegaArr[omegaArr.length - 1].push(e.key);
                    console.log(omegaArr);
                    return;

                } else if (e.key !== '-' && (omegaArr[omegaArr.length - 1].includes('*') || omegaArr[omegaArr.length - 1].includes('/'))) {

                    omegaArr[omegaArr.length - 1].pop();
                    omegaArr[omegaArr.length - 1].push(e.key);
                    console.log(omegaArr);
                    return;
                }
                
                omegaArr[omegaArr.length - 1].push(e.key);
                console.log(omegaArr);
            }
        })();


        // Deletes array items. Also helps clean up arrays in
        // omegaArr if they're empty after deletion
        (function backspaceHelper() {
            if (e.key === 'Backspace') {
                omegaArr[omegaArr.length - 1].pop();

                if (!omegaArr[omegaArr.length - 1].length) {
                    omegaArr.pop();
                }
                console.log(omegaArr);
            }
        })();
    })
}



inputListener();
inputSanitizer();