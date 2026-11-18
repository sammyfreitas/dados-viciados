// Função para incluir header e footer automaticamente
document.addEventListener("DOMContentLoaded", () => {
  const load = (selector, file) => {
    fetch(file)
      .then(resp => resp.text())
      .then(html => {
        document.querySelector(selector).innerHTML = html;

        // Marca página ativa no menu
        const links = document.querySelectorAll("header nav ul li a");
        links.forEach(link => {
          if (link.getAttribute("href") === window.location.pathname.split("/").pop()) {
            link.classList.add("ativo");
          }
        });
      });
  };

  // placeholders no HTML principal
  load("header", "header.html");
  load("footer", "footer.html");
});
