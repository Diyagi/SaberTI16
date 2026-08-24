document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("resultDiv");
    const forResult = document.getElementById("forResult");
    const whileResult = document.getElementById("whileResult");
    const doWhileResult = document.getElementById("doWhileResult");

    const maxNumber = 10;
    let i = 0;

    for (i = 0; i <= 10; i++) {
        createElementIfEven(i, forResult);
    }

    i = 0;
    while (i <= maxNumber) {
        createElementIfEven(i, whileResult);
        i++;
    }

    i = 0;
    do {
        createElementIfEven(i, doWhileResult)
        i++
    } while (i <= maxNumber);
});

function createElementIfEven(number, div) {
    if (number % 2 !== 0) {
        const result = document.createElement("h3");
        result.className = "result-text";
        result.textContent = `Numero: ${number}`

        div.appendChild(result);
    }
}
