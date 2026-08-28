document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.getElementById("cadastroCliente");
    const submitResultText = document.getElementById("submitResult");
    
    const supaCliente = supabase.createClient(
        '',
        '')

    cadastroForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const cliente = Object.fromEntries(formData.entries());

        const { error } = await supaCliente
            .from('cliente')
            .insert({
                tipo_cliente: cliente.tipo,
                cpf_cnpj_cliente: cliente.cpfcnjpj,
                nome_cliente: cliente.nome
            });

        if (error) {
            console.log(error);
            submitResultText.textContent = "Erro!"
            return;
        }

        submitResultText.textContent = "Usuario cadastrado com sucesso!"
    });
});
