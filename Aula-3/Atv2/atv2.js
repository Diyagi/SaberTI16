document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function () {
        const age = document.getElementById("ageInput").value
        const resultText = document.getElementById("resultText")

        if (age < 13) {
            resultText.textContent = "Criança.";
        } else if (age < 18) {
            resultText.textContent = "Adolescente.";
        } else if (age < 60) {
            resultText.textContent = "Adulto.";
        } else {
            resultText.textContent = "Idoso.";
        }
    });
});
