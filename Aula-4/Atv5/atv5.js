document.addEventListener("DOMContentLoaded", () => {
    const secondsInput = document.getElementById("secondsInput");
    const submitBtn = document.getElementById("submitBtn");
    const resultText = document.getElementById("resultText");
    const resultValue = document.getElementById("resultValue");

    submitBtn.addEventListener("click", () => {
        const secondsValue = Number(secondsInput.value);

        const horas = Math.floor(secondsValue / 3600);
        const minutos = Math.floor((secondsValue % 3600) / 60);
        const segundos = Math.floor((secondsValue % 3600) % 60)

        resultText.textContent = `${secondsValue} segundos equivalem a:`
        resultValue.textContent = `${adaptForPlural(horas, "hora", "horas")}, ${adaptForPlural(minutos, "minuto", "minutos")} e ${adaptForPlural(segundos, "segundo", "segundos")}.`
    });
});

function adaptForPlural(value, singText, pluText) {
    if (value > 1) return `${value} ${pluText}`
    return `${value} ${singText}`
}
