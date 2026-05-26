const calcDisplayField = document.querySelector("#calc-display-field");
const calcDisplayContainer = document.querySelector("#calc-display-container");
const omegaArr = [];
let evalOmegaArr = [];
let currentArr = [];
const evalNumberArr = [];
const evalOperatorArr = [];
const validNumbers = '0123456789';
const validOperators = '-+*/';
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let currentResult = 0;
let initialOprLength = 0;

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

        if ((e.key === 'v' || e.key === 'v') && e.ctrlKey) {
            e.preventDefault();
            return;
        }

    })
}





// handles various actions when an input is made with the input field in focus.
function inputListener() {

    calcDisplayField.addEventListener("keydown", (e) => {
        // create a new array in omegaArr if it is empty!
        if (!omegaArr.length) {
            omegaArr.push([]);
            currentArr = omegaArr[omegaArr.length - 1];
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
                console.table(omegaArr);
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

                // the below if blocks handle standard calculator operator
                // behaviour if an operator is the current input.
                if (currentArr.length === 2 &&
                    containsOperators(currentArr)) {

                    currentArr.splice(0, currentArr.length);
                    currentArr.push(e.key);
                    console.table(omegaArr);
                    return;
                }
                else if (currentArr.includes('+') ||
                         currentArr.includes('-')) {
                
                    currentArr.pop();
                    currentArr.push(e.key);
                    console.table(omegaArr);
                    return;
                }
                else if (e.key === '-' &&
                        (currentArr.includes('*') || currentArr.includes('/'))) {

                    currentArr.push(e.key);
                    console.table(omegaArr);
                    return;
                }
                else if (e.key !== '-' && 
                        (currentArr.includes('*') || currentArr.includes('/'))) {

                    currentArr.pop();
                    currentArr.push(e.key);
                    console.table(omegaArr);
                    return;
                }
                
                currentArr.push(e.key); // This only runs when a fresh, empty array is current
                console.table(omegaArr);
            }
        })();

        // Deletes array items. Also helps clean up arrays in
        // omegaArr if they're empty after deletion
        (function backspaceHelper() {
            if (e.key === 'Backspace' && e.ctrlKey) {
                e.preventDefault();
                return;
            }
            if (e.key === 'Backspace' &&
                calcDisplayField.selectionStart < calcDisplayField.value.length) {

                e.preventDefault(); // prevents deletion when those pesky users select field values
                return;
            }
            if (e.key === 'Backspace') {
                currentArr.pop();

                if (!currentArr.length) {
                    omegaArr.pop();
                    currentArr = omegaArr[omegaArr.length - 1];
                }
                console.table(omegaArr);
            }
        })();

    })
}





function solveExpression() {
    calcDisplayContainer.addEventListener("submit", e => {
        e.preventDefault();

        evalNumberArr.splice(0, evalNumberArr.length); // Initializing the arrays needed for the expression evaluation
        evalOperatorArr.splice(0, evalOperatorArr.length);
        evalOmegaArr = structuredClone(omegaArr); // deep clone to ensure omegaArr remains intact for a backspace input.
        
        negativeNumFixer(evalOmegaArr);

        // preparing the number array and operator array
        evalOmegaArr.forEach(item => {
            if (containsNumbers(item)) {
                evalNumberArr.push(parseFloat(item.join('')));
            }
        });
        evalOmegaArr.forEach(item => {
            if (containsOperators(item) && !containsNumbers(item)) {
                evalOperatorArr.push(item.join(''));
            }
            initialOprLength = evalOperatorArr.length;
        });

    
        // The general idea is to use a giant for loop to work on every operator
        // in evalOperatorArr. We are using the position of evalNumberArr & evalOperatorArr
        // items to do our evaluation, 
        for (let i = 0; i < initialOprLength; i++) {

            // this loop handles our operator BODMAS precedence. it starts with bodmasOpr as /,
            // checking if our operators includes the "bodmasOpr" that must be solved for first.
            for (const bodmasOpr of ['/', '*']) {
                if (!evalOperatorArr.includes(bodmasOpr)) {
                    continue;
                }

                // couldn't use forEach or map because you can't early exit them with break statements.
                let index = 0;
                for (const item of evalOperatorArr) {
                    if (item === bodmasOpr) {
                        let numValueA = evalNumberArr[index];
                        let numValueB = evalNumberArr[index + 1];

                        switch (item) {
                            case '/': currentResult = numValueA / numValueB; break;
                            case '*': currentResult = numValueA * numValueB; break;
                            case '+': currentResult = numValueA + numValueB; break;
                            case '-': currentResult = numValueA - numValueB; break;
                        }
                        evalNumberArr.splice(index, 2, currentResult);
                        evalOperatorArr.splice(index, 1);

                        console.log(currentResult);
                        console.log(evalNumberArr, evalOperatorArr);
                        index++;
                        break; // "Do not iterate when process is done. Leave this loop"
                    } else {
                        index++;
                        continue; // Keep checking the evalOperator array for a match with bodmasOpr
                    }
                }
                // This peculiar break statement stops our precedence checker loop from iterating to
                // its next bodmasOpr item. Why? Because only one of every operator would then get solved.
                // After the break, our giant for loop will effectively "restart" its inner code.
                break; 
            }
        }
        
        negativeNumFixer(evalNumberArr);
        currentResult = evalNumberArr.reduce((prev, current) => prev + current, 0);
        console.log(evalOmegaArr, evalNumberArr, evalOperatorArr);
        console.log(currentResult);
    })
}





function negativeNumFixer(thing) {
    // Preparing for parseInt by moving all the '-' in ['/', '-'] or ['*', '-'] to the 
    // front of the next number only array.
    if (thing === evalOmegaArr) {
        for (let i = 1; i < 3; i++) {
            evalOmegaArr = evalOmegaArr.map((item, index, array) => {
                if (i === 1 &&
                    containsNumbers(item) &&
                    containsOperators(array[index - 1]) &&
                    array[index - 1].length > 1) {

                    item.unshift('-');
                }

                if (i === 2 &&
                    containsOperators(item) &&
                    !containsNumbers(item) &&
                    item.length > 1) {

                    item.splice(item.indexOf('-'), 1);
                }
                return item;
            })
        }
    }
    // sets numbers to the right of minus signs to be negative numbers
    else if (thing === evalNumberArr) {
        evalOperatorArr.forEach((item, index) => {
            if (item === '-') {
                evalNumberArr.splice(index + 1, 0, evalNumberArr[index + 1] * -1);
                evalNumberArr.splice(index + 2, 1);
            }
        })
    }
}




inputListener();
inputSanitizer();
solveExpression();