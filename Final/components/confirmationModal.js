export function confirmModal({
	title = "Confirmar ação",
	message = "Tem Certeza?",
	confirmText = "Confirmar",
	confirmClass = "btn-danger",
	onConfirm,
}) {
	const modalElement = document.getElementById("confirmationModal");

	const titleElement = document.getElementById("confirmationModalTitle");

	const messageElement = document.getElementById("confirmationModalMessage");

	const confirmButton = document.getElementById("confirmationModalConfirm");

	titleElement.textContent = title;
	messageElement.innerHTML = message;

	confirmButton.textContent = confirmText;
	confirmButton.className = `btn ${confirmClass}`;

	// Remove the previous callback
	confirmButton.onclick = null;

	// Set the new callback
	confirmButton.onclick = async function () {
		confirmButton.disabled = true;

		try {
			await onConfirm?.();

			bootstrap.Modal.getInstance(modalElement).hide();
		} finally {
			confirmButton.disabled = false;
		}
	};

	bootstrap.Modal.getOrCreateInstance(modalElement).show();
}
