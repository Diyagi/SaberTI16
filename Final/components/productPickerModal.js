let componentPromise;
let products = [];
let filteredProducts = [];
let onSelectProduct;
let sort = { key: "description", direction: "asc" };

export async function openProductPicker({ availableProducts = [], onSelect }) {
    const modalElement = await ensureComponent();
    products = availableProducts;
    onSelectProduct = onSelect;
    sort = { key: "description", direction: "asc" };

    const search = modalElement.querySelector("#productPickerSearch");
    search.value = "";
    renderProducts(modalElement);

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
    modalElement.addEventListener("shown.bs.modal", () => search.focus(), { once: true });
}

async function ensureComponent() {
    const existing = document.querySelector("#productPickerModal");
    if (existing) return existing;

    if (!componentPromise) {
        componentPromise = fetch("/components/productPickerModal.html")
            .then((response) => {
                if (!response.ok) throw new Error("Não foi possível carregar o seletor de produtos.");
                return response.text();
            })
            .then((html) => {
                document.body.insertAdjacentHTML("beforeend", html);
                const modal = document.querySelector("#productPickerModal");
                modal.querySelector("#productPickerSearch").addEventListener("input", () => renderProducts(modal));
                modal.querySelector("#productPickerSearch").addEventListener("keydown", onSearchKeydown);
                modal.querySelector("thead").addEventListener("click", onSortClick);
                modal.querySelector("#productPickerTableBody").addEventListener("click", onProductClick);
                return modal;
            });
    }

    return componentPromise;
}

function renderProducts(modalElement) {
    const query = normalize(modalElement.querySelector("#productPickerSearch").value);
    filteredProducts = products
        .filter((product) => {
            const category = product.category?.description ?? "";
            return normalize(`${product.id} ${product.description ?? ""} ${category}`).includes(query);
        })
        .sort(compareProducts);

    modalElement.querySelectorAll(".sort-button").forEach((button) => {
        const active = button.dataset.sort === sort.key;
        button.classList.toggle("active", active);
        button.querySelector("i").className = `bi ${active ? (sort.direction === "asc" ? "bi-sort-up" : "bi-sort-down") : "bi-arrow-down-up"}`;
    });

    const tableBody = modalElement.querySelector("#productPickerTableBody");
    tableBody.innerHTML = "";
    if (!filteredProducts.length) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum produto encontrado.</td></tr>';
        return;
    }

    filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");
        row.dataset.productId = product.id;
        if (index === 0) row.classList.add("product-picker-first");
        row.innerHTML = `
            <td></td><td></td><td></td><td class="text-end"></td>
            <td class="text-end"><button type="button" class="btn btn-sm btn-primary select-product" data-id="${product.id}">Selecionar</button></td>
        `;
        row.children[0].textContent = product.id;
        row.children[1].textContent = product.description ?? "";
        row.children[2].textContent = product.category?.description ?? "Sem categoria";
        row.children[3].textContent = formatCurrency(product.price);
        tableBody.appendChild(row);
    });
}

function onSearchKeydown(event) {
    if (event.key !== "Enter" || !filteredProducts.length) return;
    event.preventDefault();
    selectProduct(filteredProducts[0]);
}

function onSortClick(event) {
    const button = event.target.closest(".sort-button");
    if (!button) return;
    sort = sort.key === button.dataset.sort
        ? { key: sort.key, direction: sort.direction === "asc" ? "desc" : "asc" }
        : { key: button.dataset.sort, direction: "asc" };
    renderProducts(document.querySelector("#productPickerModal"));
}

function onProductClick(event) {
    const button = event.target.closest(".select-product");
    if (!button) return;
    selectProduct(products.find((product) => String(product.id) === button.dataset.id));
}

function selectProduct(product) {
    if (!product) return;
    onSelectProduct?.(product);
    bootstrap.Modal.getInstance(document.querySelector("#productPickerModal"))?.hide();
}

function compareProducts(left, right) {
    const direction = sort.direction === "asc" ? 1 : -1;
    const getValue = (product) => sort.key === "category"
        ? product.category?.description ?? ""
        : product[sort.key];
    const leftValue = getValue(left);
    const rightValue = getValue(right);

    if (sort.key === "id" || sort.key === "price") {
        return (Number(leftValue) - Number(rightValue)) * direction;
    }
    return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), "pt-BR", { sensitivity: "base" }) * direction;
}

function normalize(value) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);
}
