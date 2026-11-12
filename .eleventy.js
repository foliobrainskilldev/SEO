/**
 * MOCAPLAY.SITE - Motor do Gerador Estático & Blocos do CMS Visual
 */

module.exports = function (eleventyConfig) {
  // 1. Copia automaticamente os ficheiros e páginas HTML existentes para a pasta final (_site)
  eleventyConfig.addPassthroughCopy("*.html");
  eleventyConfig.addPassthroughCopy("casas/*.html");
  eleventyConfig.addPassthroughCopy("pagamentos/*.html");
  eleventyConfig.addPassthroughCopy("guias/*.html");
  eleventyConfig.addPassthroughCopy("apostas-futebol/*.html");
  eleventyConfig.addPassthroughCopy("blog/*.html");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("admin");

  // 2. Regra para DESATIVAR páginas no CMS (se marcar "draft: true", a página sai do ar)
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.draft === true) return false;
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => {
      if (data.draft === true) return true;
      return data.eleventyExcludeFromCollections;
    }
  });

  // 3. BLOCOS VISUAIS DO CMS (Botão, Aviso, Prós/Contras e Cartão)
  eleventyConfig.addShortcode("botao", function (texto, url, estilo = "btn-cta", rel = "sponsored nofollow noopener") {
    const isExternal = url.startsWith("http");
    const targetAttr = isExternal ? ' target="_blank"' : "";
    const relAttr = isExternal ? ` rel="${rel}"` : "";
    return `<p style="margin: 1.15rem 0;"><a href="${url}"${targetAttr}${relAttr} class="btn ${estilo}">${texto} &rarr;</a></p>`;
  });

  eleventyConfig.addShortcode("aviso", function (titulo, texto) {
    return `<div class="callout-warning"><strong>${titulo}:</strong> ${texto}</div>`;
  });

  eleventyConfig.addShortcode("proscontras", function (prosTexto, contrasTexto) {
    const prosItens = (prosTexto || "").split("|").map(i => i.trim()).filter(Boolean).map(i => `<li>${i}</li>`).join("");
    const contrasItens = (contrasTexto || "").split("|").map(i => i.trim()).filter(Boolean).map(i => `<li>${i}</li>`).join("");
    return `
    <div class="pros-cons-grid">
      <div class="pros-box"><h4>&#10003; Pontos Fortes (Prós)</h4><ul>${prosItens}</ul></div>
      <div class="cons-box"><h4>&#10007; Pontos a Melhorar (Contras)</h4><ul>${contrasItens}</ul></div>
    </div>`;
  });

  eleventyConfig.addShortcode("cartao", function (etiqueta, corEtiqueta, titulo, texto, textoBotao, urlBotao) {
    const badgeClass = corEtiqueta ? `category-badge ${corEtiqueta}` : "category-badge";
    const btnHtml = urlBotao ? `<a href="${urlBotao}" class="btn btn-outline btn-sm">${textoBotao || "Ler Mais"} &rarr;</a>` : "";
    return `
    <article class="editorial-card" style="margin: 1.25rem 0;">
      <div>
        <span class="${badgeClass}">${etiqueta}</span>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </div>
      ${btnHtml}
    </article>`;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk"
  };
};