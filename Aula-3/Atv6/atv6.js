const products = [
    { id: "arroz", name: "Arroz", price: 24.90 },
    { id: "feijao", name: "Feijão", price: 8.50 },
    { id: "macarrao", name: "Macarrão", price: 5.99 },
    { id: "farinha_mandioca", name: "Farinha de Mandioca", price: 7.90 },
    { id: "fuba", name: "Fubá", price: 4.50 },
    { id: "acucar", name: "Açúcar", price: 4.99 },
    { id: "sal", name: "Sal", price: 2.49 },
    { id: "cafe", name: "Café", price: 18.90 },
    { id: "leite", name: "Leite", price: 5.49 },
    { id: "manteiga", name: "Manteiga", price: 12.90 },
    { id: "margarina", name: "Margarina", price: 7.99 },
    { id: "pao", name: "Pão Francês", price: 1.25 },
    { id: "queijo", name: "Queijo Mussarela", price: 39.90 },
    { id: "presunto", name: "Presunto", price: 29.90 },
    { id: "ovos", name: "Ovos", price: 12.90 },
    { id: "frango", name: "Peito de Frango", price: 18.90 },
    { id: "carne", name: "Carne Bovina", price: 34.90 },
    { id: "linguica", name: "Linguiça", price: 21.90 },
    { id: "tomate", name: "Tomate", price: 8.99 },
    { id: "cebola", name: "Cebola", price: 6.49 },
    { id: "batata", name: "Batata", price: 5.99 },
    { id: "cenoura", name: "Cenoura", price: 4.99 },
    { id: "banana", name: "Banana", price: 6.99 },
    { id: "laranja", name: "Laranja", price: 5.49 },
    { id: "maca", name: "Maçã", price: 9.90 },
    { id: "azeite", name: "Azeite de Oliva", price: 29.90 },
    { id: "oleo", name: "Óleo de Soja", price: 7.49 },
    { id: "vinagre", name: "Vinagre", price: 4.99 },
    { id: "molho_tomate", name: "Molho de Tomate", price: 3.49 },
    { id: "leite_condensado", name: "Leite Condensado", price: 7.99 },
    { id: "creme_leite", name: "Creme de Leite", price: 4.49 },
    { id: "biscoito", name: "Biscoito", price: 4.99 },
    { id: "chocolate", name: "Chocolate", price: 8.90 },
    { id: "refrigerante", name: "Refrigerante", price: 9.99 },
    { id: "suco", name: "Suco de Laranja", price: 7.90 },
    { id: "agua", name: "Água Mineral", price: 3.49 }
];

const productInputs = new Map();
const productElements = new Map();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("products-grid");
    const sortSelect = document.getElementById("products-sort");
    
    products.forEach((product, index) => {
        const inputName = `${product.id}Amount`;
        const productDiv = document.createElement("div");
        productDiv.className = "product-div"
        
        const productDataDiv = document.createElement("div");
        productDataDiv.className = "product-data-div";
        
        const nameLabel = document.createElement("label");
        nameLabel.htmlFor = inputName;
        nameLabel.className = "product-name";
        nameLabel.textContent = product.name;
        productDataDiv.appendChild(nameLabel);
        
        const priceLabel = document.createElement("label");
        priceLabel.htmlFor = inputName;
        priceLabel.className = "product-price";
        priceLabel.textContent = `R$ ${product.price.toFixed(2)}`;
        productDataDiv.appendChild(priceLabel);
        
        const amountDiv = document.createElement("div");
        amountDiv.className = "product-input-div";
        
        const amountInput = document.createElement("input");
        amountInput.type = "number";
        amountInput.className = "product-input";
        amountInput.id = inputName;
        amountInput.name = inputName;
        amountInput.min = "0";
        amountInput.value = "0";
        amountInput.addEventListener('change', (event) => calcCheckoutValue());
        
        const inputAddBtn = document.createElement("button");
        inputAddBtn.className = "product-input-btn";
        inputAddBtn.innerText = "+";
        inputAddBtn.addEventListener("click", () => onInputPlusClick(inputName));
        
        const inputSubBtn = document.createElement("button");
        inputSubBtn.className = "product-input-btn";
        inputSubBtn.innerText = "-";
        inputSubBtn.addEventListener("click", () => onInputMinusClick(inputName));
        
        amountDiv.appendChild(inputSubBtn);
        amountDiv.appendChild(amountInput);
        amountDiv.appendChild(inputAddBtn);
        
        productDiv.appendChild(productDataDiv);
        productDiv.appendChild(amountDiv);
        
        form.appendChild(productDiv);
        
        productElements.set(product.id, productDiv);
        productInputs.set(product.id, amountInput);
        console.log(`[ATV6] Added product ${product.id} to products div.`)
    });
    
    sortSelect.addEventListener("change", (event) => {
        sortProducts(event.target.value);
    });
});

function onInputPlusClick(targetInput) {
    const input = document.getElementById(targetInput);
    
    input.value = parseInt(input.value || 0) + 1;
    
    input.dispatchEvent(new Event('change'));
}

function onInputMinusClick(targetInput) {
    const input = document.getElementById(targetInput);
    
    let currentValue = parseInt(input.value) || 0;
    
    if (currentValue === 0) return; 
    
    input.value = currentValue - 1;
    input.dispatchEvent(new Event('change'));
}

function calcCheckoutValue() {
    const subtotalText = document.getElementById("subtotalText");
    const discountText = document.getElementById("discountText");
    const totalText = document.getElementById("totalText");
    
    let subtotal = 0;
    let discount = 0;
    let total = 0;
    
    productInputs.forEach((amountInput, productId) => {
        const product = products.find(product => product.id === productId);
        if (amountInput.value < 0) amountInput.value = 0;
        
        subtotal = subtotal + (product.price * amountInput.value);
    });
    
    if (subtotal >= 100) discount = 0.10;
    
    total = subtotal * (1 - discount);
    
    subtotalText.textContent = `R$ ${subtotal.toFixed(2)}`;
    discountText.textContent = `${(discount*100).toFixed(2)}%`;
    totalText.textContent = `R$ ${total.toFixed(2)}`
}

function sortProducts(sortBy) {
    const form = document.getElementById("products-grid");

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "name":
            return a.name.localeCompare(b.name);
            
            case "name-desc":
            return b.name.localeCompare(a.name);
            
            case "price":
            return a.price - b.price;
            
            case "price-desc":
            return b.price - a.price;
            
            default:
            return 0;
        }
    });
    
    for (const product of sortedProducts) {
        form.appendChild(productElements.get(product.id));
    }
}
