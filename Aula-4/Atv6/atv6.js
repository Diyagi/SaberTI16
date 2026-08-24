document.addEventListener("DOMContentLoaded", () => {
    const fabCarCostInput = document.getElementById("fabCarCost");
    const distPercInput = document.getElementById("distPerc");
    const taxPercInput = document.getElementById("taxPerc");
    const submitBtn = document.getElementById("submitBtn");
    const calcResultText = document.getElementById("calcResult");

    submitBtn.addEventListener("click", () => {
        const carCostValue = Number(fabCarCostInput.value);
        const distPercValue = Number(distPercInput.value);
        const taxPercValue = Number(taxPercInput.value);
        let finalCost = carCostValue;

        finalCost += carCostValue * (distPercValue/100);
        finalCost += carCostValue * (taxPercValue/100);

        calcResultText.textContent = `Custo ao consumidor: R$ ${finalCost.toFixed(2)}`
    })
})