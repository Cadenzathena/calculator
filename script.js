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



function inputListener() {
    calcDisplayField.addEventListener("keydown", (e) => {
        if (e.target.value === '0' &&
            e.key.split('').some(item => allValidInputs.includes(item))) {

            e.target.value = e.target.value.replace('0', '');

        }



        if (!omegaArr.length) {
            omegaArr.push([]);
        }



        digitLogger();
        operatorLogger();



        function digitLogger() {
            if (e.key.split('').some(item => validDigits.includes(item))) {
                if (omegaArr[omegaArr.length - 1].some(item => validOperators.includes(item))) {

                    omegaArr.push([]);

                }
                omegaArr[omegaArr.length - 1].push(e.key);
                console.log(omegaArr);
            }
        }



        function operatorLogger() {
            if (e.key.split('').some(item => validOperators.includes(item))) {
                if (omegaArr[omegaArr.length - 1].some(item => validDigits.includes(item))) {

                    omegaArr.push([]);

                }
                omegaArr[omegaArr.length - 1].push(e.key);
                console.log(omegaArr);
            }
        }



    })
}



inputListener();
inputSanitizer();