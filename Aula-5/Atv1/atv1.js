const tabuadaMax = 10;

document.addEventListener("DOMContentLoaded", () => {
    const numberInput = document.getElementById("numberInput");
    const submitBtn = document.getElementById("submitBtn");
    const resultDiv = document.getElementById("resultDiv");

    submitBtn.addEventListener("click", () => {
        const inputNumValue = Number(numberInput.value);
        let multiplier = 1;

        while(resultDiv.lastElementChild) 
            resultDiv.removeChild(resultDiv.lastElementChild);
        
        while(multiplier <= tabuadaMax) {
            let result = inputNumValue * multiplier;

            const resultText = document.createElement("h2");
            resultText.className = "result-text";
            resultText.textContent = `${inputNumValue}x${multiplier} = ${result}`

            resultDiv.appendChild(resultText);

            multiplier++;
        }

        resultDiv.style.display = "block";
    })
})