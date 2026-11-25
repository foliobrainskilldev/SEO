/**
 * MOCAPLAY.SITE - Motor Oficial Eleventy (Data-Driven + Sveltia CMS)
 */

module.exports = function (eleventyConfig) {
  // 1. Copia ficheiros estáticos e páginas HTML fixas ainda não migradas
  eleventyConfig.addPassthroughCopy("*.html");
  eleventyConfig.addPassthroughCopy("casas/*.html");
  eleventyConfig.addPassthroughCopy("pagamentos/*.html");
  eleventyConfig.addPassthroughCopy("guias/*.html");
  eleventyConfig.addPassthroughCopy("apostas-futebol/*.html");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("admin");

  // 2. Coleção de todos os artigos ativos do CMS
  eleventyConfig.addCollection("paginas_cms", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("blog/artigos/*.md")
      .filter((item) => item.data.draft !== true)
      .reverse();
  });

  // 3. Coleção automática de Featured Posts (ordenados por featured_order)
  eleventyConfig.addCollection("featured_posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("blog/artigos/*.md")
      .filter((item) => item.data.draft !== true && item.data.featured === true)
      .sort((a, b) => (a.data.featured_order || 99) - (b.data.featured_order || 99));
  });

  // 4. Regra para desativar rascunhos
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.draft === true) return false;
      return data.permalink;
    }
  });

  // 5. Shortcodes Modulares do CMS
  eleventyConfig.addShortcode("botao", function (texto, url, estilo = "btn-cta", rel = "sponsored nofollow noopener") {
    const safeUrl = url || "#";
    const isExternal = safeUrl.startsWith("http") || safeUrl.startsWith("/ir/");
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
    let headerStr = cabecalhos || "";
    let rowsStr = linhasTexto || "";
    if (!linhasTexto && headerStr.includes("\\n")) {
      const parts = headerStr.split("\\n");
      headerStr = parts.shift();
      rowsStr = parts.join("\\n");
    }
    const ths = headerStr.split("|").map(h => `<th>${h.trim()}</th>`).join("");
    const trs = rowsStr
      .replace(/\\n/g, "\n")
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(linha => {
        const tds = linha.split("|").map(cel => `<td>${cel.trim()}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
    return `<div class="table-scroll-hint"><span>&larr; Deslize a tabela para o lado no telemóvel &rarr;</span></div><div class="table-wrapper"><table class="compare-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
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
