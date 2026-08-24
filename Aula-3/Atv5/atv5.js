document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function () {
        const numA = document.getElementById("numInputA").value;
        const numB = document.getElementById("numInputB").value;
        const resultText = document.getElementById("resultText");

        if (numA > numB) {
            resultText.textContent = `Numero A é maior (${numA} > ${numB}).`;
        } else if (numB > numA) {
            resultText.textContent = `Numero B é maior (${numB} > ${numA}).`
        } else {
            resultText.textContent = `Numeros sâo iguais (${numA} = ${numB}).`
        }
    });
});