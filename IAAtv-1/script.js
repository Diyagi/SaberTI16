const formulario = document.querySelector('#form-tabuada');
const campoNumero = document.querySelector('#numero');
const areaTabuada = document.querySelector('#tabuada');
const mensagem = document.querySelector('#mensagem');

function criarLinha(numero, multiplicador) {
  const resultado = numero * multiplicador;
  return `
    <div class="list-group-item linha-tabuada">
      <span>${numero} × ${multiplicador}</span>
      <strong>${resultado}</strong>
    </div>`;
}

function gerarTabuadaComFor(numero) {
  let linhas = '';

  for (let multiplicador = 1; multiplicador <= 5; multiplicador++) {
    linhas += criarLinha(numero, multiplicador);
  }

  return linhas;
}

function gerarTabuadaComWhile(numero) {
  let linhas = '';
  let multiplicador = 6;

  while (multiplicador <= 10) {
    linhas += criarLinha(numero, multiplicador);
    multiplicador++;
  }

  return linhas;
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const numero = Number(campoNumero.value);

  if (campoNumero.value.trim() === '' || Number.isNaN(numero)) {
    mensagem.textContent = 'Informe um número válido para gerar a tabuada.';
    areaTabuada.innerHTML = '';
    return;
  }

  mensagem.textContent = '';
  areaTabuada.innerHTML = gerarTabuadaComFor(numero) + gerarTabuadaComWhile(numero);
});
