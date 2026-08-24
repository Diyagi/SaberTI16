document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function () {
        const age = document.getElementById("ageInput").value;
        const resultText = document.getElementById("resultText");

        if (age < 18) {
            resultText.textContent = "Menor de idade.";
        } else {
            resultText.textContent = "Maior de idade."
        }
    });
});
