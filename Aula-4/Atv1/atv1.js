const maximoFaltas = 5;
const minMedia = 7;

document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submitBtn");
    const resultText = document.getElementById("resultText");
    const scoreText = document.getElementById("scoreText");
    const absencesText = document.getElementById("absencesText");

    submitBtn.addEventListener("click", function () {
        const scoreInputs = document.querySelectorAll("#score1, #score2, #score3,  #score4");
        const absencesAmount = Number(document.getElementById("absencesInput").value);
        let scoreSum = 0;
        let finalScore;

        scoreInputs.forEach((element) => {
            scoreSum += Number(element.value);
            console.log(scoreSum)
        });

        finalScore = scoreSum / 4;

        scoreText.textContent = `Nota final: ${finalScore} (Minimo para aprovação: ${minMedia})`;
        absencesText.textContent = `Faltas: ${absencesAmount} (Maximo de faltas: ${maximoFaltas})`


        if (finalScore < minMedia || absencesAmount > maximoFaltas) {
            resultText.textContent = "Reprovado.";
            return;
        }

        resultText.textContent = "Aprovado."
    });
});