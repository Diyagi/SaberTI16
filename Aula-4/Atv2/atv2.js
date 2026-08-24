const monthsArray = [
    "Janeiro", "Fevereiro", "Março",
    "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"
];

const monthMap = new Map();

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

document.addEventListener("DOMContentLoaded", () => {
    const monthsDiv = document.getElementById("months-rows");
    const submitBtn = document.getElementById("submitBtn");
    
    const totGrossValTxt = document.getElementById("totGrossVal");
    const totDiscPercValTxt = document.getElementById("totDiscPercVal");
    const totNetValTxt = document.getElementById("totNetVal");
    
    monthsArray.forEach((month) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row-div";
        
        const monthLabel = document.createElement("label");
        monthLabel.textContent = month;
        monthLabel.className = "month-label";

        
        const inputGross = document.createElement("input");
        inputGross.type = "text";
        inputGross.id = `inputBruto-${month}`;
        inputGross.name = `inputBruto-${month}`;
        inputGross.className = "input-gross";
        inputGross.placeholder = "Digite valor bruto...";

        inputGross.addEventListener("change", 
            (element) => updateCurrencyMask(element.target));
        
        const grossWrapper = document.createElement("div");
        grossWrapper.className = "input-wrapper";

        grossWrapper.appendChild(inputGross);
        
        
        const inputDiscount = document.createElement("input");
        inputDiscount.type = "text";
        inputDiscount.id = `inputDesconto-${month}`;
        inputDiscount.name = `inputDesconto-${month}`;
        inputDiscount.className = "input-discount";
        inputDiscount.placeholder = "Digite o % de desconto...";
        
        inputDiscount.addEventListener("change", 
            (element) => updatePercMask(element.target));
        
        const discountWrapper = document.createElement("div");
        discountWrapper.className = "input-wrapper";
        
        discountWrapper.appendChild(inputDiscount);
        
        
        const netText = document.createElement("h2");
        netText.className = "net-text";
        netText.textContent = currency.format(0);
        
        rowDiv.append(
            monthLabel,
            grossWrapper,
            discountWrapper,
            netText
        );
        
        monthsDiv.appendChild(rowDiv);
        
        monthMap.set(month, {
            gross: inputGross,
            discount: inputDiscount,
            net: netText
        });
    });
    
    submitBtn.addEventListener("click", () => {
        let totGross = 0;
        let totDiscPerc = 0;
        let totNet = 0;
        let validMonths = 0;
        
        monthMap.forEach((data) => {
            const grossRaw = removeCurrencyMask(data.gross);
            const discRaw = removePercMask(data.discount);
            
            const grossValue = Number(grossRaw);
            const discValue = Number(discRaw);
            
            if (grossRaw !== "" || discRaw !== "") {
                validMonths++;
            }
            
            const netValue = grossValue - (grossValue * discValue / 100);
            
            totGross += grossValue;
            totDiscPerc += discValue;
            totNet += netValue;
            
            data.net.textContent = currency.format(netValue);
        });
        
        const averageDiscount = validMonths > 0 ? totDiscPerc / validMonths : 0;
        
        totGrossValTxt.textContent = currency.format(totGross);
        totDiscPercValTxt.textContent = `${averageDiscount.toFixed(2)} %`;
        totNetValTxt.textContent = currency.format(totNet);
    });

    function updateCurrencyMask(input) {
        const value = removeCurrencyMask(input);
        const numericValue = Number(value);
        const formattedValue = currency.format(numericValue);

        if (value === "") {
            input.value = "";
            return;
        }

        input.value = formattedValue;
    }

    function removeCurrencyMask(input) {
        return input.value.replace(/[^\d,-]/g, "").replace(",",".");
    }

    function updatePercMask(input) {
        const value = removePercMask(input);
        const numericValue = Number(value);
        const formattedValue = `${numericValue}%`
        
        if (value === "") {
            input.value = "";
            return;
        }

        input.value = formattedValue;
    }

    function removePercMask(input) {
        return input.value.replace(/\D/g, "");
    }
});
