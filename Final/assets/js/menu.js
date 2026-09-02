import { initRouter } from "./router.js";

const appShell = document.querySelector("#app-shell");
const sidebarTrigger = document.querySelector("#sidebar-trigger");
const pageTitle = document.querySelector("#page-title");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

const routeTitles = {
  quotes: "Orçamentos",
  products: "Produtos",
  categories: "Categorias",
  clients: "Clientes",
  useredit: "Editar usuário",
  users: "Usuários"
};

function isMobileLayout() {
  return window.matchMedia("(max-width: 767.98px)").matches;
}

function updateSidebarButton() {
  const isOpen = isMobileLayout()
    ? appShell.classList.contains("sidebar-open")
    : !appShell.classList.contains("sidebar-collapsed");

  sidebarTrigger.setAttribute("aria-expanded", String(isOpen));
  sidebarTrigger.setAttribute("aria-label", isOpen ? "Recolher menu lateral" : "Expandir menu lateral");
}

function toggleSidebar() {
  appShell.classList.toggle(isMobileLayout() ? "sidebar-open" : "sidebar-collapsed");
  updateSidebarButton();
}

function updateNavigation(route) {
  pageTitle.textContent = routeTitles[route] || "SaberTI";

  sidebarLinks.forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

async function loadConfirmationModal() {
    const response = await fetch("/components/confirmationModal.html");

    if (!response.ok) {
        throw new Error("Failed to load confirmation modal");
    }

    const html = await response.text();

    document.body.insertAdjacentHTML("beforeend", html);
}

document.addEventListener("click", function (event) {

    const button = event.target.closest(".js-confirm");

    if (!button) {
        return;
    }

    event.preventDefault();

    const title = button.dataset.confirmTitle || "Confirm action";
    const message = button.dataset.confirmMessage || "Are you sure?";
    const confirmText = button.dataset.confirmText || "Confirm";
    const confirmClass = button.dataset.confirmClass || "btn-danger";

    const modalElement = document.getElementById("confirmationModal");

    document.getElementById("confirmationModalTitle").textContent = title;
    document.getElementById("confirmationModalMessage").textContent = message;

    const confirmButton =
        document.getElementById("confirmationModalConfirm");

    confirmButton.textContent = confirmText;
    confirmButton.className = `btn ${confirmClass}`;

    // Store what should happen when the user confirms
    confirmButton.onclick = function () {
        handleConfirmation(button);
    };

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
});

sidebarTrigger.addEventListener("click", toggleSidebar);

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileLayout()) {
      appShell.classList.remove("sidebar-open");
      updateSidebarButton();
    }
  });
});

window.addEventListener("resize", updateSidebarButton);
document.addEventListener("routechange", (event) => updateNavigation(event.detail.route));

updateSidebarButton();
initRouter();
loadConfirmationModal();
