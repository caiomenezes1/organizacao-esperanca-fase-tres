document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Cria a estrutura do site
  body.innerHTML = `
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

    <main class="container"></main>

    <footer class="site-footer">
      <p>&copy; <span id="ano"></span> Organização Esperança</p>
    </footer>
  `;

  // Atualiza o ano no rodapé
  document.getElementById("ano").textContent = new Date().getFullYear();

  // Agora podemos selecionar elementos corretamente
  const mainContainer = document.querySelector("main.container");
  const links = document.querySelectorAll(".main-nav a");
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');

  // Menu hamburger
  hamburger.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Função para carregar páginas, SPA, toasts, etc...
  async function carregarPagina(pagina) {
    try {
      const url = `pages/${pagina}.html`;
      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error("Erro ao carregar a página.");
      const html = await resposta.text();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const novoConteudo = tempDiv.querySelector("main.container");
      if (novoConteudo) mainContainer.innerHTML = novoConteudo.innerHTML;

      if (pagina === "cadastro") inicializarFormCadastro();
    } catch (err) {
      mainContainer.innerHTML = "<p style='color:red;'>Erro ao carregar a página.</p>";
      console.error(err);
    }
  }

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pagina = link.dataset.page;
      if (!pagina) return;
      carregarPagina(pagina);
      window.history.pushState({}, "", pagina + ".html");
    });
  });

  window.addEventListener("popstate", () => {
    const pagina = window.location.pathname.split("/").pop().replace(".html", "");
    carregarPagina(pagina || "home");
  });

  carregarPagina("home");

  // Função de inicializar formulário de cadastro (toasts, validações)
  function inicializarFormCadastro() {
    // ... mantém exatamente como estava
  }
});
