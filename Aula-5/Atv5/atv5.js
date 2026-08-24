document.addEventListener("DOMContentLoaded", () => {
    const whileResult = document.getElementById("whileResult");

    let i = 0;
    let evenNumbers = 0;

    while (evenNumbers < 3) {
        if (i % 2 === 0) {
            createNumberElement(i, whileResult);
            evenNumbers++;
        }
        i++;
    }
});

function createNumberElement(number, div) {
    const result = document.createElement("h3");
        result.className = "result-text";
        result.textContent = `Numero: ${number}`

    div.appendChild(result);
}
