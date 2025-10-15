document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // =========================
  // Inserir cabeçalho e rodapé
  // =========================
  const headerHTML = `
    <header class="site-header">
      <div class="container">
        <h1>Organização Esperança</h1>
        <nav aria-label="Menu principal">
          <ul class="main-nav">
            <li><a href="#" data-page="home" aria-current="page">Início</a></li>
            <li>
              <a href="#" data-page="projetos">Projetos</a>
              <ul>
                <li><a href="#">Projeto 1</a></li>
                <li><a href="#">Projeto 2</a></li>
              </ul>
            </li>
            <li><a href="#" data-page="cadastro">Cadastro</a></li>
          </ul>
        </nav>
        <div class="hamburger" aria-label="Menu mobile">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="site-footer">
      <p>&copy; <span id="ano"></span> Organização Esperança</p>
    </footer>
  `;

  body.insertAdjacentHTML("afterbegin", headerHTML);
  body.insertAdjacentHTML("beforeend", footerHTML);
  document.getElementById("ano").textContent = new Date().getFullYear();

  // =========================
  // SPA - Carregamento de páginas
  // =========================
  const mainContainer = document.querySelector("main.container");
  const links = document.querySelectorAll(".main-nav a");
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');

  // Menu hamburger
  hamburger.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Função para carregar página via fetch
  async function carregarPagina(pagina) {
    try {
      const url = `pages/${pagina}.html`;
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error("Erro ao carregar a página.");
      const html = await resposta.text();

      // Extrair apenas o conteúdo do <main class="container">
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const novoConteudo = tempDiv.querySelector("main.container");
      if (novoConteudo) {
        mainContainer.innerHTML = novoConteudo.innerHTML;
      }

      // Chamar scripts específicos
      if (pagina === "cadastro") {
        inicializarFormCadastro();
      }
    } catch (err) {
      mainContainer.innerHTML = "<p style='color:red;'>Erro ao carregar a página.</p>";
      console.error(err);
    }
  }

  // Intercepta cliques do menu
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pagina = link.dataset.page;
      if (!pagina) return;

      carregarPagina(pagina);
      window.history.pushState({}, "", pagina + ".html");
    });
  });

  // Suporte para navegação pelo botão voltar/avançar do navegador
  window.addEventListener("popstate", () => {
    const pagina = window.location.pathname.split("/").pop().replace(".html", "");
    if (pagina) carregarPagina(pagina);
    else carregarPagina("home");
  });

  // Inicializa página de cadastro (toasts, validação)
  function inicializarFormCadastro() {
    const form = document.getElementById("form-cadastro");
    if (!form) return;
    const toastContainer = document.getElementById("toast-container");

    function showToast(message, type = "success") {
      const toast = document.createElement("div");
      toast.className = `toast ${type} show`;
      toast.textContent = message;
      toastContainer.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }

    function mascara(i, t) {
      let v = i.value.replace(/\D/g, '');
      if(t === 'cpf') i.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      if(t === 'telefone') i.value = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      if(t === 'cep') i.value = v.replace(/(\d{5})(\d{3})/, "$1-$2");
    }

    document.getElementById('cpf').addEventListener('input', e => mascara(e.target, 'cpf'));
    document.getElementById('telefone').addEventListener('input', e => mascara(e.target, 'telefone'));
    document.getElementById('cep').addEventListener('input', e => mascara(e.target, 'cep'));

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

      // Valida CPF
      const cpf = document.getElementById("cpf").value;
      if (cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
        valido = false;
        showToast("CPF inválido. Use o formato 000.000.000-00.", "error");
      }

      // Valida CEP
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
  }

  // Carrega a página inicial automaticamente
  carregarPagina("home");
});
