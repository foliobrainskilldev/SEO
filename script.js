/**
 * MOCAPLAY.SITE - Script Principal Ultra-Leve
 * Funcionalidades: Menu Mobile, Tabelas Roláveis, Acordeão de FAQ e Data Atual Automática
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Menu Mobile (Abrir / Fechar)
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('is-open');
    });

    // Fechar menu ao clicar fora em ecrãs móveis
    document.addEventListener('click', function (event) {
      if (
        navLinks.classList.contains('is-open') &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Acordeão de Perguntas Frequentes (FAQ)
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const parentItem = btn.closest('.faq-item');
      if (!parentItem) return;

      const isActive = parentItem.classList.contains('active');

      // Fecha outros itens abertos para manter leitura limpa no telemóvel
      document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
        openItem.classList.remove('active');
        const openBtn = openItem.querySelector('.faq-question');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        parentItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 3. Indicador visual de tabela rolável no telemóvel
  const tableWrappers = document.querySelectorAll('.table-wrapper');
  tableWrappers.forEach(function (wrapper) {
    wrapper.addEventListener('scroll', function () {
      if (wrapper.scrollLeft > 15) {
        wrapper.classList.add('is-scrolled');
      } else {
        wrapper.classList.remove('is-scrolled');
      }
    }, { passive: true });
  });

  // 4. Data automática consoante o dia atual em Português de Moçambique
  try {
    const now = new Date();

    // Atualiza a barra do topo (#current-date) -> Ex: "Qui, 05 Nov 2026"
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
      const topOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('pt-MZ', topOptions);
    }

    // Atualiza a barra do autor (.dynamic-date) -> Ex: "05 de Novembro de 2026"
    const dynamicDates = document.querySelectorAll('.dynamic-date');
    if (dynamicDates.length > 0) {
      const fullOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      const formattedFullDate = now.toLocaleDateString('pt-MZ', fullOptions);
      dynamicDates.forEach(function (el) {
        el.textContent = formattedFullDate;
      });
    }
  } catch (e) {
    // Mantém a data estática do HTML caso o navegador antigo não suporte
  }
});