/**
 * MOCAPLAY.SITE - Motor Oficial Eleventy (Com Coleção Automática para Sitemap e Blog)
 */

module.exports = function (eleventyConfig) {
  // 1. Copia as páginas HTML fixas e os ficheiros estáticos para "_site"
  eleventyConfig.addPassthroughCopy("*.html");
  eleventyConfig.addPassthroughCopy("casas/*.html");
  eleventyConfig.addPassthroughCopy("pagamentos/*.html");
  eleventyConfig.addPassthroughCopy("guias/*.html");
  eleventyConfig.addPassthroughCopy("apostas-futebol/*.html");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.ignores.add("README.md");

  // 2. COLEÇÃO AUTOMÁTICA DO CMS: Agrupa todos os .md criados pelo Decap em "blog/artigos/"
  // (Ignora automaticamente páginas marcadas como rascunho/desativadas: draft === true)
  eleventyConfig.addCollection("paginas_cms", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("blog/artigos/*.md")
      .filter(function (item) {
        return item.data.draft !== true;
      })
      .reverse();
  });

  // 3. Regra para DESATIVAR páginas no CMS (se marcar "draft: true", não gera o HTML)
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

  // 4. BLOCOS VISUAIS DO CMS (Em linha única para não quebrar o Markdown)
  eleventyConfig.addShortcode("botao", function (texto, url, estilo = "btn-cta", rel = "sponsored nofollow noopener") {
    const safeUrl = url || "#";
    const isExternal = safeUrl.startsWith("http");
    const targetAttr = isExternal ? ' target="_blank"' : "";
    const relAttr = isExternal ? ` rel="${rel}"` : "";
    return `<div style="margin:1.25rem 0;"><a href="${safeUrl}"${targetAttr}${relAttr} class="btn ${estilo}" style="white-space:normal;max-width:100%;line-height:1.35;">${texto} &rarr;</a></div>`;
  });

  eleventyConfig.addShortcode("aviso", function (titulo, texto) {
    return `<div class="callout-warning"><strong>${titulo}:</strong> ${texto}</div>`;
  });

  eleventyConfig.addShortcode("proscontras", function (prosTexto, contrasTexto) {
    const prosItens = (prosTexto || "").split("|").map(i => i.trim()).filter(Boolean).map(i => `<li>${i}</li>`).join("");
    const contrasItens = (contrasTexto || "").split("|").map(i => i.trim()).filter(Boolean).map(i => `<li>${i}</li>`).join("");
    return `<div class="pros-cons-grid"><div class="pros-box"><h4>&#10003; Pontos Fortes (Prós)</h4><ul>${prosItens}</ul></div><div class="cons-box"><h4>&#10007; Pontos a Melhorar (Contras)</h4><ul>${contrasItens}</ul></div></div>`;
  });

  eleventyConfig.addShortcode("cartao", function (etiqueta, corEtiqueta, titulo, texto, textoBotao, urlBotao) {
    const badgeClass = corEtiqueta ? `category-badge ${corEtiqueta}` : "category-badge";
    const btnHtml = urlBotao ? `<a href="${urlBotao}" class="btn btn-outline btn-sm" style="white-space:normal;">${textoBotao || "Ler Mais"} &rarr;</a>` : "";
    return `<article class="editorial-card" style="margin:1.25rem 0;"><div><span class="${badgeClass}">${etiqueta}</span><h3>${titulo}</h3><p>${texto}</p></div>${btnHtml}</article>`;
  });

  eleventyConfig.addShortcode("tabela", function (cabecalhos, linhasTexto) {
    const ths = (cabecalhos || "").split("|").map(h => `<th>${h.trim()}</th>`).join("");
    const trs = (linhasTexto || "")
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(linha => {
        const tds = linha.split("|").map(cel => `<td>${cel.trim()}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
    return `<div class="table-scroll-hint"><span>&larr; Deslize a tabela para o lado no telemóvel &rarr;</span></div><div class="table-wrapper"><table class="compare-table"><thead><tr>${ths}</thead><tbody>${trs}</tbody></table></div>`;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: false
  };
};
