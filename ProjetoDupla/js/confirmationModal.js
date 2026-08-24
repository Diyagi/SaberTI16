const defaultLabel = "Confirmar Exclusao";
const defaultButton = "Excluir"
let confirmationCallback = null;

export function showConfirmation(message, callback, label = defaultLabel, button = defaultButton) {
    const modalElement = document.getElementById("confirmationModal");
    
    document.getElementById("confirmationModalBody").textContent = message;
    document.getElementById("confirmationModalLabel").textContent = label;
    document.getElementById("confirmationModalConfirm").textContent = button;
    
    confirmationCallback = callback;
    
    bootstrap.Modal
    .getOrCreateInstance(modalElement)
    .show();
}

document.getElementById("confirmationModalConfirm").addEventListener("click", () => {
    if (confirmationCallback) {
        confirmationCallback();
    }
    
    bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmationModal")).hide();
});

document.getElementById("confirmationModal").addEventListener("hidden.bs.modal", () => {
    confirmationCallback = null;
});