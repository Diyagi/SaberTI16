const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

document.addEventListener("DOMContentLoaded", () => {
    const indexNumberInput = document.getElementById("indexNumber");
    const minNumberInput = document.getElementById("minNumber");
    const submitBtn = document.getElementById("submitBtn");
    const resultText = document.getElementById("resultText");

    submitBtn.addEventListener("click", async () => {
        const indexNumberValue = Number(indexNumberInput.value);
        const minNumberValue = Number(minNumberInput.value);

        if (minNumberValue > indexNumberValue) {
            resultText.textContent = "Erro, segundo numero deve ser menor que o primeiro!"
            return;
        }

        for(let i = indexNumberValue; i >= minNumberValue; i--) {
            resultText.textContent = `Contando ate ${minNumberValue}: ${i}`
            await sleep(1000);
        }
    });
});
