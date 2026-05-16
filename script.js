const omegaArr = [];
const calcDisplayField = document.querySelector("#calc-display-field");
const allValidInputs = '0123456789+-/*';
const validDigits = '0123456789';
const validOperators = '-+*/';



function inputSanitizer() {

    calcDisplayField.addEventListener("input", e => {

        e.target.value = e.target.value.replace(/[^0-9+\-*×/]/g, '');
        e.target.value = e.target.value.replace('*', '×');

    })

}



async function numberListener() {

    calcDisplayField.addEventListener("keydown", (e) => {

        if (e.target.value === '0' &&
            e.key.split('').some(item => allValidInputs.includes(item))) {

            e.target.value = e.target.value.replace('0', '');

        }

        if (!omegaArr.length) {

            omegaArr.push([]);

        }

        if (e.key.split('').some(item => validDigits.includes(item))) {
            if (omegaArr.length > 1) {
                if (omegaArr[omegaArr.length - 2].some(item => validOperators.includes(item))) {

                    omegaArr.push([]);

                }
            }

            omegaArr[omegaArr.length - 1].push(e.key);
            console.log(omegaArr);
            
        }

    })

}



numberListener();
inputSanitizer();