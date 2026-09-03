export function confirmModal({
	title = "Confirmar ação",
	message = "Tem Certeza?",
	confirmText = "Confirmar",
	confirmClass = "btn-danger",
	loadingText = "",
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
		const confirmBtnInner = confirmButton.innerHTML;

		if (loadingText) {
			confirmButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      			${loadingText}...`;
		}

		try {
			await onConfirm?.();

			bootstrap.Modal.getInstance(modalElement).hide();
		} finally {
			confirmButton.innerHTML = confirmBtnInner;
			confirmButton.disabled = false;
		}
	};

	bootstrap.Modal.getOrCreateInstance(modalElement).show();
}
