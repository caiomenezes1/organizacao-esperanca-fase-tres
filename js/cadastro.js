// cadastro.js
const form = document.getElementById("form-cadastro");
const toastContainer = document.getElementById("toast-container");

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 5000); // 5s
}

// Máscaras
function mascara(i, t) {
  let v = i.value.replace(/\D/g, '');
  if(t === 'cpf') i.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if(t === 'telefone') i.value = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if(t === 'cep') i.value = v.replace(/(\d{5})(\d{3})/, "$1-$2");
}

document.getElementById('cpf').addEventListener('input', e => mascara(e.target, 'cpf'));
document.getElementById('telefone').addEventListener('input', e => mascara(e.target, 'telefone'));
document.getElementById('cep').addEventListener('input', e => mascara(e.target, 'cep'));

// Validação do formulário
form.addEventListener("submit", e => {
  e.preventDefault();
  const campos = form.querySelectorAll("input[required], select[required]");
  let valido = true;

  campos.forEach(campo => {
    if (!campo.value.trim()) {
      valido = false;
      showToast(`O campo "${campo.previousElementSibling.textContent.replace('*','').trim()}" está em branco.`, "error");
    }
  });

  // valida CPF
  const cpf = document.getElementById("cpf").value;
  if (cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
    valido = false;
    showToast("CPF inválido. Use o formato 000.000.000-00.", "error");
  }

  // valida CEP
  const cep = document.getElementById("cep").value;
  if (cep && !/^\d{5}-\d{3}$/.test(cep)) {
    valido = false;
    showToast("CEP inválido. Use o formato 00000-000.", "error");
  }

  if (valido) {
    showToast("Cadastro realizado com sucesso!", "success");
    form.reset();
  }
});
