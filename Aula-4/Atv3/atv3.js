document.addEventListener("DOMContentLoaded", () => {
    const celsiusInput = document.getElementById("celsiusInput");
    const convertBtn = document.getElementById("convertBtn");
    const conversionText = document.getElementById("conversionText");
    const conversionValue = document.getElementById("conversionValue");

    convertBtn.addEventListener("click", () => {
        const celsiusValue = Number(celsiusInput.value);
        let fahrenheitValue = (celsiusValue * 9/5) + 32;

        conversionText.textContent = `${celsiusValue}° Celsius são:`;
        conversionValue.textContent = `${fahrenheitValue}° Fahreheit`;
    })
})