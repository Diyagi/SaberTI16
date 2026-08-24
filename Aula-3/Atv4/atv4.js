document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function () {
        const num = document.getElementById("numInput").value
        const resultText = document.getElementById("resultText")

        if (num % 2 === 0) {
            resultText.textContent = "Numero Par.";
        } else {
            resultText.textContent = "Numero Impar";
        }
    });
});
