function calcularFrete() {
  const cep = document.getElementById("cepInput").value.trim();
  const resultado = document.getElementById("resultado");
  const mensagemErro = document.getElementById("mensagemErro");
  const spinner = document.getElementById("spinner");

  // Limpa mensagens anteriores
  resultado.style.display = "none";
  mensagemErro.style.display = "none";
  resultado.innerHTML = "";
  spinner.style.display = "none";

  // Validação simples
  const cepValido = /^[0-9]{8}$/.test(cep);

  if (!cepValido) {
    mensagemErro.textContent = "Por favor, digite um CEP válido com 8 números.";
    mensagemErro.style.display = "block";
    return;
  }

  // Mostra o spinner
  spinner.style.display = "block";

  // Consulta API ViaCEP
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      spinner.style.display = "none"; // Esconde o spinner

      if (data.erro) {
        mensagemErro.textContent = "CEP não encontrado. Tente outro.";
        mensagemErro.style.display = "block";
        return;
      }

      // Simulação de cálculo de frete
      let valorFrete;
      let prazoEntrega;
      const primeiroDigito = parseInt(cep.charAt(0));

      if (primeiroDigito <= 3) {
        valorFrete = 15.90;
        prazoEntrega = "3 a 5 dias úteis";
      } else if (primeiroDigito <= 6) {
        valorFrete = 22.50;
        prazoEntrega = "5 a 7 dias úteis";
      } else {
        valorFrete = 29.90;
        prazoEntrega = "7 a 10 dias úteis";
      }

      // Exibir resultado com endereço
      resultado.innerHTML = `
        <strong>Endereço:</strong><br>
        ${data.logradouro}, ${data.bairro}<br>
        ${data.localidade} - ${data.uf}<br><br>
        <strong>Frete estimado:</strong> R$ ${valorFrete.toFixed(2)}<br>
        <strong>Prazo:</strong> ${prazoEntrega}
      `;
      resultado.style.display = "block";
    })
    .catch(error => {
      spinner.style.display = "none";
      console.error("Erro ao consultar o CEP:", error);
      mensagemErro.textContent = "Erro ao buscar o endereço. Tente novamente.";
      mensagemErro.style.display = "block";
    });
}