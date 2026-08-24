document.addEventListener("DOMContentLoaded", () => {
    const daysInput = document.getElementById("daysLived");
    const submitBtn = document.getElementById("submitBtn");
    const resultText = document.getElementById("resultText");
    const resultValue = document.getElementById("resultValue");

    submitBtn.addEventListener("click", () => {
        const daysValue = Number(daysInput.value);

        const years = Math.floor(daysValue / 365);
        const months = Math.floor((daysValue % 365) / 30);
        const days = Math.floor((daysValue % 365) % 30)

        resultText.textContent = `A Idade de ${daysValue} dias equivale a:`
        resultValue.textContent = `${adaptForPlural(years, "ano", "anos")}, ${adaptForPlural(months, "mes", "meses")} e ${adaptForPlural(days, "dia", "dias")}.`
    });
});

function adaptForPlural(value, singText, pluText) {
    if (value > 1) return `${value} ${pluText}`
    return `${value} ${singText}`
}
