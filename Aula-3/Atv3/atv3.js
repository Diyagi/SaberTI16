document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function () {
        const score = document.getElementById("scoreInput").value
        const resultText = document.getElementById("resultText")

        if (score < 5) {
            resultText.textContent = "Aluno Reprovado.";
        } else if (score < 7) {
            resultText.textContent = "Aluno em Recuperação.";
        } else {
            resultText.textContent = "Aluno aprovado.";
        }
    });
});
