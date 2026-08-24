document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("resultDiv");
    const forResult = document.getElementById("forResult");
    const whileResult = document.getElementById("whileResult");
    const doWhileResult = document.getElementById("doWhileResult");

    const maxNumber = 10;
    let i = 0;

    for (i = 0; i <= 10; i++) {
        if (i > 5) break;
        createNumberElement(i, forResult);
    }

    i = 0;
    while (i <= maxNumber) {
        if (i > 5) break;
        createNumberElement(i, whileResult);
        i++;
    }

    i = 0;
    do {
        if (i > 5) break;
        createNumberElement(i, doWhileResult);
        i++
    } while (i <= maxNumber);
});

function createNumberElement(number, div) {
    const result = document.createElement("h3");
        result.className = "result-text";
        result.textContent = `Numero: ${number}`

    div.appendChild(result);
}
