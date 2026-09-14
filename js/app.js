/* =====================================================================
   Sindicato Rural de Jataí — site
   Rotas por hash, componentes e animações.
   ===================================================================== */
(function () {
  "use strict";

  var U = SRJ.U, $ = U.$, $$ = U.$$, esc = U.esc, I = U.I;
  var Store = SRJ.Store, C = SRJ.Content;

  var State = SRJ.State = {
    posts: [],
    cacheNoticias: null,
    feed: 8,
    lista: 9,
    rota: { path: "/", parts: [], q: new URLSearchParams() },
    fotosAtivas: []
  };

  /* =====================================================================
     Menu e mapa do site
     ===================================================================== */
  var MENU = [
    { label: "Início", href: "#/" },
    { label: "Sobre", items: [
      { label: "História", href: "#/historia" },
      { label: "Diretoria", href: "#/diretoria" },
      { label: "Nossa Equipe", href: "#/equipe" }
    ]},
    { label: "Serviços", items: [
      { label: "Cotações do Agro", href: "#/cotacoes" },
      { label: "Locação de Espaços", href: "#/locacoes" },
      { label: "Cursos e Treinamentos", href: "#/cursos" },
      { label: "Balcão de Emprego Rural", href: "#/balcao-de-emprego" },
      { label: "Eventos", href: "#/eventos" },
      { label: "Equoterapia", href: "#/equoterapia" },
      { label: "Informações do Agro", href: "#/informacoes-do-agro" }
    ]},
    { label: "Notícias", href: "#/noticias" },
    { label: "Galerias", items: [
      { label: "Galeria de Fotos", href: "#/galeria-fotos" },
      { label: "Galeria de Vídeos", href: "#/galeria-videos" }
    ]},
    { label: "Sócios", items: [
      { label: "Clube de Vantagens", href: "#/convenios" },
      { label: "Seja um Novo Associado", href: "#/associe-se" }
    ]},
    { label: "Leilão", href: "#/leilao" },
    { label: "Contato", href: "#/contato" }
  ];
  var PAGINAS = [
    { rota: "#/", titulo: "Início", desc: "Página inicial do Sindicato Rural de Jataí" },
    { rota: "#/historia", titulo: "História", desc: "De 1943 a hoje: exposições, associação e sindicato" },
    { rota: "#/diretoria", titulo: "Diretoria", desc: "Diretoria executiva, suplentes e conselho fiscal" },
    { rota: "#/equipe", titulo: "Nossa Equipe", desc: "Colaboradores da sede, do parque e da equoterapia" },
    { rota: "#/cotacoes", titulo: "Cotações do Agro", desc: "Soja, milho, sorgo, cana, boi gordo, vaca, novilha, suínos e dólar" },
    { rota: "#/locacoes", titulo: "Locação de Espaços", desc: "Pavilhão, tatersal, fazendinha, auditório, quiosque e sala de reunião" },
    { rota: "#/cursos", titulo: "Cursos e Treinamentos", desc: "Capacitação Senar mobilizada pelo Sindicato" },
    { rota: "#/balcao-de-emprego", titulo: "Balcão de Emprego Rural", desc: "Cadastre seu currículo para vagas no campo" },
    { rota: "#/eventos", titulo: "Eventos", desc: "Leilões, palestras, feijoada e dias de campo" },
    { rota: "#/equoterapia", titulo: "Equoterapia", desc: "Centro de Equoterapia Primeiro Passo, atendimento gratuito" },
    { rota: "#/noticias", titulo: "Notícias", desc: "Notícias, artigos, editais, avisos e cotações" },
    { rota: "#/galeria-fotos", titulo: "Galeria de Fotos", desc: "Registros do Sindicato e do Parque de Exposições" },
    { rota: "#/galeria-videos", titulo: "Galeria de Vídeos", desc: "Vídeos institucionais e dos espaços" },
    { rota: "#/convenios", titulo: "Clube de Vantagens", desc: "Convênios e benefícios do associado" },
    { rota: "#/associe-se", titulo: "Seja um Novo Associado", desc: "Pré-cadastro de associado" },
    { rota: "#/leilao", titulo: "Leilão de Gado", desc: "Todas as quartas-feiras, às 19h30, no Parque de Exposições" },
    { rota: "#/contato", titulo: "Contato", desc: "Endereço, telefones, WhatsApp e e-mail" },
    { rota: "#/informacoes-do-agro", titulo: "Informações do Agro", desc: "Certificado Senar, boletins agroclimáticos, mercado e cotações" },
    { rota: "#/mapa-do-site", titulo: "Mapa do Site", desc: "Todas as páginas" },
    { rota: "#/redacao", titulo: "Redação", desc: "Painel de administração do site" }
  ];
  SRJ.MENU = MENU; SRJ.PAGINAS = PAGINAS;

  /* =====================================================================
     Notícias
     ===================================================================== */
  function normalizar(p) {
    var o = {};
    for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) o[k] = p[k];
    o.slug = p.slug || p.id;
    o.autor = p.autor || SRJ.AUTOR_PADRAO;
    o.tags = p.tags || [];
    return o;
  }
  function noticias() {
    if (State.cacheNoticias) return State.cacheNoticias;
    var list = State.posts
      .filter(function (p) { return p.status !== "rascunho"; })
      .map(normalizar)
      .sort(function (a, b) { return a.data < b.data ? 1 : a.data > b.data ? -1 : 0; });
    State.cacheNoticias = list;
    return list;
  }
  function acharNoticia(slug) {
    var l = noticias().filter(function (n) { return n.slug === slug || n.id === slug; });
    return l[0] || null;
  }
  function comImagem(l) { return l.filter(function (n) { return n.img; }); }
  SRJ.noticias = noticias;

  /* =====================================================================
     Cotações — ticker derivado do boletim
     ===================================================================== */
  function tickerItens() {
    var c = C.get("cotacoes"), out = [];
    var dv = (c.dolar != null && c.dolarAnterior != null) ? c.dolar - c.dolarAnterior : 0;
    out.push({ nome: "Dólar", valor: U.brl(c.dolar), un: "", dif: dv });
    (c.agricultura || []).forEach(function (a) {
      var ps = (a.compradores || []).map(function (x) { return x.preco; }).filter(function (p) { return p != null && p !== ""; }).map(Number);
      if (!ps.length) return;
      var max = Math.max.apply(null, ps);
      out.push({ nome: a.produto, valor: U.brl(max), un: a.unidade ? a.unidade.replace("R$", "") : "", dif: 0 });
    });
    (c.pecuaria || []).forEach(function (p) {
      if (p.atual == null || p.atual === "") return;
      out.push({ nome: p.produto, valor: U.brl(p.atual), un: p.unidade ? p.unidade.replace("R$", "") : "", dif: (p.anterior != null ? p.atual - p.anterior : 0) });
    });
    return out;
  }

  /* =====================================================================
     Componentes de layout
     ===================================================================== */
  function renderHeader() {
    var itens = MENU.map(function (m) {
      if (m.items) {
        return '<li><button type="button" class="top" aria-haspopup="true" aria-expanded="false">' + esc(m.label) + " " + I.chev + "</button>" +
          '<ul class="sub">' + m.items.map(function (s) { return '<li><a href="' + s.href + '">' + esc(s.label) + "</a></li>"; }).join("") + "</ul></li>";
      }
      return '<li><a href="' + m.href + '" data-nav="' + m.href + '">' + esc(m.label) + "</a></li>";
    }).join("");
    $("#header").innerHTML = '<div class="wrap">' +
      '<a class="brand" href="#/" aria-label="Sindicato Rural de Jataí, ir para o início">' +
      '<img src="' + U.img("assets/logo.png") + '" alt="" width="64" height="64" decoding="async">' +
      '<span class="txt"><b>Sindicato Rural</b><small>Jataí · Goiás</small></span></a>' +
      '<nav class="nav" aria-label="Menu principal"><ul>' + itens + "</ul></nav>" +
      '<div class="hdr-actions">' +
      '<a class="btn btn-accent btn-sm hdr-cta" href="#/associe-se">Associe-se</a>' +
      '<button type="button" class="icon-btn" id="btn-search" aria-label="Buscar no site">' + I.search + "</button>" +
      '<button type="button" class="icon-btn burger" id="btn-menu" aria-label="Abrir menu" aria-expanded="false">' + I.menu + "</button>" +
      "</div></div>";

    $$(".nav button.top").forEach(function (b) {
      b.addEventListener("click", function (e) {
        var li = b.parentElement, abrir = !li.classList.contains("open");
        $$(".nav li.open").forEach(function (o) { o.classList.remove("open"); $(".top", o).setAttribute("aria-expanded", "false"); });
        if (abrir) { li.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
        e.stopPropagation();
      });
    });
    $("#btn-search").addEventListener("click", abrirBusca);
    $("#btn-menu").addEventListener("click", function () { abrirDrawer(true); });
  }

  function renderDrawer() {
    var d = $("#drawer");
    d.innerHTML = '<div class="scrim"></div><div class="panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="dhead"><a class="brand" href="#/"><img src="' + U.img("assets/logo.png") + '" alt="" width="44" height="44"><span class="txt"><b>Sindicato Rural</b><small>Jataí · Goiás</small></span></a>' +
      '<button type="button" class="icon-btn close" aria-label="Fechar menu">' + I.close + "</button></div>" +
      MENU.map(function (m) {
        if (m.items) {
          return '<button type="button" class="acc" aria-expanded="false">' + esc(m.label) + " " + I.chev + "</button>" +
            '<div class="subl">' + m.items.map(function (s) { return '<a href="' + s.href + '">' + esc(s.label) + "</a>"; }).join("") + "</div>";
        }
        return '<a href="' + m.href + '">' + esc(m.label) + "</a>";
      }).join("") +
      '<div class="dfoot">' +
      '<a class="btn btn-accent cta" href="#/associe-se">Seja um associado</a>' +
      '<a class="btn btn-ghost" href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp</a>" +
      '<a class="btn btn-quiet" href="#/redacao">' + I.key + " Redação</a></div></div>";

    $(".scrim", d).addEventListener("click", function () { abrirDrawer(false); });
    $(".close", d).addEventListener("click", function () { abrirDrawer(false); });
    $$(".acc", d).forEach(function (b) {
      b.addEventListener("click", function () {
        var aberto = b.classList.toggle("open");
        b.setAttribute("aria-expanded", String(aberto));
        b.nextElementSibling.classList.toggle("open", aberto);
      });
    });
    $$("a", d).forEach(function (a) { a.addEventListener("click", function () { abrirDrawer(false); }); });
  }
  function abrirDrawer(abrir) {
    var d = $("#drawer");
    d.classList.toggle("open", abrir);
    document.body.classList.toggle("travado", abrir);
    var b = $("#btn-menu"); if (b) b.setAttribute("aria-expanded", String(abrir));
    if (abrir) { var f = $(".panel a, .panel button", d); if (f) f.focus(); }
  }

  function renderTicker() {
    var c = C.get("cotacoes");
    var itens = tickerItens();
    if (!itens.length) { $("#ticker").hidden = true; return; }
    $("#ticker").hidden = false;
    var html = itens.map(function (t) {
      var selo = "";
      if (t.dif) {
        var cls = t.dif > 0 ? "up" : "down";
        selo = '<span class="d ' + cls + '">' + (t.dif > 0 ? "▲" : "▼") + " " +
          Math.abs(t.dif).toFixed(2).replace(".", ",") + "</span>";
      }
      return '<a class="it" href="#/cotacoes"><b>' + esc(t.nome) + '</b><span class="v">' + esc(t.valor) +
        (t.un ? "<small>" + esc(t.un) + "</small>" : "") + "</span>" + selo + "</a>";
    }).join("");
    $("#ticker").innerHTML = '<div class="wrap">' +
      '<a class="label" href="#/cotacoes"><span class="dot"></span>Cotações<span class="data"> · ' + U.fmtShort(c.data) + "</span></a>" +
      '<div class="track"><div class="lane">' + html + html + "</div></div>" +
      '<a class="more" href="#/cotacoes">Ver boletim ' + I.right + "</a></div>";
  }

  function renderFooter() {
    var i = C.get("info");
    var links = C.get("links") || [];
    $("#footer").innerHTML = '<div class="wrap">' +
      '<div class="top">' +
      "<div>" +
      '<a class="brand" href="#/"><img src="' + U.img("assets/logo.png") + '" alt="" width="56" height="56" loading="lazy" decoding="async"><span class="txt"><b>' + esc(i.nome) + "</b><small>Desde " + esc(i.desde) + "</small></span></a>" +
      '<p class="addr">' + esc(i.endereco) + "<br>" + esc(i.cidade) + " — " + esc(i.cep) + "<br>" +
      '<a href="' + SRJ.tel() + '">' + esc(i.telefone) + '</a> · <a href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + esc(i.whatsapp) + "</a><br>" +
      '<a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a></p>" +
      '<div class="soc">' +
      (i.instagram ? '<a href="' + esc(i.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + "</a>" : "") +
      (i.facebook ? '<a href="' + esc(i.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + "</a>" : "") +
      (i.youtube ? '<a href="' + esc(i.youtube) + '" target="_blank" rel="noopener" aria-label="YouTube">' + I.yt + "</a>" : "") +
      '<a href="' + SRJ.wa() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + I.wa + "</a>" +
      "</div></div>" +
      "<div><h4>Serviços</h4><ul>" +
      '<li><a href="#/cotacoes">Cotações do Agro</a></li><li><a href="#/leilao">Leilão de gado</a></li>' +
      '<li><a href="#/locacoes">Locação de espaços</a></li><li><a href="#/cursos">Cursos e treinamentos</a></li>' +
      '<li><a href="#/balcao-de-emprego">Balcão de Emprego</a></li><li><a href="#/equoterapia">Equoterapia</a></li></ul></div>' +
      "<div><h4>Institucional</h4><ul>" +
      '<li><a href="#/historia">História</a></li><li><a href="#/diretoria">Diretoria</a></li>' +
      '<li><a href="#/equipe">Nossa equipe</a></li><li><a href="#/convenios">Clube de Vantagens</a></li>' +
      '<li><a href="#/associe-se">Associe-se</a></li><li><a href="#/contato">Contato</a></li></ul></div>' +
      "<div><h4>Links rápidos</h4><ul>" +
      links.slice(0, 5).map(function (l) {
        return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.nome) + "</a></li>";
      }).join("") +
      '<li><a href="#/informacoes-do-agro">Ver todos</a></li></ul></div>' +
      "</div>" +
      '<div class="bottom">' +
      "<span>© " + new Date().getFullYear() + " " + esc(i.sigla) + " — " + esc(i.nome) + ". Todos os direitos reservados.</span>" +
      '<span class="creditos"><a href="#/mapa-do-site">Mapa do site</a> · <a href="#/redacao">' + I.key + "Redação</a> · Desenvolvido por " +
      '<a href="https://instagram.com/ofrancomaia" target="_blank" rel="noopener">@ofrancomaia</a></span>' +
      "</div></div>";
  }

  /* =====================================================================
     Blocos reutilizáveis
     ===================================================================== */
  function crumbs(lista) {
    return '<nav class="crumbs" aria-label="Você está em"><a href="#/">Início</a>' +
      lista.map(function (c) { return "<span>" + (c.href ? '<a href="' + c.href + '">' + esc(c.t) + "</a>" : esc(c.t)) + "</span>"; }).join("") + "</nav>";
  }
  function pageHead(t, lead, cr) {
    return '<header class="page-head"><div class="wrap">' + crumbs(cr || [{ t: t }]) + "<h1>" + esc(t) + "</h1>" +
      (lead ? '<p class="lead">' + esc(lead) + "</p>" : "") + "</div></header>";
  }
  function pageHero(t, lead, img, cr) {
    return '<div class="wrap"><header class="page-hero"><div class="ph-img"><img src="' + esc(U.img(img)) + '" alt="" decoding="async"></div>' +
      '<div class="cont">' + crumbs(cr || [{ t: t }]) + "<h1>" + esc(t) + "</h1>" +
      (lead ? "<p>" + esc(lead) + "</p>" : "") + "</div></header></div>";
  }
  function kick(n) {
    var laranja = (n.cat === "Eventos" || n.cat === "Avisos") ? " laranja" : "";
    return '<span class="kick' + laranja + '">' + esc(n.kicker || n.cat) + ' <span class="cat">· ' + esc(n.cat) + "</span></span>";
  }
  function card(n, grande) {
    return '<article class="card' + (grande ? " big" : "") + (n.img ? "" : " no-img") + '">' +
      (n.img ? '<a class="img" href="#/noticia/' + esc(n.slug) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(U.img(n.img)) + '" alt="" loading="lazy" decoding="async"></a>' : "") +
      '<div class="body">' + kick(n) +
      '<h3><a href="#/noticia/' + esc(n.slug) + '">' + esc(n.titulo) + "</a></h3>" +
      "<p>" + esc(n.resumo) + "</p>" +
      '<div class="meta"><time datetime="' + esc(n.data) + '">' + U.fmtLong(n.data) + "</time></div></div></article>";
  }
  function feedItem(n, i) {
    return '<li style="--i:' + (i || 0) + '"><span class="t">' + U.rel(n.data) + "</span>" +
      '<div><span class="k">' + esc(n.kicker || n.cat) + "</span>" +
      '<a class="h" href="#/noticia/' + esc(n.slug) + '">' + esc(n.titulo) + "</a></div></li>";
  }
  function evItem(n) {
    var d = U.parseDate(n.data);
    return '<li class="ev"><div class="d"><b>' + ("0" + d.getDate()).slice(-2) + "</b><small>" + U.MES3[d.getMonth()] + " " + d.getFullYear() + "</small></div>" +
      '<div><span class="kick laranja">' + esc(n.kicker || n.cat) + "</span>" +
      '<h3><a href="#/noticia/' + esc(n.slug) + '">' + esc(n.titulo) + "</a></h3>" +
      "<p>" + esc(n.resumo) + "</p></div></li>";
  }
  function vazio(msg, acao) {
    return '<div class="vazio">' + I.inbox + "<p>" + esc(msg) + "</p>" + (acao || "") + "</div>";
  }
  function sec(t, all, sub) {
    return '<div class="sec-head"><h2>' + esc(t) + "</h2>" +
      (all ? '<a class="all" href="' + all.href + '">' + esc(all.t) + "</a>" : "") +
      (sub ? '<p class="sub">' + esc(sub) + "</p>" : "") + "</div>";
  }

  /* =====================================================================
     Páginas
     ===================================================================== */
  var pages = {};

  /* ---------- Início ---------- */
  pages[""] = function () {
    titulo("");
    var news = noticias();
    if (!news.length) return '<section class="wrap section">' + vazio("Nenhuma publicação ainda.", '<a class="btn btn-primary" href="#/redacao">Publicar a primeira</a>') + "</section>";

    var equo = C.get("equoterapia"), info = C.get("info");
    var destaques = news.filter(function (n) { return n.destaque && n.img; }).slice(0, 3);
    if (!destaques.length) destaques = comImagem(news).slice(0, 2);
    var slides = destaques.map(function (n) {
      return { kicker: (n.kicker || n.cat) + " · " + U.fmtLong(n.data), t: n.titulo, p: n.resumo, img: n.img, href: "#/noticia/" + n.slug, cta: "Leia a matéria" };
    });
    slides.push({ kicker: equo.nome, t: "Equoterapia gratuita desde " + equo.desde, p: equo.praticantes + " praticantes ativos e mais de " + equo.familias + " famílias atendidas por uma equipe de fisioterapeutas, psicóloga e equitadores.", img: "assets/img/equoterapia.jpg", href: "#/equoterapia", cta: "Conheça o centro" });
    slides.push({ kicker: "Leilão de gado", t: "Toda quarta-feira, às 19h30", p: "Cria, recria e engorda no Parque de Exposições, com transmissão ao vivo e comissão reduzida para associados.", img: "assets/img/leilao.jpg", href: "#/leilao", cta: "Ver regulamento" });

    var atalhos = [
      { t: "Cotações do Agro", h: "#/cotacoes", i: I.chart },
      { t: "Leilão de Gado", h: "#/leilao", i: I.gavel, hot: true },
      { t: "Cursos Senar", h: "#/cursos", i: I.cap },
      { t: "Locação de Espaços", h: "#/locacoes", i: I.building },
      { t: "Balcão de Emprego", h: "#/balcao-de-emprego", i: I.briefcase },
      { t: "Equoterapia", h: "#/equoterapia", i: I.horse },
      { t: "Associe-se", h: "#/associe-se", i: I.userplus, hot: true },
      { t: "Clube de Vantagens", h: "#/convenios", i: I.percent },
      { t: "Informações do Agro", h: "#/informacoes-do-agro", i: I.doc },
      { t: "Galeria de Fotos", h: "#/galeria-fotos", i: I.image }
    ];

    var destaqueCards = comImagem(news).slice(0, 3);
    var feed = news.slice(0, State.feed);
    var eventos = news.filter(function (n) { return n.cat === "Eventos"; }).slice(0, 4);
    var editais = news.filter(function (n) { return n.cat === "Editais" || n.cat === "Avisos"; }).slice(0, 5);
    var fotos = C.get("fotos") || [];
    var locacoes = C.get("locacoes") || [];
    var beneficios = C.get("beneficios") || [];
    var parceiros = C.get("parceiros") || [];
    var c = C.get("cotacoes");
    var pec = (c.pecuaria || []).filter(function (p) { return p.atual != null && p.atual !== ""; });
    var agri = (c.agricultura || []).filter(function (a) { return a.unidade; });

    return '' +
      /* Hero */
      '<section class="hero wrap reveal" aria-label="Destaques">' +
        '<div class="slides">' + slides.map(function (s, k) {
          return '<article class="slide' + (k === 0 ? " on" : "") + '" role="group" aria-label="Destaque ' + (k + 1) + " de " + slides.length + '">' +
            '<img src="' + esc(U.img(s.img)) + '" alt=""' + (k ? ' loading="lazy"' : "") + ' decoding="async" fetchpriority="' + (k ? "low" : "high") + '">' +
            '<div class="cont"><span class="kicker">' + esc(s.kicker) + "</span>" +
            "<h2>" + esc(s.t) + "</h2><p>" + esc(s.p) + "</p>" +
            '<a class="cta" href="' + s.href + '">' + esc(s.cta) + " " + I.right + "</a></div></article>";
        }).join("") + "</div>" +
        '<button type="button" class="arrow prev" aria-label="Destaque anterior">' + I.left + "</button>" +
        '<button type="button" class="arrow next" aria-label="Próximo destaque">' + I.right + "</button>" +
        '<div class="dots" role="tablist" aria-label="Destaques">' + slides.map(function (_, k) {
          return '<button type="button" role="tab" aria-selected="' + (k === 0) + '" aria-label="Destaque ' + (k + 1) + '" class="' + (k === 0 ? "on" : "") + '"><i></i></button>';
        }).join("") + "</div>" +
      "</section>" +

      /* Acesso rápido + leilão + cotações */
      '<section class="section wrap grid-2-1">' +
        '<div class="reveal">' + sec("Acesso rápido") +
          '<div class="quick">' + atalhos.map(function (q, k) {
            return '<a href="' + q.h + '" class="' + (q.hot ? "hot" : "") + '" style="--i:' + k + '"><span class="ico">' + q.i + "</span><span>" + esc(q.t) + "</span></a>";
          }).join("") + "</div></div>" +
        '<div class="reveal" style="--d:80ms">' + sec("Agora no sindicato") +
          '<div class="live-card" id="leilao-card">' +
            '<span class="badge"><span class="dot"></span><span id="leilao-status">Próximo leilão</span></span>' +
            '<div class="when" id="leilao-when">Quarta-feira, 19h30</div>' +
            '<p class="sub">' + esc(info.parque.split("—")[0]) + "· cria, recria e engorda</p>" +
            '<div class="count" id="leilao-count">' +
              "<div><b>–</b><small>dias</small></div><div><b>–</b><small>horas</small></div><div><b>–</b><small>min</small></div><div><b>–</b><small>seg</small></div></div>" +
            '<div class="links"><a class="btn btn-light btn-sm" href="' + esc(info.youtube || "#/leilao") + '"' + (info.youtube ? ' target="_blank" rel="noopener"' : "") + ">" + I.play + " Assistir ao vivo</a>" +
            '<a class="btn btn-outline-w btn-sm" href="#/leilao">Regulamento</a></div>' +
          "</div>" +
          '<div class="panel cot-widget">' +
            '<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-tab="agri">Agricultura</button><button type="button" role="tab" aria-selected="false" data-tab="pec">Pecuária</button></div>' +
            '<div class="tabpanel" data-panel="agri"><ul class="quote-list">' +
              agri.slice(0, 3).map(function (a) {
                var ps = (a.compradores || []).map(function (x) { return x.preco; }).filter(function (p) { return p != null && p !== ""; }).map(Number);
                var v = ps.length ? (ps.length > 1 && Math.min.apply(null, ps) !== Math.max.apply(null, ps)
                  ? U.brl(Math.min.apply(null, ps)) + " – " + U.brl(Math.max.apply(null, ps)) : U.brl(ps[0])) : "—";
                return '<li><span class="n">' + esc(a.produto) + '<span class="u">' + esc(a.unidade) + '</span></span><span class="v num">' + v + "</span></li>";
              }).join("") +
              '<li><span class="n">Dólar</span><span class="v num">' + U.brl(c.dolar) + varTag(c.dolar - c.dolarAnterior) + "</span></li>" +
            "</ul></div>" +
            '<div class="tabpanel" data-panel="pec" hidden><ul class="quote-list">' +
              pec.map(function (p) {
                return '<li><span class="n">' + esc(p.produto) + '<span class="u">' + esc(p.unidade) + '</span></span><span class="v num">' + U.brl(p.atual) + varTag(p.anterior != null ? p.atual - p.anterior : 0) + "</span></li>";
              }).join("") +
            "</ul></div>" +
            '<div class="widget-foot"><span>Boletim de ' + U.fmtShort(c.data) + "</span>" +
            '<a href="#/cotacoes">Ver tudo ' + I.right + "</a></div>" +
          "</div></div>" +
      "</section>" +

      /* Notícias */
      '<section class="section wrap reveal">' + sec("Notícias e avisos", { href: "#/noticias", t: "Ver todas" }) +
        '<div class="news-grid"><div class="feature-grid">' +
          (destaqueCards[0] ? card(destaqueCards[0], true) : "") +
          (destaqueCards[1] ? card(destaqueCards[1]) : "") +
          (destaqueCards[2] ? card(destaqueCards[2]) : "") +
        "</div><aside>" +
          '<div class="feed"><div class="fh"><h3><span class="dot"></span>Últimas atualizações</h3><a class="all" href="#/noticias">Todas</a></div>' +
          '<ol id="feed-list">' + feed.map(feedItem).join("") + "</ol>" +
          (news.length > State.feed ? '<div class="ff"><button type="button" class="btn btn-ghost btn-sm" id="feed-more">Carregar mais</button></div>' : "") + "</div>" +
          (editais.length ? '<div class="panel side-box"><h3 class="box-title">' + I.doc + "Editais e avisos</h3><ul class=\"linklist\">" +
            editais.map(function (n) { return '<li><a href="#/noticia/' + esc(n.slug) + '"><b>' + esc(n.titulo) + "</b><small>" + U.fmtShort(n.data) + "</small></a></li>"; }).join("") +
            "</ul></div>" : "") +
        "</aside></div></section>" +

      /* Espaços */
      (locacoes.length ? '<section class="section wrap reveal">' +
        sec("Espaços para locação", { href: "#/locacoes", t: "Todos os espaços" }, "Do salão de reunião para 25 pessoas ao pavilhão para 3.000, na sede e no Parque de Exposições.") +
        '<div class="hscroll">' + locacoes.map(function (l) {
          return '<a class="space-card" href="#/locacoes?ir=' + esc(U.slugify(l.nome)) + '">' +
            '<div class="img"><img src="' + esc(U.img(l.img || "assets/img/sede.jpg")) + '" alt="" loading="lazy" decoding="async"></div>' +
            '<div class="body"><h3>' + esc(l.nome) + "</h3>" +
            '<span class="cap"><b class="num">' + esc(l.capacidade) + "</b> pessoas</span></div></a>";
        }).join("") + "</div></section>" : "") +

      /* Equoterapia */
      '<section class="section wrap reveal"><div class="equo">' +
        '<div class="img"><img src="' + U.img("assets/img/equoterapia.jpg") + '" alt="Atendimento de equoterapia no Centro Primeiro Passo" loading="lazy" decoding="async"></div>' +
        '<div class="body"><span class="kick">' + esc(equo.nome) + ' <span class="cat">· desde ' + esc(equo.desde) + "</span></span>" +
        "<h2>Equoterapia gratuita para quem mais precisa</h2>" +
        '<p class="txt">' + esc(equo.texto) + "</p>" +
        '<div class="stats four">' +
          statBox(equo.praticantes, "praticantes") + statBox(equo.familias + "+", "famílias") +
          statBox(equo.cavalos, "cavalos") + statBox((+equo.contratados) + (+equo.voluntarios), "profissionais") +
        "</div>" +
        '<div><a class="btn btn-primary" href="#/equoterapia">Como participar ' + I.right + "</a></div></div></div></section>" +

      /* Associado */
      '<section class="section wrap reveal"><div class="cta-band">' +
        '<div><span class="kick claro">Torne-se um associado</span>' +
        "<h2>Junte-se a quem fortalece o setor rural em Jataí</h2>" +
        '<ul class="ben">' + beneficios.slice(0, 6).map(function (b) { return "<li>" + I.check + "<span>" + esc(b.titulo) + "</span></li>"; }).join("") + "</ul></div>" +
        '<div class="act"><a class="btn btn-accent" href="#/associe-se">Fazer pré-cadastro ' + I.right + "</a>" +
        '<a class="btn btn-light" href="#/convenios">Clube de Vantagens</a>' +
        "<small>Mensalidades acessíveis e atendimento prioritário</small></div></div></section>" +

      /* Eventos + emprego */
      '<section class="section wrap grid-1-1">' +
        '<div class="reveal">' + sec("Eventos e agenda", { href: "#/eventos", t: "Ver agenda" }) +
          (eventos.length ? '<ul class="ev-list">' + eventos.map(evItem).join("") + "</ul>" : vazio("Nenhum evento publicado no momento.")) + "</div>" +
        '<div class="reveal" style="--d:80ms">' + sec("Balcão de Emprego Rural", { href: "#/balcao-de-emprego", t: "Cadastrar" }) +
          '<div class="panel soft emprego">' +
            "<p>Procurando emprego na área rural? Os currículos são gerenciados pelo Sindicato e encaminhados a produtores e empresas associadas e não associadas.</p>" +
            '<div class="row-btn"><a class="btn btn-primary" href="#/balcao-de-emprego">' + I.briefcase + " Cadastrar currículo</a>" +
            '<a class="btn btn-ghost" href="' + SRJ.wa("Olá! Sou empregador e tenho uma vaga rural para divulgar.") + '" target="_blank" rel="noopener">Sou empregador</a></div>' +
            (fotos.length ? '<div class="mini-gal-head"><h3>Galeria</h3><a href="#/galeria-fotos">Ver fotos</a></div>' +
              '<div class="gal three mini">' + fotos.slice(0, 6).map(function (f, k) {
                return '<figure data-lb="' + k + '"><img src="' + esc(U.img(f.src)) + '" alt="' + U.attr(f.legenda) + '" loading="lazy" decoding="async"></figure>';
              }).join("") + "</div>" : "") +
          "</div></div>" +
      "</section>" +

      /* Parceiros */
      (parceiros.length ? '<section class="section wrap reveal">' + sec("Parceiros institucionais") +
        '<div class="partners">' + parceiros.map(function (p) {
          return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener"><b>' + esc(p.nome) + "</b><small>" + esc(p.desc) + "</small></a>";
        }).join("") + "</div></section>" : "");
  };
  function statBox(v, l) { return '<div class="stat"><b class="num" data-count="' + esc(v) + '">' + esc(v) + "</b><small>" + esc(l) + "</small></div>"; }
  function varTag(d) {
    if (d == null || isNaN(d) || d === 0) return "";
    var cls = d > 0 ? "up" : "down";
    return '<span class="var ' + cls + '">' + (d > 0 ? "▲" : "▼") + " " + Math.abs(d).toFixed(2).replace(".", ",") + "</span>";
  }

  function afterHome() {
    carrossel();
    $$("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-tab]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
        $$("[data-panel]").forEach(function (p) { p.hidden = p.dataset.panel !== b.dataset.tab; });
      });
    });
    var more = $("#feed-more");
    if (more) more.addEventListener("click", function () {
      State.feed += 8;
      var news = noticias();
      $("#feed-list").innerHTML = news.slice(0, State.feed).map(feedItem).join("");
      if (State.feed >= news.length) more.parentElement.remove();
    });
    relogioLeilao();
    ligarLightbox((C.get("fotos") || []).slice(0, 6));
    contadores();
  }

  function carrossel() {
    var hero = $(".hero"); if (!hero) return;
    var slides = $$(".slide", hero), dots = $$(".dots button", hero), i = 0, timer = null;
    if (slides.length < 2) { $$(".arrow", hero).forEach(function (a) { a.remove(); }); $(".dots", hero).remove(); return; }
    function ir(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); d.setAttribute("aria-selected", String(k === i)); });
    }
    function auto() {
      clearInterval(timer);
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(function () { ir(i + 1); }, 7000);
    }
    $(".prev", hero).addEventListener("click", function () { ir(i - 1); auto(); });
    $(".next", hero).addEventListener("click", function () { ir(i + 1); auto(); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { ir(k); auto(); }); });
    hero.addEventListener("mouseenter", function () { clearInterval(timer); });
    hero.addEventListener("mouseleave", auto);
    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { ir(i - 1); auto(); }
      if (e.key === "ArrowRight") { ir(i + 1); auto(); }
    });
    var sx = null;
    hero.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) { ir(dx < 0 ? i + 1 : i - 1); auto(); }
      sx = null;
    });
    State.pararCarrossel = function () { clearInterval(timer); };
    auto();
  }

  var cdTimer = null;
  function proximoLeilao() {
    var agora = new Date();
    var alvo = new Date(agora.getTime());
    alvo.setHours(19, 30, 0, 0);
    var soma = (3 - agora.getDay() + 7) % 7;
    alvo.setDate(alvo.getDate() + soma);
    if (agora.getDay() === 3 && agora >= alvo && (agora - alvo) < 4 * 3600000) return { live: true, at: alvo };
    if (alvo <= agora) alvo.setDate(alvo.getDate() + 7);
    return { live: false, at: alvo };
  }
  SRJ.proximoLeilao = proximoLeilao;
  function relogioLeilao() {
    clearInterval(cdTimer);
    function tick() {
      var el = $("#leilao-count");
      if (!el) { clearInterval(cdTimer); return; }
      var n = proximoLeilao(), st = $("#leilao-status"), wh = $("#leilao-when");
      if (n.live) {
        st.textContent = "Ao vivo agora";
        wh.textContent = "Leilão em andamento";
        el.innerHTML = '<div class="full"><b>Acompanhe pelo canal do Sindicato</b></div>';
        return;
      }
      var s = Math.max(0, Math.floor((n.at - Date.now()) / 1000));
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      st.textContent = d === 0 ? "É hoje" : "Próximo leilão";
      wh.textContent = U.DIAS[n.at.getDay()] + ", " + ("0" + n.at.getDate()).slice(-2) + "/" + ("0" + (n.at.getMonth() + 1)).slice(-2) + " às 19h30";
      var b = $$("b", el);
      if (b.length === 4) {
        b[0].textContent = d;
        b[1].textContent = ("0" + h).slice(-2);
        b[2].textContent = ("0" + m).slice(-2);
        b[3].textContent = ("0" + s).slice(-2);
      }
    }
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  /* ---------- História ---------- */
  pages.historia = function () {
    titulo("História");
    var h = C.get("historia");
    return pageHero("Nossa história", "De uma exposição rural em 1943 ao sindicato fundado em 12 de setembro de 1968.", "assets/img/historia1.jpg", [{ t: "Sobre" }, { t: "História" }]) +
      '<section class="section wrap grid-2-1">' +
      '<div class="reveal"><div class="prose">' + (h.texto || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
      (h.marcos && h.marcos.length ? '<div class="sec-head mt"><h2>Linha do tempo</h2></div>' +
        '<ol class="timeline">' + h.marcos.map(function (m, k) {
          return '<li style="--i:' + k + '"><span class="y">' + esc(m.ano) + "</span><div><h3>" + esc(m.titulo) + "</h3><p>" + esc(m.texto) + "</p></div></li>";
        }).join("") + "</ol>" : "") + "</div>" +
      '<aside class="reveal" style="--d:80ms">' +
      '<figure class="side-fig"><img src="' + U.img("assets/img/historia2.jpg") + '" alt="Lideranças rurais nas primeiras exposições" loading="lazy" decoding="async"><figcaption>Lideranças rurais nas primeiras exposições agropecuárias de Jataí.</figcaption></figure>' +
      (h.presidentes && h.presidentes.length ? '<div class="aside-box"><h3>Presidentes</h3><ul class="pres-list">' +
        h.presidentes.map(function (p) { return "<li>" + esc(p.nome) + "<span>" + esc(p.periodo || "—") + "</span></li>"; }).join("") + "</ul></div>" : "") +
      "</aside></section>";
  };

  /* ---------- Diretoria ---------- */
  pages.diretoria = function () {
    titulo("Diretoria");
    var d = C.get("diretoria");
    function grupo(t, lista, destaque) {
      if (!lista || !lista.length) return "";
      return '<div class="reveal">' + sec(t) + '<div class="people">' +
        lista.map(function (p, k) { return pessoa(p, destaque && k === 0, k); }).join("") + "</div></div>";
    }
    return pageHero("Diretoria", "Gestão eleita em 27 de janeiro de 2026.", "assets/img/sede.jpg", [{ t: "Sobre" }, { t: "Diretoria" }]) +
      '<section class="section wrap stack">' + grupo("Diretoria executiva", d.titulares, true) +
      grupo("Suplentes", d.suplentes) + grupo("Conselho fiscal", d.conselho) + "</section>";
  };
  function iniciais(nome) {
    return String(nome || "").replace(/^(Dr|Dra|Sr|Sra)\.?\s+/i, "").split(/\s+/)
      .filter(function (x) { return x.length > 2; }).slice(0, 2)
      .map(function (x) { return x.charAt(0).toUpperCase(); }).join("");
  }
  function pessoa(p, destaque, k) {
    return '<div class="person' + (destaque ? " lead" : "") + '" style="--i:' + (k || 0) + '">' +
      '<div class="av">' + (p.img ? '<img src="' + esc(U.img(p.img)) + '" alt="" loading="lazy">' : esc(iniciais(p.nome))) + "</div>" +
      "<div><b>" + esc(p.nome) + "</b>" + (p.cargo ? "<small>" + esc(p.cargo) + "</small>" : "") + "</div></div>";
  }

  /* ---------- Equipe ---------- */
  pages.equipe = function () {
    titulo("Nossa Equipe");
    var lista = C.get("equipe") || [];
    var setores = [];
    lista.forEach(function (p) { if (setores.indexOf(p.setor) < 0) setores.push(p.setor); });
    var i = C.get("info");
    return pageHero("Nossa equipe", "Quem atende o produtor na sede, no Parque de Exposições e na equoterapia.", "assets/img/equipe.jpg", [{ t: "Sobre" }, { t: "Nossa Equipe" }]) +
      '<section class="section wrap stack">' +
      setores.map(function (s) {
        return '<div class="reveal">' + sec(s || "Equipe") + '<div class="people">' +
          lista.filter(function (p) { return p.setor === s; }).map(function (p, k) { return pessoa(p, false, k); }).join("") + "</div></div>";
      }).join("") +
      '<div class="panel soft team-cta reveal"><div><h3>Fale com a nossa equipe</h3><p>' + esc(i.horario) + ", na " + esc(i.endereco) + ".</p></div>" +
      '<a class="btn btn-primary" href="#/contato">' + I.phone + " Contato</a>" +
      '<a class="btn btn-ghost" href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp</a></div>" +
      "</section>";
  };

  /* ---------- Cotações ---------- */
  pages.cotacoes = function () {
    titulo("Cotações do Agro");
    var c = C.get("cotacoes");
    var links = C.get("links") || [];
    var boletins = noticias().filter(function (n) { return n.cat === "Cotações"; });
    return pageHead("Cotações do Agro", "Boletim de " + U.fmtShort(c.data) + ", levantado pela equipe do Sindicato junto aos compradores da região. " + (c.nota || ""), [{ t: "Serviços" }, { t: "Cotações" }]) +
      '<section class="wrap"><div class="chips resumo">' +
        '<span class="chip on">Dólar ' + U.brl(c.dolar) + "</span>" +
        tickerItens().slice(1).map(function (t) { return '<span class="chip">' + esc(t.nome) + " " + esc(t.valor) + esc(t.un) + "</span>"; }).join("") +
      "</div></section>" +
      '<section class="section wrap grid-2-1">' +
      '<div class="stack">' +
        (c.agricultura || []).map(function (a, k) {
          return '<div class="panel reveal" style="--d:' + (k * 50) + 'ms"><div class="sec-head tight"><h2>' + esc(a.produto) +
            (a.unidade ? ' <span class="chip">' + esc(a.unidade) + "</span>" : "") + "</h2>" +
            (a.obs ? '<small class="obs">' + esc(a.obs) + "</small>" : "") + "</div>" +
            '<ul class="quote-list">' + (a.compradores || []).map(function (x) {
              return '<li><span class="n">' + esc(x.nome) + (x.obs ? '<span class="u">' + esc(x.obs) + "</span>" : "") +
                '</span><span class="v num">' + (x.preco != null && x.preco !== "" ? U.brl(x.preco) : "—") + "</span></li>";
            }).join("") + "</ul></div>";
        }).join("") +
        '<div class="panel reveal"><div class="sec-head tight"><h2>Pecuária</h2><small class="obs">variação vs. ' + U.fmtShort(c.anterior) + "</small></div>" +
        '<ul class="quote-list">' + (c.pecuaria || []).map(function (p) {
          if (p.atual == null || p.atual === "") {
            return '<li><span class="n">' + esc(p.produto) + '</span><span class="v vazio-v">' + esc(p.obs || "—") + "</span></li>";
          }
          return '<li><span class="n">' + esc(p.produto) + '<span class="u">' + esc(p.unidade) + (p.obs ? " · " + esc(p.obs) : "") +
            '</span></span><span class="v num">' + U.brl(p.atual) + varTag(p.anterior != null ? p.atual - p.anterior : 0) + "</span></li>";
        }).join("") + "</ul></div>" +
      "</div>" +
      '<aside class="reveal" style="--d:80ms">' +
        links.filter(function (l) { return /power|cota/i.test(l.nome); }).slice(0, 1).map(function (l) {
          return '<div class="aside-box"><h3>Painel interativo</h3><p>' + esc(l.desc) + '</p><a class="btn btn-primary full" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + I.chart + " Abrir painel</a></div>";
        }).join("") +
        '<div class="aside-box"><h3>Mercado e clima</h3><ul class="linkist">' +
        links.filter(function (l) { return /agroclim|mercado/i.test(l.nome); }).map(function (l) {
          return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.nome) + "</a></li>";
        }).join("") + "</ul></div>" +
        (boletins.length ? '<div class="aside-box"><h3>Boletins anteriores</h3><ol class="ranked">' +
          boletins.slice(0, 8).map(function (n) { return '<li><a href="#/noticia/' + esc(n.slug) + '">' + esc(n.titulo) + "</a></li>"; }).join("") + "</ol></div>" : "") +
      "</aside></section>";
  };

  /* ---------- Locações ---------- */
  pages.locacoes = function () {
    titulo("Locação de Espaços");
    var l = C.get("locacoes") || [];
    var i = C.get("info");
    return pageHero("Locação de espaços", "Espaços para reuniões, cursos, festas, shows e eventos agropecuários.", "assets/img/leilao.jpg", [{ t: "Serviços" }, { t: "Locações" }]) +
      '<section class="section wrap">' +
      '<div class="note reveal">Associados têm desconto na locação. Orçamentos e reservas pelo telefone ' + esc(i.telefone) + " ou WhatsApp " + esc(i.whatsapp) + ".</div>" +
      (l.length ? '<div class="news-list mt">' + l.map(function (x, k) {
        return '<article class="space-card full reveal" id="' + esc(U.slugify(x.nome)) + '" style="--d:' + (k % 3 * 60) + 'ms">' +
          '<div class="img"><img src="' + esc(U.img(x.img || "assets/img/sede.jpg")) + '" alt="' + U.attr(x.nome) + '" loading="lazy" decoding="async"></div>' +
          '<div class="body"><h3>' + esc(x.nome) + "</h3>" +
          '<span class="cap"><b class="num">' + esc(x.capacidade) + "</b> pessoas</span>" +
          '<span class="loc">' + I.pin + "<span>" + esc(x.local) + "</span></span>" +
          "<ul>" + U.linhas(x.itens).map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("") + "</ul>" +
          '<div class="row-btn"><a class="btn btn-primary btn-sm" href="' + SRJ.wa("Olá! Gostaria de um orçamento para locação do espaço: " + x.nome) + '" target="_blank" rel="noopener">' + I.wa + " Pedir orçamento</a>" +
          '<a class="btn btn-ghost btn-sm" href="#/contato">Contato</a></div></div></article>';
      }).join("") + "</div>" : vazio("Nenhum espaço cadastrado.")) + "</section>";
  };

  /* ---------- Cursos ---------- */
  pages.cursos = function () {
    titulo("Cursos e Treinamentos");
    var cu = C.get("cursos");
    var links = C.get("links") || [];
    var cert = links.filter(function (l) { return /certificado/i.test(l.nome); })[0];
    var posts = noticias().filter(function (n) { return n.cat === "Cursos"; });
    return pageHero("Cursos e treinamentos", cu.chamada, "assets/img/trabalhador.jpg", [{ t: "Serviços" }, { t: "Cursos" }]) +
      '<section class="section wrap grid-2-1">' +
      '<div class="reveal">' + sec("Como funciona") +
      '<ol class="steps">' + (cu.passos || []).map(function (p, k) {
        return '<li style="--i:' + k + '"><span class="n">' + (k + 1) + "</span><div><h3>" + esc(p.titulo) + "</h3><p>" + esc(p.texto) + "</p></div></li>";
      }).join("") + "</ol>" +
      (posts.length ? '<div class="sec-head mt"><h2>Turmas e avisos</h2></div><div class="news-list two">' + posts.map(function (n) { return card(n); }).join("") + "</div>"
        : '<div class="panel soft mt"><h3>Próximas turmas</h3><p>As novas turmas são anunciadas aqui e nas redes sociais. Deixe seu interesse com o mobilizador Senar para ser avisado.</p></div>') +
      "</div>" +
      '<aside class="reveal" style="--d:80ms">' +
      '<div class="aside-box"><h3>Inscrições</h3><p>Fale com o mobilizador Senar do Sindicato ou compareça à sede.</p>' +
      '<a class="btn btn-primary full" href="' + SRJ.wa("Olá! Tenho interesse nos cursos do Senar pelo Sindicato Rural de Jataí.") + '" target="_blank" rel="noopener">' + I.wa + " Quero me inscrever</a></div>" +
      (cert ? '<div class="aside-box"><h3>Certificado Senar</h3><p>' + esc(cert.desc) + '</p><a class="btn btn-ghost full" href="' + esc(cert.url) + '" target="_blank" rel="noopener">' + I.ribbon + " Emitir certificado</a></div>" : "") +
      "</aside></section>";
  };

  /* ---------- Balcão de emprego ---------- */
  pages["balcao-de-emprego"] = function () {
    titulo("Balcão de Emprego Rural");
    return pageHero("Balcão de Emprego Rural", "Preencha o currículo on-line. Os registros são gerenciados pelo Sindicato e encaminhados a produtores rurais e empresas.", "assets/img/gal-1.jpg", [{ t: "Serviços" }, { t: "Balcão de Emprego" }]) +
      '<section class="section wrap grid-2-1">' +
      '<form class="form panel reveal" id="form-balcao" novalidate>' +
        "<h2>Currículo on-line</h2>" +
        '<div class="row"><label>Nome completo *<input name="nome" required autocomplete="name" maxlength="120"></label>' +
        '<label>CPF *<input name="cpf" required inputmode="numeric" placeholder="000.000.000-00" maxlength="18"></label></div>' +
        '<div class="row"><label>Data de nascimento<input name="nascimento" type="date"></label>' +
        '<label>Estado civil<select name="estado_civil"><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>União estável</option><option>Divorciado(a)</option><option>Viúvo(a)</option></select></label></div>' +
        '<div class="row"><label>Telefone / WhatsApp *<input name="telefone" required inputmode="tel" autocomplete="tel" maxlength="20"></label>' +
        '<label>E-mail<input name="email" type="email" autocomplete="email" maxlength="120"></label></div>' +
        '<label>Endereço completo *<input name="endereco" required autocomplete="street-address" maxlength="200"></label>' +
        '<div class="row"><label>Área de atuação / função *<input name="funcao" required placeholder="Ex.: tratorista, vaqueiro, caseiro" maxlength="120"></label>' +
        '<label>Situação profissional<select name="situacao"><option>Desempregado(a)</option><option>Empregado(a)</option></select></label></div>' +
        '<div class="row"><label>Disposição para residir na fazenda<select name="residir"><option>Sim</option><option>Não</option></select></label>' +
        '<label>Filhos<input name="filhos" placeholder="Quantos e idades" maxlength="80"></label></div>' +
        '<label>Cursos ou capacitações<textarea name="cursos" maxlength="800" placeholder="Cursos do Senar, CNH, NR-31, etc."></textarea></label>' +
        '<label>Experiências profissionais<textarea name="experiencia" maxlength="1200" placeholder="Fazendas ou empresas anteriores, funções e tempo de trabalho"></textarea></label>' +
        '<div class="row"><label>Referência<input name="referencia" maxlength="120"></label>' +
        '<label>Telefone da referência<input name="ref_telefone" inputmode="tel" maxlength="20"></label></div>' +
        '<label class="check"><input type="checkbox" name="aceite" required> Autorizo o Sindicato Rural de Jataí a compartilhar meus dados com empregadores rurais.</label>' +
        '<div class="actions"><button class="btn btn-primary" type="submit">' + I.briefcase + " Enviar currículo</button><span class=\"hint\">* campos obrigatórios</span></div>" +
        '<div class="form-msg"></div></form>' +
      '<aside class="reveal" style="--d:80ms">' +
      '<div class="aside-box"><h3>Para empregadores</h3><p>Precisa de mão de obra? O Sindicato encaminha currículos compatíveis com a vaga, sem custo.</p>' +
      '<a class="btn btn-primary full" href="' + SRJ.wa("Olá! Sou empregador e tenho uma vaga rural para divulgar no Balcão de Emprego.") + '" target="_blank" rel="noopener">' + I.wa + " Divulgar vaga</a></div>" +
      "</aside></section>";
  };

  /* ---------- Eventos ---------- */
  pages.eventos = function () {
    titulo("Eventos");
    var ev = noticias().filter(function (n) { return n.cat === "Eventos"; });
    var n = proximoLeilao();
    var info = C.get("info");
    return pageHero("Eventos e agenda", "Leilões semanais, dias de campo, palestras e ações solidárias.", "assets/img/cerrado.jpg", [{ t: "Serviços" }, { t: "Eventos" }]) +
      '<section class="section wrap grid-2-1">' +
      '<div class="reveal">' + sec("Agenda") + (ev.length ? '<ul class="ev-list">' + ev.map(evItem).join("") + "</ul>" : vazio("Nenhum evento publicado.")) + "</div>" +
      '<aside class="reveal" style="--d:80ms"><div class="live-card">' +
      '<span class="badge"><span class="dot"></span>' + (n.live ? "Ao vivo agora" : "Toda quarta") + "</span>" +
      '<div class="when">Leilão de gado · ' + ("0" + n.at.getDate()).slice(-2) + "/" + ("0" + (n.at.getMonth() + 1)).slice(-2) + " às 19h30</div>" +
      '<p class="sub">' + esc(info.parque.split("—")[0]) + "</p>" +
      '<div class="links"><a class="btn btn-light btn-sm" href="#/leilao">Regulamento</a>' +
      (info.youtube ? '<a class="btn btn-outline-w btn-sm" href="' + esc(info.youtube) + '" target="_blank" rel="noopener">' + I.play + " Ao vivo</a>" : "") + "</div></div>" +
      '<div class="aside-box mt"><h3>Quer realizar um evento?</h3><p>Associados alugam os espaços do Parque de Exposições com desconto.</p><a class="btn btn-ghost full" href="#/locacoes">Ver espaços</a></div>' +
      "</aside></section>";
  };

  /* ---------- Equoterapia ---------- */
  pages.equoterapia = function () {
    titulo("Equoterapia");
    var e = C.get("equoterapia");
    var equipe = (C.get("equipe") || []).filter(function (p) { return /equoterapia/i.test(p.setor || ""); });
    return pageHero(e.nome, "Serviço gratuito criado em " + e.desde + ": terapia com cavalos para o desenvolvimento físico, emocional, social e cognitivo.", "assets/img/equoterapia.jpg", [{ t: "Serviços" }, { t: "Equoterapia" }]) +
      '<section class="section wrap grid-2-1">' +
      '<div class="prose reveal">' +
        "<p>O " + esc(e.nome) + ", criado em " + esc(e.desde) + ", funciona como uma instituição de transformação comunitária, com abordagem terapêutica e educacional.</p>" +
        "<p>" + esc(e.texto) + "</p>" +
        "<h2>Para quem é indicada</h2><ul>" + U.linhas(e.indicacoes).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<h2>Como participar</h2><p>O ingresso é feito por avaliação da equipe. Procure a coordenação na sede do Sindicato ou pelo WhatsApp, levando laudo médico e documentos do praticante. Todos os atendimentos são gratuitos.</p>" +
        "<h2>Como ajudar</h2><p>O centro se mantém com o apoio do Sindicato, de voluntários e de ações solidárias. Empresas e produtores podem apoiar com doações e patrocínio.</p>" +
      "</div>" +
      '<aside class="reveal" style="--d:80ms">' +
      '<div class="aside-box"><h3>Em números</h3><div class="stats">' +
        statBox(e.praticantes, "praticantes ativos") + statBox(e.familias + "+", "famílias atendidas") +
        statBox(e.cavalos, "cavalos") + statBox((+e.contratados) + (+e.voluntarios), "profissionais") + "</div></div>" +
      (equipe.length ? '<div class="aside-box"><h3>Equipe</h3><ul class="plain">' + equipe.map(function (p) {
        return "<li><b>" + esc(p.nome) + "</b> <span>· " + esc(p.cargo) + "</span></li>";
      }).join("") + "</ul></div>" : "") +
      '<div class="aside-box"><h3>Contato</h3><a class="btn btn-primary full" href="' + SRJ.wa("Olá! Gostaria de informações sobre a Equoterapia Primeiro Passo.") + '" target="_blank" rel="noopener">' + I.wa + " Falar com a coordenação</a></div>" +
      "</aside></section>";
  };
  function afterEquoterapia() { contadores(); }

  /* ---------- Notícias ---------- */
  pages.noticias = function (parts, q) {
    titulo("Notícias");
    var cat = q.get("cat") || "", busca = U.semAcento(q.get("q") || "");
    var todas = noticias();
    var list = todas;
    if (cat) list = list.filter(function (n) { return n.cat === cat; });
    if (busca) list = list.filter(function (n) {
      return U.semAcento(n.titulo + " " + n.resumo + " " + (n.tags || []).join(" ")).indexOf(busca) >= 0;
    });
    var cats = [""].concat(SRJ.CATEGORIAS.filter(function (c) {
      return todas.some(function (n) { return n.cat === c; });
    }));
    State.listaFiltrada = list;
    return pageHead("Notícias e avisos", "Artigos, cotações, editais, eventos e informações para a comunidade rural de Jataí.", [{ t: "Notícias" }]) +
      '<section class="wrap"><div class="filters">' +
      cats.map(function (c) {
        return '<a class="chip' + (c === cat ? " on" : "") + '" href="#/noticias' + (c ? "?cat=" + encodeURIComponent(c) : "") + '">' + esc(c || "Todas") + "</a>";
      }).join("") +
      '<span class="count">' + list.length + " publicaç" + (list.length === 1 ? "ão" : "ões") + "</span></div>" +
      (q.get("q") ? '<p class="note">Resultados para “' + esc(q.get("q")) + "”.</p>" : "") +
      (list.length ? '<div class="news-list" id="news-list">' + list.slice(0, State.lista).map(function (n, k) { return card(n); }).join("") + "</div>" +
        (list.length > State.lista ? '<div class="load-more"><button type="button" class="btn btn-ghost" id="list-more">Carregar mais</button></div>' : "")
        : vazio("Nenhuma publicação encontrada.", '<a class="btn btn-ghost" href="#/noticias">Limpar filtros</a>')) +
      "</section>";
  };
  function afterNoticias() {
    var b = $("#list-more");
    if (!b) return;
    b.addEventListener("click", function () {
      State.lista += 9;
      var list = State.listaFiltrada || [];
      $("#news-list").innerHTML = list.slice(0, State.lista).map(function (n) { return card(n); }).join("");
      if (State.lista >= list.length) b.parentElement.remove();
      observar();
    });
  }
  pages.busca = pages.noticias;

  pages.tag = function (parts) {
    var tag = decodeURIComponent(parts[1] || "");
    titulo("Tag: " + tag);
    var list = noticias().filter(function (n) {
      return (n.tags || []).some(function (t) { return U.semAcento(t) === U.semAcento(tag); });
    });
    return pageHead("#" + tag, list.length + " publicaç" + (list.length === 1 ? "ão" : "ões") + " com esta tag.", [{ t: "Notícias", href: "#/noticias" }, { t: tag }]) +
      '<section class="wrap">' + (list.length ? '<div class="news-list">' + list.map(function (n) { return card(n); }).join("") + "</div>"
        : vazio("Nenhuma publicação com esta tag.", '<a class="btn btn-ghost" href="#/noticias">Ver todas</a>')) + "</section>";
  };

  /* ---------- Matéria ---------- */
  pages.noticia = function (parts) {
    var n = acharNoticia(parts[1]);
    if (!n) {
      titulo("Publicação não encontrada");
      return pageHead("Publicação não encontrada", "Ela pode ter sido removida ou o endereço está incorreto.") +
        '<section class="wrap"><a class="btn btn-primary" href="#/noticias">Ver todas as notícias</a></section>';
    }
    titulo(n.titulo);
    var rel = noticias().filter(function (x) {
      return x.slug !== n.slug && (x.cat === n.cat || (x.tags || []).some(function (t) { return (n.tags || []).indexOf(t) >= 0; }));
    }).slice(0, 4);
    var url = location.href;
    var corpo = n.html ? U.sanitize(n.html) : "";
    var i = C.get("info");
    return '<div class="wrap">' +
      '<header class="article-head">' + crumbs([{ t: "Notícias", href: "#/noticias" }, { t: n.cat, href: "#/noticias?cat=" + encodeURIComponent(n.cat) }]) +
        kick(n) + "<h1>" + esc(n.titulo) + "</h1>" +
        (n.resumo ? '<p class="lead">' + esc(n.resumo) + "</p>" : "") +
        '<div class="byline"><div class="av">' + esc(iniciais(n.autor) || "SRJ") + "</div>" +
        "<div><b>" + esc(n.autor) + "</b><small>Publicado em " + U.fmtLong(n.data) + "</small></div></div></header>" +
      (n.img ? '<figure class="article-cover"><img src="' + esc(U.img(n.img)) + '" alt="' + U.attr(n.imgAlt || "") + '" decoding="async">' +
        (n.imgLegenda ? "<figcaption>" + esc(n.imgLegenda) + "</figcaption>" : "") + "</figure>" : "") +
      '<div class="article-grid"><article>' +
        '<div class="prose">' + corpo + "</div>" +
        '<div class="post-foot">' +
        ((n.tags || []).length ? '<div class="chips">' + n.tags.map(function (t) {
          return '<a class="chip tag" href="#/tag/' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
        }).join("") + "</div>" : "") +
        '<div class="share"><a class="btn btn-ghost btn-sm" href="https://wa.me/?text=' + encodeURIComponent(n.titulo + " " + url) + '" target="_blank" rel="noopener">' + I.wa + " Compartilhar</a>" +
        '<a class="btn btn-ghost btn-sm" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '" target="_blank" rel="noopener">' + I.fb + " Facebook</a>" +
        '<button type="button" class="btn btn-ghost btn-sm" id="copy-link">' + I.link + " Copiar link</button></div></div></article>" +
      "<aside>" +
        (rel.length ? '<div class="aside-box"><h3>Leia também</h3><ol class="ranked">' + rel.map(function (x) {
          return '<li><a href="#/noticia/' + esc(x.slug) + '">' + esc(x.titulo) + "</a></li>";
        }).join("") + "</ol></div>" : "") +
        '<div class="aside-box"><h3>Fale com o Sindicato</h3><p>' + esc(i.telefone) + " · " + esc(i.whatsapp) + "</p>" +
        '<a class="btn btn-primary full" href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp</a></div>" +
      "</aside></div></div>";
  };
  function afterNoticia() {
    var b = $("#copy-link");
    if (b) b.addEventListener("click", function () {
      var txt = location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { toast("Link copiado."); }, function () { toast(txt); });
      } else {
        var t = document.createElement("textarea");
        t.value = txt; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); toast("Link copiado."); } catch (e) { toast(txt); }
        document.body.removeChild(t);
      }
    });
  }

  /* ---------- Galerias ---------- */
  pages["galeria-fotos"] = function () {
    titulo("Galeria de Fotos");
    var fotos = C.get("fotos") || [];
    State.fotosAtivas = fotos;
    return pageHead("Galeria de fotos", "Registros do Sindicato, do Parque de Exposições, da equoterapia e da história rural de Jataí.", [{ t: "Galerias" }, { t: "Fotos" }]) +
      '<section class="wrap">' + (fotos.length ? '<div class="gal">' + fotos.map(function (f, k) {
        return '<figure data-lb="' + k + '" class="reveal" style="--d:' + (k % 4 * 60) + 'ms"><img src="' + esc(U.img(f.src)) + '" alt="' + U.attr(f.legenda) + '" loading="lazy" decoding="async">' +
          (f.legenda ? "<figcaption>" + esc(f.legenda) + "</figcaption>" : "") + "</figure>";
      }).join("") + "</div>" : vazio("Nenhuma foto publicada ainda.")) + "</section>";
  };
  pages["galeria-videos"] = function () {
    titulo("Galeria de Vídeos");
    var v = C.get("videos") || [];
    var info = C.get("info");
    return pageHead("Galeria de vídeos", "Vídeos institucionais e dos espaços do Sindicato.", [{ t: "Galerias" }, { t: "Vídeos" }]) +
      '<section class="wrap">' +
      (info.youtube ? '<p class="mb"><a class="btn btn-accent" href="' + esc(info.youtube) + '" target="_blank" rel="noopener">' + I.yt + " Canal no YouTube</a></p>" : "") +
      (v.length ? '<div class="news-list">' + v.map(function (x) {
        var id = U.ytId(x.url);
        var thumb = id ? "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg" : "assets/img/sede.jpg";
        return '<article class="card video reveal"><a class="img" href="' + esc(x.url || info.youtube || "#") + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(thumb) + '" alt="" loading="lazy" decoding="async"><span class="playbtn">' + I.play + "</span></a>" +
          '<div class="body"><span class="kick">Vídeo' + (x.data ? ' <span class="cat">· ' + U.fmtLong(x.data) + "</span>" : "") + "</span>" +
          "<h3>" + esc(x.titulo) + "</h3>" + (x.desc ? "<p>" + esc(x.desc) + "</p>" : "") + "</div></article>";
      }).join("") + "</div>" : vazio("Nenhum vídeo cadastrado ainda.", info.youtube ? '<a class="btn btn-ghost" href="' + esc(info.youtube) + '" target="_blank" rel="noopener">Ver o canal no YouTube</a>' : "")) +
      "</section>";
  };

  /* ---------- Convênios ---------- */
  pages.convenios = function () {
    titulo("Clube de Vantagens");
    var cv = C.get("convenios") || [];
    var ben = C.get("beneficios") || [];
    return pageHero("Clube de Vantagens", "Parcerias e benefícios exclusivos para associados com anuidade em dia.", "assets/img/exata.jpg", [{ t: "Sócios" }, { t: "Convênios" }]) +
      '<section class="section wrap">' +
      (cv.length ? '<div class="news-list">' + cv.map(function (c, k) {
        var link = c.link || "";
        return '<article class="card' + (c.img ? "" : " no-img") + ' reveal" style="--d:' + (k % 3 * 60) + 'ms">' +
          (c.img ? '<div class="img"><img src="' + esc(U.img(c.img)) + '" alt="" loading="lazy" decoding="async"></div>' : "") +
          '<div class="body"><span class="kick">' + esc(c.area) + "</span><h3>" + esc(c.nome) + "</h3>" +
          '<p class="long">' + esc(c.beneficio) + "</p>" +
          (link ? '<a class="maislink" href="' + esc(link) + '"' + (/^https?:/.test(link) ? ' target="_blank" rel="noopener"' : "") + ">Saiba mais " + U.inline("right") + "</a>" : "") +
          "</div></article>";
      }).join("") + "</div>" : vazio("Nenhum convênio cadastrado.")) +
      '<div class="cta-band mt reveal"><div><h2>Ainda não é associado?</h2>' +
      '<ul class="ben">' + ben.slice(0, 6).map(function (b) { return "<li>" + I.check + "<span>" + esc(b.titulo) + "</span></li>"; }).join("") + "</ul></div>" +
      '<div class="act"><a class="btn btn-accent" href="#/associe-se">Quero me associar ' + I.right + "</a></div></div></section>";
  };

  /* ---------- Associe-se ---------- */
  pages["associe-se"] = function () {
    titulo("Seja um Novo Associado");
    var ben = C.get("beneficios") || [];
    return pageHero("Seja um novo associado", "Tenha acesso a uma gama de benefícios exclusivos.", "assets/img/trabalhador.jpg", [{ t: "Sócios" }, { t: "Novo Associado" }]) +
      '<section class="section wrap grid-2-1">' +
      '<form class="form panel reveal" id="form-assoc" novalidate><h2>Pré-cadastro</h2>' +
        '<p class="note">Estas informações destinam-se apenas ao pré-cadastro e não garantem automaticamente a associação. Nossa equipe entrará em contato para finalizar o processo conforme o estatuto.</p>' +
        '<div class="row"><label>Nome completo *<input name="nome" required autocomplete="name" maxlength="120"></label>' +
        '<label>CPF ou CNPJ *<input name="documento" required maxlength="20"></label></div>' +
        '<div class="row"><label>Telefone / WhatsApp *<input name="telefone" required inputmode="tel" maxlength="20"></label>' +
        '<label>E-mail<input name="email" type="email" maxlength="120"></label></div>' +
        '<div class="row"><label>Nome da propriedade<input name="propriedade" maxlength="120"></label>' +
        '<label>Município<input name="municipio" value="Jataí" maxlength="80"></label></div>' +
        '<div class="row"><label>Atividade principal<select name="atividade"><option>Pecuária de corte</option><option>Pecuária de leite</option><option>Agricultura — grãos</option><option>Cana-de-açúcar</option><option>Suinocultura</option><option>Outra</option></select></label>' +
        '<label>Área (hectares)<input name="area" inputmode="numeric" maxlength="12"></label></div>' +
        '<label>Observações<textarea name="obs" maxlength="800"></textarea></label>' +
        '<div class="actions"><button class="btn btn-accent" type="submit">' + I.userplus + " Enviar pré-cadastro</button><span class=\"hint\">* campos obrigatórios</span></div>" +
        '<div class="form-msg"></div></form>' +
      '<aside class="reveal" style="--d:80ms"><div class="aside-box"><h3>Benefícios do associado</h3><ul class="checklist">' +
      ben.map(function (b) { return "<li>" + I.check + "<span>" + esc(b.titulo) + "</span></li>"; }).join("") + "</ul></div></aside></section>";
  };

  /* ---------- Leilão ---------- */
  pages.leilao = function () {
    titulo("Leilão de Gado");
    var L = C.get("leilao");
    var n = proximoLeilao();
    var info = C.get("info");
    var leiloes = noticias().filter(function (x) { return /leil/i.test(x.kicker || "") || /leil/i.test(x.titulo); }).slice(0, 4);
    return pageHero("Leilão de gado", "Todas as quartas-feiras, às 19h30, no Parque de Exposições.", "assets/img/leilao.jpg", [{ t: "Leilão" }]) +
      '<section class="section wrap grid-2-1">' +
      '<div class="reveal"><div class="prose"><p>' + esc(L.chamada) + "</p></div>" +
      '<div class="sec-head mt"><h2>Regulamento</h2></div>' +
      '<div class="rules">' + (L.regras || []).map(function (r, k) {
        return '<div class="rule" style="--d:' + (k % 3 * 50) + 'ms"><b>' + esc(r.titulo) + "</b><span>" + esc(r.texto) + "</span></div>";
      }).join("") + "</div>" +
      '<div class="sec-head mt"><h2>Comissões</h2><p class="sub">Associados do SRJ pagam comissão reduzida na compra e na venda.</p></div>' +
      '<div class="panel table-panel"><div class="table-wrap"><table class="comm"><thead><tr><th>Operação</th><th>Associado</th><th>Não associado</th></tr></thead><tbody>' +
      (L.comissoes || []).map(function (c) {
        return "<tr><td>" + esc(c.operacao) + '</td><td class="num destaque">' + esc(c.associado) + '</td><td class="num">' + esc(c.naoAssociado) + "</td></tr>";
      }).join("") + "</tbody></table></div></div></div>" +
      '<aside class="reveal" style="--d:80ms"><div class="live-card">' +
      '<span class="badge"><span class="dot"></span>' + (n.live ? "Ao vivo agora" : "Próximo leilão") + "</span>" +
      '<div class="when">' + U.DIAS[n.at.getDay()] + ", " + ("0" + n.at.getDate()).slice(-2) + "/" + ("0" + (n.at.getMonth() + 1)).slice(-2) + " às 19h30</div>" +
      '<p class="sub">' + esc(info.parque) + "</p>" +
      (info.youtube ? '<div class="links"><a class="btn btn-light btn-sm" href="' + esc(info.youtube) + '" target="_blank" rel="noopener">' + I.play + " Assistir ao vivo</a></div>" : "") + "</div>" +
      '<div class="aside-box mt"><h3>Inscreva seu gado</h3><p>Fale com o responsável pelo leilão na sede do Sindicato.</p>' +
      '<a class="btn btn-primary full" href="' + SRJ.wa("Olá! Quero inscrever animais no leilão de gado.") + '" target="_blank" rel="noopener">' + I.wa + " Falar sobre o leilão</a></div>" +
      (leiloes.length ? '<div class="aside-box"><h3>Últimos leilões</h3><ol class="ranked">' + leiloes.map(function (x) {
        return '<li><a href="#/noticia/' + esc(x.slug) + '">' + esc(x.titulo) + "</a></li>";
      }).join("") + "</ol></div>" : "") +
      "</aside></section>";
  };

  /* ---------- Contato ---------- */
  pages.contato = function () {
    titulo("Contato");
    var i = C.get("info");
    function item(ic, t, v) {
      return '<div class="c-item"><span class="ico">' + ic + "</span><div><b>" + t + "</b>" + v + "</div></div>";
    }
    return pageHead("Contato", "Estamos na " + i.endereco + ". " + i.horario + ".", [{ t: "Contato" }]) +
      '<section class="wrap contact-grid">' +
      '<div class="panel reveal">' +
        item(I.pin, "Endereço", esc(i.endereco) + "<br>" + esc(i.cidade) + " — " + esc(i.cep) + '<br><a href="' + SRJ.mapa() + '" target="_blank" rel="noopener">Abrir no Google Maps</a>') +
        item(I.phone, "Telefone", '<a href="' + SRJ.tel() + '">' + esc(i.telefone) + "</a>") +
        item(I.wa, "WhatsApp", '<a href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + esc(i.whatsapp) + "</a>") +
        item(I.mail, "E-mail", '<a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a>" + (i.email2 ? '<br><a href="mailto:' + esc(i.email2) + '">' + esc(i.email2) + "</a>" : "")) +
        item(I.clock, "Atendimento", esc(i.horario)) +
        item(I.gavel, "Parque de Exposições", esc(i.parque)) +
        '<div class="soc-row">' +
        (i.instagram ? '<a class="btn btn-ghost btn-sm" href="' + esc(i.instagram) + '" target="_blank" rel="noopener">' + I.ig + " Instagram</a>" : "") +
        (i.facebook ? '<a class="btn btn-ghost btn-sm" href="' + esc(i.facebook) + '" target="_blank" rel="noopener">' + I.fb + " Facebook</a>" : "") +
        (i.youtube ? '<a class="btn btn-ghost btn-sm" href="' + esc(i.youtube) + '" target="_blank" rel="noopener">' + I.yt + " YouTube</a>" : "") +
        "</div></div>" +
      '<form class="form panel reveal" id="form-contato" novalidate style="--d:80ms"><h2>Envie uma mensagem</h2>' +
        '<div class="row"><label>Nome *<input name="nome" required autocomplete="name" maxlength="120"></label>' +
        '<label>E-mail *<input name="email" type="email" required autocomplete="email" maxlength="120"></label></div>' +
        '<div class="row"><label>Telefone<input name="telefone" inputmode="tel" maxlength="20"></label>' +
        '<label>Assunto<select name="assunto"><option>Informações gerais</option><option>Associação</option><option>Locação de espaço</option><option>Leilão</option><option>Cursos Senar</option><option>Equoterapia</option><option>Balcão de Emprego</option><option>Imprensa</option></select></label></div>' +
        '<label>Mensagem *<textarea name="mensagem" required maxlength="2000"></textarea></label>' +
        '<div class="actions"><button class="btn btn-primary" type="submit">' + I.mail + " Enviar mensagem</button>" +
        '<a class="btn btn-ghost" href="' + SRJ.wa() + '" target="_blank" rel="noopener">' + I.wa + " Prefiro WhatsApp</a></div>" +
        '<div class="form-msg"></div></form></section>';
  };

  /* ---------- Informações do agro ---------- */
  pages["informacoes-do-agro"] = function () {
    titulo("Informações do Agro");
    var links = C.get("links") || [];
    return pageHead("Informações do Agro", "Serviços e fontes oficiais mais usados pelo produtor, reunidos em um só lugar.", [{ t: "Informações do Agro" }]) +
      '<section class="wrap">' +
      (links.length ? '<div class="linkcards">' + links.map(function (l, k) {
        return '<a class="linkcard reveal" href="' + esc(l.url) + '" target="_blank" rel="noopener" style="--d:' + (k % 3 * 60) + 'ms">' +
          '<span class="ico">' + (I[l.icone] || I.doc) + "</span>" +
          "<span><b>" + esc(l.nome) + "</b><small>" + esc(l.desc) + "</small></span>" + U.inline("right") + "</a>";
      }).join("") + "</div>" : vazio("Nenhum link cadastrado.")) +
      '<div class="sec-head mt"><h2>Últimas do agro</h2><a class="all" href="#/noticias">Todas</a></div>' +
      '<div class="news-list">' + comImagem(noticias()).slice(0, 6).map(function (n) { return card(n); }).join("") + "</div></section>";
  };

  /* ---------- Mapa do site ---------- */
  pages["mapa-do-site"] = function () {
    titulo("Mapa do site");
    return pageHead("Mapa do site", "Todas as páginas do portal.") +
      '<section class="wrap"><div class="sitemap">' + PAGINAS.map(function (p, k) {
        return '<a href="' + p.rota + '" class="reveal" style="--d:' + (k % 3 * 40) + 'ms"><b>' + esc(p.titulo) + "</b><small>" + esc(p.desc) + "</small></a>";
      }).join("") + "</div></section>";
  };

  /* ---------- 404 ---------- */
  pages.notfound = function () {
    titulo("Página não encontrada");
    return pageHead("Página não encontrada", "O endereço pode estar incorreto ou a página foi removida.") +
      '<section class="wrap"><div class="row-btn"><a class="btn btn-primary" href="#/">Voltar ao início</a>' +
      '<a class="btn btn-ghost" href="#/mapa-do-site">Ver o mapa do site</a></div></section>';
  };

  /* ---------- Redação (carregada sob demanda) ---------- */
  pages.redacao = function () {
    titulo("Redação");
    if (!SRJ.Admin) {
      carregarAdmin();
      return '<section class="wrap"><div class="carregando"><span class="spin"></span> Carregando o painel…</div></section>';
    }
    return SRJ.Admin.render(State.rota.parts);
  };
  var adminCarregando = false;
  function carregarAdmin() {
    if (adminCarregando || SRJ.Admin) return;
    adminCarregando = true;
    var s = document.createElement("script");
    s.src = "js/admin.js?v=12";
    s.onload = function () { adminCarregando = false; if (State.rota.parts[0] === "redacao") render(); };
    s.onerror = function () {
      adminCarregando = false;
      $("#app").innerHTML = '<section class="wrap">' + vazio("Não foi possível carregar o painel. Verifique se o arquivo js/admin.js está no servidor.") + "</section>";
    };
    document.head.appendChild(s);
  }

  /* =====================================================================
     Formulários públicos → e-mail do sindicato
     ===================================================================== */
  function ligarFormulario(sel, tipo, montar) {
    var f = $(sel);
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var d = {};
      Array.prototype.forEach.call(new FormData(f).entries ? new FormData(f) : [], function () {});
      var fd = new FormData(f);
      if (fd.forEach) fd.forEach(function (v, k) { d[k] = v; });
      var texto = montar(d);
      var info = C.get("info");
      var btn = $("button[type=submit]", f);
      var msg = $(".form-msg", f);
      btn.disabled = true;
      btn.classList.add("loading-btn");
      Store.enviarMensagem({
        tipo: tipo, nome: d.nome || "", telefone: d.telefone || "", email: d.email || "", resumo: texto
      }).then(function (r) {
        var assunto = "[Site] " + tipo + (d.nome ? " — " + d.nome : "");
        var mailto = "mailto:" + info.email + "?subject=" + encodeURIComponent(assunto) + "&body=" + encodeURIComponent(texto);
        var enviouEmail = r && r.email;
        msg.innerHTML = '<div class="ok"><b>' + (enviouEmail ? "Mensagem enviada para o Sindicato." : "Recebemos suas informações.") + "</b>" +
          "<p>" + (enviouEmail ? "Nossa equipe responde em horário comercial. Se preferir, fale agora mesmo:" : "Para concluir o envio, escolha um canal:") + "</p>" +
          '<div class="row-btn">' +
          '<a class="btn btn-primary btn-sm" href="' + SRJ.wa(texto) + '" target="_blank" rel="noopener">' + I.wa + " Enviar pelo WhatsApp</a>" +
          '<a class="btn btn-ghost btn-sm" href="' + mailto + '">' + I.mail + " Enviar por e-mail</a></div></div>";
        f.reset();
        btn.disabled = false;
        btn.classList.remove("loading-btn");
        msg.scrollIntoView({ block: "nearest", behavior: "smooth" });
        toast(enviouEmail ? "Mensagem enviada." : "Dados registrados.");
      }).catch(function (err) {
        btn.disabled = false;
        btn.classList.remove("loading-btn");
        var mailto = "mailto:" + info.email + "?subject=" + encodeURIComponent("[Site] " + tipo) + "&body=" + encodeURIComponent(texto);
        msg.innerHTML = '<div class="note"><b>Não foi possível enviar automaticamente.</b><p>' + esc(err.message) + "</p>" +
          '<div class="row-btn"><a class="btn btn-primary btn-sm" href="' + SRJ.wa(texto) + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp</a>" +
          '<a class="btn btn-ghost btn-sm" href="' + mailto + '">' + I.mail + " E-mail</a></div></div>";
      });
    });
  }
  function linhasTexto(obj, rotulos) {
    var out = [];
    for (var k in rotulos) {
      if (Object.prototype.hasOwnProperty.call(rotulos, k) && obj[k]) out.push(rotulos[k] + ": " + obj[k]);
    }
    return out.join("\n");
  }

  /* =====================================================================
     Busca
     ===================================================================== */
  function abrirBusca() {
    var ov = $("#search");
    ov.classList.add("open");
    document.body.classList.add("travado");
    var inp = $("input", ov);
    inp.value = ""; $(".res", ov).innerHTML = "";
    setTimeout(function () { inp.focus(); }, 40);
  }
  function fecharBusca() {
    $("#search").classList.remove("open");
    document.body.classList.remove("travado");
  }
  function renderBusca() {
    var ov = $("#search");
    ov.innerHTML = '<div class="search-box" role="dialog" aria-modal="true" aria-label="Buscar no site">' +
      '<div class="in">' + I.search + '<input type="search" placeholder="Buscar notícias, cotações, serviços…" aria-label="Buscar" autocomplete="off">' +
      '<button type="button" class="icon-btn" aria-label="Fechar busca">' + I.close + "</button></div>" +
      '<div class="res"></div>' +
      '<div class="foot"><span><kbd>Esc</kbd> fecha</span><span><kbd>Enter</kbd> abre o primeiro resultado</span></div></div>';
    var inp = $("input", ov), res = $(".res", ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) fecharBusca(); });
    $("button", ov).addEventListener("click", fecharBusca);
    function buscar() {
      var q = inp.value.trim();
      if (q.length < 2) { res.innerHTML = ""; return; }
      var nq = U.semAcento(q);
      var pg = PAGINAS.filter(function (p) { return U.semAcento(p.titulo + " " + p.desc).indexOf(nq) >= 0; })
        .slice(0, 4).map(function (p) { return { k: "Página", t: p.titulo, d: p.desc, h: p.rota }; });
      var nw = noticias().filter(function (n) {
        return U.semAcento(n.titulo + " " + n.resumo + " " + (n.tags || []).join(" ")).indexOf(nq) >= 0;
      }).slice(0, 8).map(function (n) { return { k: n.cat, t: n.titulo, d: U.fmtLong(n.data), h: "#/noticia/" + n.slug }; });
      var all = pg.concat(nw);
      res.innerHTML = all.length
        ? all.map(function (r) {
            return '<a href="' + r.h + '"><span><b>' + esc(r.t) + "</b><small>" + esc(r.d) + '</small></span><span class="k">' + esc(r.k) + "</span></a>";
          }).join("") + '<a href="#/noticias?q=' + encodeURIComponent(q) + '"><span><b>Ver todos os resultados para “' + esc(q) + '”</b></span><span class="k">Busca</span></a>'
        : '<div class="empty">' + I.search + "<p>Nada encontrado para “" + esc(q) + "”.</p></div>";
    }
    inp.addEventListener("input", buscar);
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var a = $("a", res);
        if (a) { location.hash = a.getAttribute("href"); fecharBusca(); }
      }
    });
    res.addEventListener("click", fecharBusca);
  }

  /* =====================================================================
     Lightbox
     ===================================================================== */
  function ligarLightbox(fotos) {
    State.fotosAtivas = fotos || State.fotosAtivas;
    $$("[data-lb]").forEach(function (f) {
      f.addEventListener("click", function () {
        var p = State.fotosAtivas[+f.dataset.lb];
        if (!p) return;
        var lb = $("#lightbox");
        $("img", lb).src = p.src;
        $("img", lb).alt = p.legenda || "";
        $("figcaption", lb).textContent = p.legenda || "";
        lb.classList.add("open");
        document.body.classList.add("travado");
        $(".close", lb).focus();
      });
    });
  }
  function fecharLightbox() {
    $("#lightbox").classList.remove("open");
    document.body.classList.remove("travado");
  }

  /* =====================================================================
     Animações
     ===================================================================== */
  var obs = null;
  function observar() {
    var alvos = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { alvos.forEach(function (e) { e.classList.add("in"); }); return; }
    if (!obs) {
      obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    }
    alvos.forEach(function (e) { obs.observe(e); });
  }
  function contadores() {
    var els = $$("[data-count]");
    if (!els.length) return;
    var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    els.forEach(function (el) {
      var bruto = el.getAttribute("data-count");
      var alvo = parseFloat(String(bruto).replace(/[^\d.,]/g, "").replace(",", "."));
      if (isNaN(alvo) || reduz) return;
      var sufixo = String(bruto).replace(/[\d.,]/g, "");
      var t0 = null, dur = 900;
      el.textContent = "0" + sufixo;
      function passo(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(alvo * e) + sufixo;
        if (p < 1) requestAnimationFrame(passo);
      }
      if ("IntersectionObserver" in window) {
        var o = new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) { requestAnimationFrame(passo); o.disconnect(); }
        }, { threshold: 0.3 });
        o.observe(el);
      } else requestAnimationFrame(passo);
    });
  }

  /* =====================================================================
     Utilidades globais
     ===================================================================== */
  var toastT = null;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("show"); }, 3400);
  }
  SRJ.toast = toast;
  function titulo(t) { document.title = t ? t + " — Sindicato Rural de Jataí" : "Sindicato Rural de Jataí — Força para o produtor rural"; }
  SRJ.titulo = titulo;

  /* =====================================================================
     Roteador
     ===================================================================== */
  function lerHash() {
    var h = location.hash.replace(/^#/, "") || "/";
    var i = h.indexOf("?");
    var path = i >= 0 ? h.slice(0, i) : h;
    var qs = i >= 0 ? h.slice(i + 1) : "";
    return { path: path, parts: path.split("/").filter(Boolean), q: new URLSearchParams(qs) };
  }

  function render() {
    var r = lerHash();
    State.rota = r;
    var chave = r.parts[0] || "";
    var fn = pages[chave] || pages.notfound;
    if (chave !== "noticias" && chave !== "busca") State.lista = 9;
    if (chave !== "") { State.feed = 8; if (State.pararCarrossel) { State.pararCarrossel(); State.pararCarrossel = null; } }
    if (cdTimer && chave !== "") { clearInterval(cdTimer); cdTimer = null; }

    var app = $("#app");
    app.classList.remove("entrou");
    var html;
    try { html = fn(r.parts, r.q); }
    catch (e) {
      html = pageHead("Erro ao abrir a página", "Tente novamente ou volte ao início.") +
        '<section class="wrap"><div class="note">' + esc(e.message) + '</div><a class="btn btn-primary" href="#/">Início</a></section>';
      if (window.console) console.error(e);
    }
    app.innerHTML = html;
    requestAnimationFrame(function () { app.classList.add("entrou"); });

    /* hooks */
    if (chave === "") afterHome();
    if (chave === "noticias" || chave === "busca") afterNoticias();
    if (chave === "noticia") afterNoticia();
    if (chave === "equoterapia") afterEquoterapia();
    if (chave === "galeria-fotos") ligarLightbox(C.get("fotos") || []);
    if (chave === "balcao-de-emprego") {
      ligarFormulario("#form-balcao", "Currículo — Balcão de Emprego", function (d) {
        return "CURRÍCULO — BALCÃO DE EMPREGO RURAL\n\n" + linhasTexto(d, {
          nome: "Nome", cpf: "CPF", nascimento: "Nascimento", estado_civil: "Estado civil", telefone: "Telefone",
          email: "E-mail", endereco: "Endereço", funcao: "Função", situacao: "Situação", residir: "Reside na fazenda",
          filhos: "Filhos", cursos: "Cursos", experiencia: "Experiência", referencia: "Referência", ref_telefone: "Telefone da referência"
        });
      });
    }
    if (chave === "associe-se") {
      ligarFormulario("#form-assoc", "Pré-cadastro de associado", function (d) {
        return "PRÉ-CADASTRO DE ASSOCIADO\n\n" + linhasTexto(d, {
          nome: "Nome", documento: "CPF/CNPJ", telefone: "Telefone", email: "E-mail", propriedade: "Propriedade",
          municipio: "Município", atividade: "Atividade", area: "Área (ha)", obs: "Observações"
        });
      });
    }
    if (chave === "contato") {
      ligarFormulario("#form-contato", "Contato pelo site", function (d) {
        return "CONTATO — " + (d.assunto || "Informações gerais") + "\n\n" + linhasTexto(d, {
          nome: "Nome", email: "E-mail", telefone: "Telefone", mensagem: "Mensagem"
        });
      });
    }
    if (chave === "redacao" && SRJ.Admin) SRJ.Admin.after(r.parts);

    /* menu ativo */
    $$(".nav a[data-nav]").forEach(function (a) {
      a.classList.toggle("active", a.dataset.nav === "#/" + chave);
    });

    observar();

    /* rolagem */
    var ir = r.q.get("ir");
    if (ir) {
      var el = document.getElementById(ir);
      if (el) { setTimeout(function () { el.scrollIntoView({ block: "start", behavior: "smooth" }); }, 120); return; }
    }
    window.scrollTo(0, 0);
  }
  SRJ.render = render;

  /* =====================================================================
     Eventos globais
     ===================================================================== */
  function ligarGlobais() {
    var hdr = $("#header"), top = $("#to-top"), ultimo = 0;
    window.addEventListener("scroll", function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      hdr.classList.toggle("compact", y > 40);
      top.classList.toggle("show", y > 700);
      ultimo = y;
    }, { passive: true });
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });

    var lb = $("#lightbox");
    lb.addEventListener("click", function (e) {
      if (e.target === lb || (e.target.closest && e.target.closest(".close"))) fecharLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { fecharBusca(); abrirDrawer(false); fecharLightbox(); }
      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === "k") { e.preventDefault(); abrirBusca(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".nav")) {
        $$(".nav li.open").forEach(function (o) {
          o.classList.remove("open");
          var b = $(".top", o); if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
    window.addEventListener("hashchange", render);
  }

  /* =====================================================================
     Início
     ===================================================================== */
  function montarCasca() {
    renderHeader(); renderDrawer(); renderTicker(); renderFooter(); renderBusca();
  }
  SRJ.montarCasca = montarCasca;

  function boot() {
    montarCasca();
    ligarGlobais();
    $("#app").innerHTML = '<section class="wrap"><div class="carregando"><span class="spin"></span> Carregando…</div></section>';

    U.detectarWebp()
      .then(function () { return Store.init(); })
      .then(function () { return C.carregar(); })
      .then(function () { return Store.posts(); })
      .then(function (p) { State.posts = p && p.length ? p : JSON.parse(JSON.stringify(SRJ.postsIniciais)); })
      .catch(function () { State.posts = JSON.parse(JSON.stringify(SRJ.postsIniciais)); })
      .then(function () {
        State.cacheNoticias = null;
        montarCasca();
        render();
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
