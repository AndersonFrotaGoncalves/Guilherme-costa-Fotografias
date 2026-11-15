// Galeria em tela cheia: clique, setas do teclado, deslizar no telemóvel e Esc para fechar.
(() => {
  const fotos = window.FOTOS || [];
  const dlg = document.getElementById("lightbox");
  const img = document.getElementById("lb-img");
  const legenda = document.getElementById("lb-legenda");
  let atual = 0;

  const mostrar = (i) => {
    atual = (i + fotos.length) % fotos.length;
    img.src = fotos[atual].src;
    img.alt = fotos[atual].alt;
    legenda.textContent = `${fotos[atual].alt} · ${atual + 1} de ${fotos.length}`;
    // pré-carrega a seguinte para a navegação ficar instantânea
    new Image().src = fotos[(atual + 1) % fotos.length].src;
  };

  document.querySelector(".grade")?.addEventListener("click", (e) => {
    const link = e.target.closest(".foto");
    if (!link || !dlg.showModal) return; // sem suporte a <dialog>, o link abre a foto normalmente
    e.preventDefault();
    mostrar(Number(link.dataset.i));
    dlg.showModal();
  });

  dlg.addEventListener("click", (e) => {
    const acao = e.target.closest("[data-acao]")?.dataset.acao;
    if (acao === "fechar" || e.target === dlg) dlg.close();
    if (acao === "anterior") mostrar(atual - 1);
    if (acao === "proxima") mostrar(atual + 1);
  });

  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });

  let inicioX = null;
  dlg.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });

  // devolve o foco à foto que estava aberta
  dlg.addEventListener("close", () => document.querySelector(`.foto[data-i="${atual}"]`)?.focus());

  document.getElementById("ano").textContent = new Date().getFullYear();
})();
