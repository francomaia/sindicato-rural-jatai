/* =====================================================================
   Sindicato Rural de Jataí — painel da Redação
   Publicações, mídia, cotações, conteúdo do site, mensagens,
   usuários e segurança. Carregado somente quando o painel é aberto.
   ===================================================================== */
(function () {
  "use strict";

  var U = SRJ.U, $ = U.$, $$ = U.$$, esc = U.esc, I = U.I;
  var Store = SRJ.Store, C = SRJ.Content;
  var toast = SRJ.toast;

  var A = SRJ.Admin = {};
  var E = { post: null, tags: [], dirty: false };

  /* =====================================================================
     Casca do painel
     ===================================================================== */
  var SECOES = [
    { r: "", t: "Painel", i: "grid" },
    { r: "publicacoes", t: "Publicações", i: "doc" },
    { r: "novo", t: "Nova publicação", i: "plus" },
    { r: "midia", t: "Mídia", i: "image" },
    { r: "cotacoes", t: "Cotações", i: "chart" },
    { r: "conteudo", t: "Conteúdo do site", i: "settings" },
    { r: "mensagens", t: "Mensagens", i: "inbox" },
    { r: "usuarios", t: "Usuários", i: "users", admin: true },
    { r: "seguranca", t: "Segurança", i: "shield", admin: true },
    { r: "conta", t: "Minha conta", i: "key" }
  ];

  function casca(ativa, dentro) {
    var u = Store.user;
    var nav = SECOES.filter(function (s) { return !s.admin || Store.ehAdmin(); }).map(function (s) {
      return '<a href="#/redacao' + (s.r ? "/" + s.r : "") + '" class="' + (ativa === s.r ? "on" : "") + '">' + I[s.i] + "<span>" + s.t + "</span></a>";
    }).join("");
    return '<div class="wrap cms">' +
      '<aside class="cms-side">' +
      '<div class="who"><div class="av">' + esc((u.nome || "?").charAt(0).toUpperCase()) + "</div>" +
      "<div><b>" + esc(u.nome) + "</b><small>" + (u.papel === "admin" ? "Administrador" : "Jornalista") + "</small></div></div>" +
      "<nav>" + nav + "</nav>" +
      '<div class="cms-side-foot"><a href="#/" class="quiet">' + I.home + "<span>Ver o site</span></a>" +
      '<button type="button" id="cms-logout" class="quiet">' + I.logout + "<span>Sair</span></button>" +
      '<span class="modo ' + Store.mode + '">' + (Store.mode === "api" ? "Servidor conectado" : "Modo local (este navegador)") + "</span></div>" +
      "</aside>" +
      '<div class="cms-main">' + dentro + "</div></div>";
  }
  function cabecalho(t, acoes, sub) {
    return '<div class="cms-head"><div><h1>' + esc(t) + "</h1>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div>" +
      (acoes ? '<div class="acts">' + acoes + "</div>" : "") + "</div>";
  }

  /* =====================================================================
     Roteamento interno
     ===================================================================== */
  A.render = function (parts) {
    if (!Store.user) return login();
    if (Store.user.trocarSenha) return casca("conta", trocarSenhaObrigatoria());
    var sub = parts[1] || "";
    switch (sub) {
      case "": return casca("", painel());
      case "publicacoes": return casca("publicacoes", listaPosts());
      case "novo": return casca("novo", editor(null));
      case "editar": return casca("publicacoes", editor(acharPost(parts[2])));
      case "midia": return casca("midia", cabecalho("Mídia", botaoUpload(), "Imagens enviadas pelo painel.") + '<div class="panel" id="midia-box"><div class="carregando"><span class="spin"></span> Carregando…</div></div>');
      case "cotacoes": return casca("cotacoes", editorCotacoes());
      case "conteudo": return casca("conteudo", parts[2] ? editorConteudo(parts[2]) : listaConteudo());
      case "mensagens": return casca("mensagens", cabecalho("Mensagens", "", "Envios dos formulários de contato, pré-cadastro e currículo.") + '<div class="panel" id="leads-box"><div class="carregando"><span class="spin"></span> Carregando…</div></div>');
      case "usuarios": return casca("usuarios", Store.ehAdmin() ? usuarios() : semPermissao());
      case "seguranca": return casca("seguranca", Store.ehAdmin() ? seguranca() : semPermissao());
      case "conta": return casca("conta", conta());
      default: return casca("", painel());
    }
  };

  A.after = function (parts) {
    if (!Store.user) { depoisLogin(); return; }
    var lo = $("#cms-logout");
    if (lo) lo.addEventListener("click", function () {
      Store.sair(); toast("Sessão encerrada."); location.hash = "#/";
    });
    if (Store.user.trocarSenha) { depoisConta(true); return; }
    var sub = parts[1] || "";
    if (sub === "novo" || sub === "editar") depoisEditor();
    else if (sub === "midia") depoisMidia();
    else if (sub === "cotacoes") depoisCotacoes();
    else if (sub === "conteudo" && parts[2]) depoisConteudo(parts[2]);
    else if (sub === "mensagens") depoisMensagens();
    else if (sub === "usuarios" && Store.ehAdmin()) depoisUsuarios();
    else if (sub === "seguranca" && Store.ehAdmin()) depoisSeguranca();
    else if (sub === "conta") depoisConta(false);
    else if (sub === "publicacoes" || sub === "") depoisLista();
  };

  function semPermissao() {
    return cabecalho("Acesso restrito") + '<div class="panel"><div class="note">Esta área é exclusiva para administradores.</div></div>';
  }
  function acharPost(id) {
    var l = SRJ.State.posts.filter(function (p) { return p.id === id; });
    return l[0] || null;
  }
  function recarregarPosts() {
    return Store.posts().then(function (p) {
      SRJ.State.posts = p;
      SRJ.State.cacheNoticias = null;
    });
  }

  /* =====================================================================
     Login
     ===================================================================== */
  function login() {
    SRJ.titulo("Redação");
    return '<div class="wrap login-wrap"><div class="panel login">' +
      '<img class="logo" src="assets/logo.png" alt="" width="72" height="72">' +
      "<h1>Redação</h1><p class=\"sub\">Área restrita da equipe do Sindicato.</p>" +
      '<form class="form" id="form-login" novalidate>' +
      '<label>Usuário<input name="usuario" required autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="60"></label>' +
      '<label>Senha<input name="senha" type="password" required autocomplete="current-password" maxlength="100"></label>' +
      '<div class="actions"><button class="btn btn-primary full" type="submit">' + I.key + " Entrar</button></div>" +
      '<div class="form-msg"></div></form>' +
      '<p class="hint">' + (Store.mode === "api"
        ? "Acesso concedido pelo administrador do site."
        : "Demonstração local: <b>admin</b> / <b>srj2026</b>. As alterações ficam salvas neste navegador.") + "</p>" +
      '<p class="hint"><a href="#/">Voltar ao site</a></p>' +
      "</div></div>";
  }
  function depoisLogin() {
    var f = $("#form-login");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var msg = $(".form-msg", f), btn = $("button", f);
      msg.innerHTML = ""; btn.disabled = true;
      Store.entrar(f.usuario.value, f.senha.value)
        .then(function () { return recarregarPosts().catch(function () {}); })
        .then(function () { return C.carregar(); })
        .then(function () {
          toast("Bem-vindo(a), " + Store.user.nome + ".");
          SRJ.montarCasca();
          SRJ.render();
        })
        .catch(function (err) {
          btn.disabled = false;
          msg.innerHTML = '<div class="note">' + esc(err.message) + "</div>";
          f.senha.value = ""; f.senha.focus();
        });
    });
  }

  /* =====================================================================
     Painel inicial
     ===================================================================== */
  function painel() {
    var posts = SRJ.State.posts;
    var pub = posts.filter(function (p) { return p.status !== "rascunho"; }).length;
    var rasc = posts.length - pub;
    var tags = {};
    posts.forEach(function (p) { (p.tags || []).forEach(function (t) { tags[t] = 1; }); });
    var recentes = posts.slice().sort(function (a, b) {
      return (b.atualizado || b.data) > (a.atualizado || a.data) ? 1 : -1;
    }).slice(0, 5);
    var c = C.get("cotacoes");
    var dias = Math.round((Date.now() - U.parseDate(c.data).getTime()) / 86400000);

    return cabecalho("Painel", '<a class="btn btn-accent" href="#/redacao/novo">' + I.plus + " Nova publicação</a>", "Olá, " + Store.user.nome + ".") +
      '<div class="cms-stats">' +
        stat(pub, "publicadas", "doc") + stat(rasc, "rascunhos", "edit") +
        stat(Object.keys(tags).length, "tags", "grid") +
        stat(posts.filter(function (p) { return p.destaque && p.status !== "rascunho"; }).length, "em destaque", "star") +
      "</div>" +
      (dias > 10 ? '<div class="alerta">' + I.chart + "<div><b>As cotações estão de " + U.fmtShort(c.data) + ".</b>" +
        "<span>Faz " + dias + " dias. Atualize o boletim para o site não ficar desatualizado.</span></div>" +
        '<a class="btn btn-primary btn-sm" href="#/redacao/cotacoes">Atualizar agora</a></div>' : "") +
      '<div class="cms-cols">' +
        '<div class="panel"><h3 class="box-title">' + I.doc + "Últimas edições</h3>" +
        (recentes.length ? '<ul class="mini-list">' + recentes.map(function (p) {
          return '<li><a href="#/redacao/editar/' + esc(p.id) + '"><b>' + esc(p.titulo) + "</b>" +
            '<small>' + esc(p.cat) + " · " + (p.atualizado ? U.rel(p.atualizado) : U.fmtShort(p.data)) + "</small></a>" +
            '<span class="status ' + (p.status === "rascunho" ? "draft" : "pub") + '">' + (p.status === "rascunho" ? "rascunho" : "publicado") + "</span></li>";
        }).join("") + "</ul>" : '<p class="quiet-txt">Nenhuma publicação ainda.</p>') + "</div>" +
        '<div class="panel"><h3 class="box-title">' + I.settings + "Atalhos</h3>" +
        '<div class="atalhos">' +
          atalho("#/redacao/novo", "plus", "Escrever matéria") +
          atalho("#/redacao/cotacoes", "chart", "Atualizar cotações") +
          atalho("#/redacao/conteudo", "settings", "Editar conteúdo do site") +
          atalho("#/redacao/midia", "image", "Biblioteca de mídia") +
          atalho("#/redacao/mensagens", "inbox", "Ver mensagens") +
          atalho("#/", "home", "Ver o site") +
        "</div></div>" +
      "</div>";
  }
  function stat(v, l, ic) {
    return '<div class="stat"><span class="si">' + I[ic] + "</span><b class=\"num\">" + v + "</b><small>" + l + "</small></div>";
  }
  function atalho(h, i, t) {
    return '<a href="' + h + '">' + I[i] + "<span>" + esc(t) + "</span></a>";
  }

  /* =====================================================================
     Publicações
     ===================================================================== */
  function listaPosts() {
    var posts = SRJ.State.posts.slice().sort(function (a, b) {
      return (b.atualizado || b.data) > (a.atualizado || a.data) ? 1 : -1;
    });
    return cabecalho("Publicações", '<a class="btn btn-accent" href="#/redacao/novo">' + I.plus + " Nova publicação</a>",
      posts.length + " publicaç" + (posts.length === 1 ? "ão" : "ões") + " no site.") +
      '<div class="panel no-pad">' +
      '<div class="cms-toolbar"><input id="cms-filter" placeholder="Filtrar por título, categoria ou tag…" aria-label="Filtrar publicações">' +
      '<div class="seg" role="tablist"><button type="button" class="on" data-st="">Todas</button>' +
      '<button type="button" data-st="publicado">Publicadas</button><button type="button" data-st="rascunho">Rascunhos</button></div></div>' +
      (posts.length ? '<div class="table-wrap"><table class="post-table"><thead><tr>' +
        "<th></th><th>Título</th><th>Categoria</th><th>Status</th><th>Data</th><th></th></tr></thead>" +
        '<tbody id="cms-rows">' + posts.map(linhaPost).join("") + "</tbody></table></div>" +
        '<div class="cms-foot"><span id="cms-count">' + posts.length + " itens</span></div>"
        : '<div class="vazio">' + I.doc + "<p>Nenhuma publicação ainda.</p><a class=\"btn btn-primary\" href=\"#/redacao/novo\">Criar a primeira</a></div>") +
      "</div>";
  }
  function linhaPost(p) {
    var st = p.status === "rascunho" ? "rascunho" : "publicado";
    var busca = U.semAcento(p.titulo + " " + p.cat + " " + (p.tags || []).join(" ") + " " + (p.autor || ""));
    return '<tr data-id="' + esc(p.id) + '" data-st="' + st + '" data-txt="' + esc(busca) + '">' +
      '<td class="tc">' + (p.img ? '<img class="thumb" src="' + esc(p.img) + '" alt="" loading="lazy">' : '<span class="thumb vazia">' + I.doc + "</span>") + "</td>" +
      '<td class="t"><b>' + esc(p.titulo) + "</b><small>" + esc(p.autor || SRJ.AUTOR_PADRAO) +
      (p.destaque ? " · ★ destaque" : "") + ((p.tags || []).length ? " · " + p.tags.map(function (t) { return "#" + esc(t); }).join(" ") : "") + "</small></td>" +
      "<td>" + esc(p.cat) + "</td>" +
      '<td><span class="status ' + (st === "rascunho" ? "draft" : "pub") + '">' + st + "</span></td>" +
      '<td class="num">' + U.fmtShort(p.data) + "</td>" +
      '<td><div class="acts">' +
      (st === "publicado" ? '<a class="icon-act" href="#/noticia/' + esc(p.slug || p.id) + '" title="Ver no site" aria-label="Ver no site">' + I.eye + "</a>" : "") +
      '<a class="icon-act" href="#/redacao/editar/' + esc(p.id) + '" title="Editar" aria-label="Editar">' + I.edit + "</a>" +
      '<button type="button" class="icon-act perigo" data-del="' + esc(p.id) + '" title="Excluir" aria-label="Excluir">' + I.trash + "</button>" +
      "</div></td></tr>";
  }
  function depoisLista() {
    var rows = $("#cms-rows"), filtro = $("#cms-filter"), st = "";
    function aplicar() {
      if (!rows) return;
      var q = U.semAcento(filtro ? filtro.value : "");
      var n = 0;
      $$("tr", rows).forEach(function (r) {
        var ok = (!st || r.dataset.st === st) && (!q || r.dataset.txt.indexOf(q) >= 0);
        r.hidden = !ok;
        if (ok) n++;
      });
      var c = $("#cms-count"); if (c) c.textContent = n + (n === 1 ? " item" : " itens");
    }
    if (filtro) filtro.addEventListener("input", aplicar);
    $$(".seg [data-st]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".seg [data-st]").forEach(function (x) { x.classList.toggle("on", x === b); });
        st = b.dataset.st; aplicar();
      });
    });
    if (rows) rows.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-del]") : null;
      if (!b) return;
      var p = acharPost(b.dataset.del);
      if (!p || !confirm("Excluir “" + p.titulo + "”?\n\nEsta ação não pode ser desfeita.")) return;
      Store.excluirPost(p.id).then(function () {
        return Store.anotar("excluiu publicação", p.titulo);
      }).then(recarregarPosts).then(function () {
        toast("Publicação excluída."); SRJ.render();
      }).catch(function (err) { toast(err.message); });
    });
  }

  /* =====================================================================
     Editor de publicação
     ===================================================================== */
  function editor(p) {
    var novo = !p;
    if (novo) {
      p = {
        id: U.uid(), titulo: "", kicker: "", cat: "Notícias", tags: [], resumo: "", html: "",
        img: "", imgAlt: "", imgLegenda: "", autor: Store.user.nome || SRJ.AUTOR_PADRAO,
        data: U.todayISO(), status: "rascunho", destaque: false
      };
    } else if (!p.autor) p.autor = SRJ.AUTOR_PADRAO;
    E.post = JSON.parse(JSON.stringify(p));
    E.novo = novo;
    E.tags = (p.tags || []).slice();

    return cabecalho(novo ? "Nova publicação" : "Editar publicação",
      '<a class="btn btn-quiet" href="#/redacao/publicacoes">Voltar</a>' +
      '<button type="button" class="btn btn-ghost" id="ed-draft">' + I.save + " Salvar rascunho</button>" +
      '<button type="button" class="btn btn-accent" id="ed-publish">' + I.check + (p.status === "publicado" ? " Atualizar" : " Publicar") + "</button>") +
      '<form class="editor-grid" id="form-editor" novalidate>' +
      '<div class="col">' +
        '<label class="field"><span>Título *</span><input class="title" id="ed-titulo" value="' + U.attr(p.titulo) + '" placeholder="Título da matéria" maxlength="180" required></label>' +
        '<div class="field"><span>Resumo (linha fina)</span><textarea id="ed-resumo" maxlength="400" placeholder="Um ou dois períodos que resumem a matéria. Aparece nos cards e nos destaques.">' + esc(p.resumo) + "</textarea>" +
        '<small class="conta"><span id="ed-resumo-n">0</span>/400</small></div>' +
        '<div class="field"><span>Texto</span>' +
        '<div class="rte-bar" role="toolbar" aria-label="Formatação do texto">' +
          bt("bold", "Negrito", I.bold) + bt("italic", "Itálico", I.italic) +
          '<span class="sep"></span>' +
          bb("h2", "Título", "H2") + bb("h3", "Subtítulo", "H3") + bb("p", "Parágrafo", "¶") + bb("blockquote", "Citação", I.quote) +
          '<span class="sep"></span>' +
          bt("insertUnorderedList", "Lista", I.list) + bt("insertOrderedList", "Lista numerada", "1.") +
          '<span class="sep"></span>' +
          '<button type="button" id="rte-link" title="Inserir link">' + I.link + "</button>" +
          '<button type="button" id="rte-img" title="Inserir imagem no texto">' + I.image + "</button>" +
          '<button type="button" data-cmd="removeFormat" title="Limpar formatação">' + I.undo + "</button>" +
          '<input type="file" id="rte-file" accept="image/*" hidden></div>' +
        '<div class="rte" id="ed-html" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Escreva a matéria aqui. Formate o texto e insira imagens no meio do conteúdo.">' + U.sanitize(p.html) + "</div>" +
        '<small class="conta">Dica: cole o texto com Ctrl+V — a formatação estranha é removida automaticamente.</small></div>' +
      "</div>" +
      '<div class="col">' +
        '<div class="panel campo-bloco"><h3 class="box-title">' + I.check + "Publicação</h3>" +
          '<div class="field"><span>Status</span><div class="seg" id="ed-status">' +
          '<button type="button" class="' + (p.status !== "publicado" ? "on" : "") + '" data-v="rascunho">Rascunho</button>' +
          '<button type="button" class="' + (p.status === "publicado" ? "on" : "") + '" data-v="publicado">Publicado</button></div></div>' +
          '<label class="field"><span>Data de publicação</span><input type="date" id="ed-data" value="' + esc(p.data) + '"></label>' +
          '<label class="field"><span>Autor</span><input id="ed-autor" value="' + U.attr(p.autor) + '" maxlength="140" list="autores"></label>' +
          '<datalist id="autores">' + autores().map(function (a) { return '<option value="' + U.attr(a) + '"></option>'; }).join("") + "</datalist>" +
          '<label class="field check"><input type="checkbox" id="ed-destaque"' + (p.destaque ? " checked" : "") + ">" +
          "<span>" + I.star + " Destaque na capa</span></label>" +
          '<small class="conta">Destaques com imagem entram no carrossel da página inicial.</small>' +
        "</div>" +
        '<div class="panel campo-bloco"><h3 class="box-title">' + I.grid + "Classificação</h3>" +
          '<label class="field"><span>Categoria</span><select id="ed-cat">' +
          SRJ.CATEGORIAS.map(function (c) { return '<option' + (c === p.cat ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select></label>" +
          '<label class="field"><span>Chapéu</span><input id="ed-kicker" value="' + U.attr(p.kicker) + '" maxlength="60" placeholder="Ex.: Defesa do produtor"></label>' +
          '<div class="field"><span>Tags</span><div class="tag-input" id="ed-tags">' +
          E.tags.map(chipTag).join("") + '<input id="ed-tag-in" placeholder="Digite e tecle Enter" aria-label="Nova tag"></div>' +
          '<small class="conta">Separe com Enter ou vírgula.</small></div>' +
        "</div>" +
        '<div class="panel campo-bloco"><h3 class="box-title">' + I.image + "Imagem de capa</h3>" +
          '<div id="ed-cover">' + (p.img ? capa(p.img) : dropzone()) + "</div>" +
          '<label class="field"><span>Texto alternativo</span><input id="ed-imgalt" value="' + U.attr(p.imgAlt || "") + '" maxlength="180" placeholder="Descreva a imagem"></label>' +
          '<label class="field"><span>Legenda / crédito</span><input id="ed-imgleg" value="' + U.attr(p.imgLegenda || "") + '" maxlength="180" placeholder="Foto: …"></label>' +
        "</div>" +
        '<div class="panel campo-bloco"><h3 class="box-title">' + I.link + 'Endereço</h3><p class="slug-box">#/noticia/<b id="ed-slug">' +
          esc(p.slug || U.slugify(p.titulo) || "…") + "</b></p></div>" +
      "</div></form>";
  }
  function bt(cmd, t, ic) { return '<button type="button" data-cmd="' + cmd + '" title="' + t + '" aria-label="' + t + '">' + ic + "</button>"; }
  function bb(bloco, t, ic) { return '<button type="button" data-block="' + bloco + '" title="' + t + '" aria-label="' + t + '">' + ic + "</button>"; }
  function chipTag(t) {
    return '<span class="chip tag" data-tag="' + U.attr(t) + '">' + esc(t) + '<button type="button" aria-label="Remover tag ' + U.attr(t) + '">×</button></span>';
  }
  function dropzone() {
    return '<label class="dropzone" id="ed-drop">' + I.image +
      "<span>Arraste uma imagem ou clique para escolher</span><small>JPG, PNG ou WebP · até 8 MB</small>" +
      '<input type="file" id="ed-file" accept="image/*"></label>';
  }
  function capa(src) {
    return '<div class="cover-prev"><img src="' + esc(src) + '" alt="">' +
      '<button type="button" class="btn btn-light btn-sm" id="ed-cover-rm">' + I.trash + " Trocar</button></div>";
  }
  function autores() {
    var set = {};
    set[SRJ.AUTOR_PADRAO] = 1;
    if (Store.user && Store.user.nome) set[Store.user.nome] = 1;
    SRJ.State.posts.forEach(function (p) { if (p.autor) set[p.autor] = 1; });
    return Object.keys(set);
  }

  function depoisEditor() {
    var rte = $("#ed-html"), tit = $("#ed-titulo"), resumo = $("#ed-resumo");
    if (!rte) return;

    function contaResumo() { $("#ed-resumo-n").textContent = resumo.value.length; }
    resumo.addEventListener("input", contaResumo); contaResumo();

    tit.addEventListener("input", function () {
      if (E.novo) $("#ed-slug").textContent = U.slugify(tit.value) || "…";
      E.dirty = true;
    });

    $$(".rte-bar [data-cmd]").forEach(function (b) {
      b.addEventListener("mousedown", function (e) { e.preventDefault(); });
      b.addEventListener("click", function () { rte.focus(); document.execCommand(b.dataset.cmd, false, null); E.dirty = true; });
    });
    $$(".rte-bar [data-block]").forEach(function (b) {
      b.addEventListener("mousedown", function (e) { e.preventDefault(); });
      b.addEventListener("click", function () { rte.focus(); document.execCommand("formatBlock", false, b.dataset.block); E.dirty = true; });
    });
    $("#rte-link").addEventListener("click", function () {
      var u = prompt("Endereço do link (https://…)");
      if (u) { rte.focus(); document.execCommand("createLink", false, u); E.dirty = true; }
    });
    $("#rte-img").addEventListener("click", function () { $("#rte-file").click(); });
    $("#rte-file").addEventListener("change", function (e) {
      var f = e.target.files[0];
      if (!f) return;
      toast("Enviando imagem…");
      Store.enviarImagem(f).then(function (url) {
        Store.registrarMidia(url, f.name);
        rte.focus();
        document.execCommand("insertHTML", false,
          '<figure><img src="' + esc(url) + '" alt=""><figcaption>Legenda da imagem</figcaption></figure><p><br></p>');
        E.dirty = true;
        toast("Imagem inserida.");
      }).catch(function (err) { toast(err.message); });
      e.target.value = "";
    });
    rte.addEventListener("input", function () { E.dirty = true; });
    rte.addEventListener("paste", function (e) {
      e.preventDefault();
      var t = (e.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, t);
    });

    $$("#ed-status button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#ed-status button").forEach(function (x) { x.classList.toggle("on", x === b); });
        E.dirty = true;
      });
    });

    /* tags */
    var tagsEl = $("#ed-tags"), tin = $("#ed-tag-in");
    function addTag(v) {
      v = String(v || "").trim().replace(/^#/, "").slice(0, 40);
      if (!v) return;
      var atuais = $$(".chip", tagsEl).map(function (c) { return U.semAcento(c.dataset.tag); });
      if (atuais.indexOf(U.semAcento(v)) >= 0) return;
      tin.insertAdjacentHTML("beforebegin", chipTag(v));
      E.dirty = true;
    }
    tin.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tin.value); tin.value = ""; }
      else if (e.key === "Backspace" && !tin.value) {
        var last = tin.previousElementSibling;
        if (last) last.remove();
      }
    });
    tin.addEventListener("blur", function () { addTag(tin.value); tin.value = ""; });
    tagsEl.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") { e.target.parentElement.remove(); E.dirty = true; }
      else if (e.target === tagsEl) tin.focus();
    });

    /* capa */
    function ligarCapa() {
      var drop = $("#ed-drop"), file = $("#ed-file"), rm = $("#ed-cover-rm");
      if (rm) rm.addEventListener("click", function () {
        E.post.img = ""; $("#ed-cover").innerHTML = dropzone(); ligarCapa(); E.dirty = true;
      });
      if (!drop) return;
      function receber(f) {
        if (!f) return;
        if (!/^image\//.test(f.type)) return toast("Escolha um arquivo de imagem.");
        if (f.size > 8 * 1024 * 1024) return toast("Imagem acima de 8 MB.");
        toast("Enviando imagem…");
        Store.enviarImagem(f).then(function (url) {
          Store.registrarMidia(url, f.name);
          E.post.img = url;
          $("#ed-cover").innerHTML = capa(url);
          ligarCapa(); E.dirty = true;
          toast("Imagem enviada.");
        }).catch(function (err) { toast(err.message); });
      }
      file.addEventListener("change", function (e) { receber(e.target.files[0]); });
      ["dragenter", "dragover"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); });
      });
      drop.addEventListener("drop", function (e) { receber(e.dataTransfer.files[0]); });
    }
    ligarCapa();

    function coletar(status) {
      var titulo = tit.value.trim();
      var tags = $$(".chip", tagsEl).map(function (c) { return c.dataset.tag; });
      var statusFinal = status || ($$("#ed-status button").filter(function (b) { return b.classList.contains("on"); })[0] || {}).dataset.v || "rascunho";
      var slug = E.novo ? (U.slugify(titulo) || E.post.id) : (E.post.slug || U.slugify(titulo) || E.post.id);
      return {
        id: E.post.id, slug: slug, titulo: titulo, kicker: $("#ed-kicker").value.trim(),
        cat: $("#ed-cat").value, tags: tags, resumo: resumo.value.trim(),
        html: U.sanitize(rte.innerHTML), img: E.post.img || "",
        imgAlt: $("#ed-imgalt").value.trim(), imgLegenda: $("#ed-imgleg").value.trim(),
        autor: $("#ed-autor").value.trim() || SRJ.AUTOR_PADRAO,
        data: $("#ed-data").value || U.todayISO(),
        destaque: $("#ed-destaque").checked, status: statusFinal,
        atualizado: new Date().toISOString()
      };
    }
    function salvar(status) {
      var rec = coletar(status);
      if (!rec.titulo) { toast("Informe o título da matéria."); tit.focus(); return; }
      if (!rec.resumo) rec.resumo = U.texto(rec.html).slice(0, 200);
      var conflito = SRJ.State.posts.some(function (n) { return n.slug === rec.slug && n.id !== rec.id; });
      if (conflito) rec.slug += "-" + rec.id.slice(-4);
      var btns = [$("#ed-draft"), $("#ed-publish")];
      btns.forEach(function (b) { b.disabled = true; });
      Store.salvarPost(rec)
        .then(function (saved) {
          return Store.anotar(E.novo ? "criou publicação" : "editou publicação", rec.titulo).then(function () { return saved; });
        })
        .then(function (saved) {
          return recarregarPosts().then(function () { return saved; });
        })
        .then(function (saved) {
          E.dirty = false;
          toast(saved.status === "publicado" ? "Publicado no site." : "Rascunho salvo.");
          location.hash = saved.status === "publicado" ? "#/noticia/" + (saved.slug || saved.id) : "#/redacao/publicacoes";
        })
        .catch(function (err) {
          btns.forEach(function (b) { b.disabled = false; });
          toast(err.message);
        });
    }
    $("#ed-draft").addEventListener("click", function () { salvar("rascunho"); });
    $("#ed-publish").addEventListener("click", function () { salvar("publicado"); });
    $("#form-editor").addEventListener("submit", function (e) { e.preventDefault(); salvar(); });
    $("#form-editor").addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === "s") { e.preventDefault(); salvar(); }
    });
  }

  /* =====================================================================
     Mídia
     ===================================================================== */
  function botaoUpload() {
    return '<label class="btn btn-accent" for="midia-file">' + I.plus + ' Enviar imagem<input type="file" id="midia-file" accept="image/*" hidden multiple></label>';
  }
  function depoisMidia() {
    var box = $("#midia-box"), input = $("#midia-file");
    function carregar() {
      Store.midia().then(function (m) {
        box.innerHTML = m.length
          ? '<div class="media-grid">' + m.map(function (x) {
              return '<figure><img src="' + esc(x.url) + '" alt="" loading="lazy">' +
                '<figcaption><span>' + esc(x.nome || x.url.split("/").pop()) + "</span>" +
                '<span class="acts"><button type="button" class="icon-act" data-copy="' + U.attr(x.url) + '" title="Copiar endereço">' + I.link + "</button>" +
                '<button type="button" class="icon-act perigo" data-del="' + U.attr(x.url) + '" title="Excluir">' + I.trash + "</button></span></figcaption></figure>";
            }).join("") + "</div>"
          : '<div class="vazio">' + I.image + "<p>Nenhuma imagem enviada ainda.</p></div>";
      }).catch(function (e) { box.innerHTML = '<div class="note">' + esc(e.message) + "</div>"; });
    }
    carregar();
    input.addEventListener("change", function (e) {
      var files = Array.prototype.slice.call(e.target.files);
      if (!files.length) return;
      toast("Enviando " + files.length + " imagem(ns)…");
      Promise.all(files.map(function (f) {
        return Store.enviarImagem(f).then(function (url) { return Store.registrarMidia(url, f.name); });
      })).then(function () { toast("Envio concluído."); carregar(); })
        .catch(function (err) { toast(err.message); carregar(); });
      e.target.value = "";
    });
    box.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest("[data-copy]") : null;
      if (c) {
        var v = c.dataset.copy;
        if (navigator.clipboard) navigator.clipboard.writeText(v).then(function () { toast("Endereço copiado."); });
        else toast(v);
        return;
      }
      var d = e.target.closest ? e.target.closest("[data-del]") : null;
      if (d && confirm("Excluir esta imagem?")) {
        Store.excluirMidia(d.dataset.del).then(function () { toast("Imagem excluída."); carregar(); })
          .catch(function (err) { toast(err.message); });
      }
    });
  }

  /* =====================================================================
     Cotações
     ===================================================================== */
  function editorCotacoes() {
    var c = C.get("cotacoes");
    return cabecalho("Cotações do Agro",
      '<button type="button" class="btn btn-accent" id="cot-save">' + I.check + " Salvar boletim</button>",
      "Estes valores alimentam a faixa do topo e a página de cotações.") +
      '<form id="form-cot" class="stack">' +
      '<div class="panel"><div class="row3">' +
        '<label class="field"><span>Data do boletim</span><input type="date" id="cot-data" value="' + esc(c.data) + '"></label>' +
        '<label class="field"><span>Boletim anterior</span><input type="date" id="cot-ant" value="' + esc(c.anterior) + '"></label>' +
        '<label class="field"><span>Dólar (R$)</span><input id="cot-dolar" inputmode="decimal" value="' + esc(String(c.dolar).replace(".", ",")) + '"></label>' +
        '<label class="field"><span>Dólar anterior</span><input id="cot-dolar-ant" inputmode="decimal" value="' + esc(String(c.dolarAnterior).replace(".", ",")) + '"></label>' +
      "</div>" +
      '<label class="field"><span>Observação do boletim</span><textarea id="cot-nota" maxlength="300">' + esc(c.nota || "") + "</textarea></label></div>" +

      '<div class="panel"><div class="bloco-head"><h3 class="box-title">' + I.chart + "Agricultura</h3>" +
      '<button type="button" class="btn btn-ghost btn-sm" id="add-agri">' + I.plus + " Produto</button></div>" +
      '<div id="agri-lista">' + (c.agricultura || []).map(agriBloco).join("") + "</div></div>" +

      '<div class="panel"><div class="bloco-head"><h3 class="box-title">' + I.horse + "Pecuária</h3>" +
      '<button type="button" class="btn btn-ghost btn-sm" id="add-pec">' + I.plus + " Item</button></div>" +
      '<div class="table-wrap"><table class="mini-table"><thead><tr><th>Produto</th><th>Unidade</th><th>Atual</th><th>Anterior</th><th>Observação</th><th></th></tr></thead>' +
      '<tbody id="pec-lista">' + (c.pecuaria || []).map(pecLinha).join("") + "</tbody></table></div></div></form>";
  }
  function agriBloco(a) {
    return '<div class="agri-bloco" data-bloco>' +
      '<div class="row3 topo">' +
        '<label class="field"><span>Produto</span><input data-f="produto" value="' + U.attr(a.produto) + '"></label>' +
        '<label class="field"><span>Unidade</span><input data-f="unidade" value="' + U.attr(a.unidade || "") + '" placeholder="R$/sc"></label>' +
        '<label class="field"><span>Observação</span><input data-f="obs" value="' + U.attr(a.obs || "") + '"></label>' +
        '<button type="button" class="icon-act perigo" data-rm-bloco title="Remover produto">' + I.trash + "</button>" +
      "</div>" +
      '<div class="table-wrap"><table class="mini-table"><thead><tr><th>Comprador</th><th>Preço (R$)</th><th>Observação</th><th></th></tr></thead>' +
      "<tbody>" + (a.compradores || []).map(compLinha).join("") + "</tbody></table></div>" +
      '<button type="button" class="btn btn-quiet btn-sm" data-add-comp>' + I.plus + " Comprador</button></div>";
  }
  function compLinha(x) {
    x = x || { nome: "", preco: null, obs: "" };
    return "<tr>" +
      '<td><input data-f="nome" value="' + U.attr(x.nome) + '"></td>' +
      '<td><input data-f="preco" inputmode="decimal" value="' + (x.preco != null && x.preco !== "" ? esc(String(x.preco).replace(".", ",")) : "") + '" placeholder="—"></td>' +
      '<td><input data-f="obs" value="' + U.attr(x.obs || "") + '"></td>' +
      '<td><button type="button" class="icon-act perigo" data-rm-linha title="Remover">' + I.trash + "</button></td></tr>";
  }
  function pecLinha(p) {
    p = p || { produto: "", unidade: "R$/@", atual: null, anterior: null, obs: "" };
    return "<tr>" +
      '<td><input data-f="produto" value="' + U.attr(p.produto) + '"></td>' +
      '<td><input data-f="unidade" value="' + U.attr(p.unidade || "") + '"></td>' +
      '<td><input data-f="atual" inputmode="decimal" value="' + (p.atual != null && p.atual !== "" ? esc(String(p.atual).replace(".", ",")) : "") + '"></td>' +
      '<td><input data-f="anterior" inputmode="decimal" value="' + (p.anterior != null && p.anterior !== "" ? esc(String(p.anterior).replace(".", ",")) : "") + '"></td>' +
      '<td><input data-f="obs" value="' + U.attr(p.obs || "") + '"></td>' +
      '<td><button type="button" class="icon-act perigo" data-rm-linha title="Remover">' + I.trash + "</button></td></tr>";
  }
  function depoisCotacoes() {
    var form = $("#form-cot");
    form.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target : null;
      if (!t) return;
      var rm = e.target.closest("[data-rm-linha]");
      if (rm) { rm.closest("tr").remove(); return; }
      var rmb = e.target.closest("[data-rm-bloco]");
      if (rmb) { if (confirm("Remover este produto do boletim?")) rmb.closest("[data-bloco]").remove(); return; }
      var addc = e.target.closest("[data-add-comp]");
      if (addc) {
        var tb = $("tbody", addc.closest("[data-bloco]"));
        tb.insertAdjacentHTML("beforeend", compLinha());
        $$("input", tb.lastElementChild)[0].focus();
        return;
      }
    });
    $("#add-agri").addEventListener("click", function () {
      $("#agri-lista").insertAdjacentHTML("beforeend", agriBloco({ produto: "", unidade: "R$/sc", obs: "", compradores: [{ nome: "", preco: null, obs: "" }] }));
    });
    $("#add-pec").addEventListener("click", function () {
      $("#pec-lista").insertAdjacentHTML("beforeend", pecLinha());
    });
    $("#cot-save").addEventListener("click", function () {
      var c = {
        data: $("#cot-data").value || U.todayISO(),
        anterior: $("#cot-ant").value || "",
        dolar: U.numero($("#cot-dolar").value),
        dolarAnterior: U.numero($("#cot-dolar-ant").value),
        nota: $("#cot-nota").value.trim(),
        agricultura: $$("#agri-lista [data-bloco]").map(function (b) {
          var topo = $(".topo", b);
          return {
            produto: $('[data-f="produto"]', topo).value.trim(),
            unidade: $('[data-f="unidade"]', topo).value.trim(),
            obs: $('[data-f="obs"]', topo).value.trim(),
            compradores: $$("tbody tr", b).map(function (tr) {
              return {
                nome: $('[data-f="nome"]', tr).value.trim(),
                preco: U.numero($('[data-f="preco"]', tr).value),
                obs: $('[data-f="obs"]', tr).value.trim()
              };
            }).filter(function (x) { return x.nome; })
          };
        }).filter(function (a) { return a.produto; }),
        pecuaria: $$("#pec-lista tr").map(function (tr) {
          return {
            produto: $('[data-f="produto"]', tr).value.trim(),
            unidade: $('[data-f="unidade"]', tr).value.trim(),
            atual: U.numero($('[data-f="atual"]', tr).value),
            anterior: U.numero($('[data-f="anterior"]', tr).value),
            obs: $('[data-f="obs"]', tr).value.trim()
          };
        }).filter(function (p) { return p.produto; })
      };
      var btn = $("#cot-save"); btn.disabled = true;
      C.set("cotacoes", c).then(function () {
        return Store.anotar("atualizou as cotações", U.fmtShort(c.data));
      }).then(function () {
        btn.disabled = false;
        toast("Boletim salvo e publicado no site.");
        SRJ.montarCasca();
      }).catch(function (err) { btn.disabled = false; toast(err.message); });
    });
  }

  /* =====================================================================
     Conteúdo do site
     ===================================================================== */
  function listaConteudo() {
    return cabecalho("Conteúdo do site", "", "Tudo o que aparece nas páginas pode ser alterado aqui.") +
      '<div class="conteudo-grid">' + SRJ.schemas.map(function (s) {
        var v = C.get(s.key);
        var n = Array.isArray(v) ? v.length + (v.length === 1 ? " item" : " itens") : "";
        var alterado = Object.prototype.hasOwnProperty.call(C.overrides, s.key);
        return '<a class="conteudo-card" href="#/redacao/conteudo/' + encodeURIComponent(s.key) + '">' +
          "<b>" + esc(s.titulo) + "</b>" +
          (s.desc ? "<small>" + esc(s.desc) + "</small>" : "") +
          '<span class="pé">' + (n ? '<span class="qtd">' + n + "</span>" : "") +
          (alterado ? '<span class="tagzin">editado</span>' : "") + U.inline("right") + "</span></a>";
      }).join("") + "</div>";
  }

  function acharSchema(key) {
    var l = SRJ.schemas.filter(function (s) { return s.key === key; });
    return l[0] || null;
  }

  function editorConteudo(keyEnc) {
    var key = decodeURIComponent(keyEnc);
    var s = acharSchema(key);
    if (!s) return cabecalho("Conteúdo não encontrado") + '<div class="panel"><a class="btn btn-ghost" href="#/redacao/conteudo">Voltar</a></div>';
    var valor = C.get(key);
    var corpo;
    if (s.tipo === "texto") {
      corpo = '<div class="panel">' + campo({ k: "_", l: s.campo.l, t: s.campo.t }, valor, "c") + "</div>";
    } else if (s.tipo === "objeto") {
      corpo = '<div class="panel"><div class="campos">' + s.campos.map(function (f) {
        return campo(f, valor ? valor[f.k] : "", "c");
      }).join("") + "</div></div>";
    } else {
      corpo = '<div id="lista-itens" class="stack">' + (valor || []).map(function (item, i) {
        return itemLista(s, item, i);
      }).join("") + "</div>" +
      '<button type="button" class="btn btn-ghost add-item" id="add-item">' + I.plus + " Adicionar item</button>";
    }
    return cabecalho(s.titulo,
      '<a class="btn btn-quiet" href="#/redacao/conteudo">Voltar</a>' +
      '<button type="button" class="btn btn-accent" id="cont-save">' + I.check + " Salvar</button>", s.desc || "") +
      '<form id="form-conteudo" class="stack" data-key="' + U.attr(key) + '">' + corpo + "</form>";
  }
  function itemLista(s, item, i) {
    item = item || {};
    var simples = !!s.simples;
    return '<div class="item-card" data-item>' +
      '<div class="item-head"><span class="item-n">' + (i + 1) + "</span>" +
      '<span class="item-t">' + esc(simples ? (String(item).slice(0, 60) || "Novo item") : (item[s.campos[0].k] || "Novo item")) + "</span>" +
      '<span class="item-acts">' +
      '<button type="button" class="icon-act" data-up title="Mover para cima">' + I.up + "</button>" +
      '<button type="button" class="icon-act" data-down title="Mover para baixo">' + I.chev + "</button>" +
      '<button type="button" class="icon-act perigo" data-rm title="Remover">' + I.trash + "</button></span></div>" +
      '<div class="campos">' + (simples
        ? campo({ k: "_", l: s.campos[0].l, t: s.campos[0].t }, item, "i")
        : s.campos.map(function (f) { return campo(f, item[f.k], "i"); }).join("")) + "</div></div>";
  }
  function campo(f, valor, escopo) {
    var v = valor == null ? "" : valor;
    var attr = 'data-' + escopo + '="' + U.attr(f.k) + '"';
    var inner;
    if (f.t === "area") inner = "<textarea " + attr + ">" + esc(v) + "</textarea>";
    else if (f.t === "linhas") inner = "<textarea " + attr + ' rows="5">' + esc(v) + "</textarea>";
    else if (f.t === "select") inner = "<select " + attr + ">" + (f.opcoes || []).map(function (o) {
      return "<option" + (String(o) === String(v) ? " selected" : "") + ">" + esc(o) + "</option>";
    }).join("") + "</select>";
    else if (f.t === "imagem") {
      inner = '<div class="img-campo">' +
        '<input ' + attr + ' value="' + U.attr(v) + '" placeholder="assets/img/... ou envie um arquivo">' +
        '<label class="btn btn-quiet btn-sm">' + I.image + ' Enviar<input type="file" accept="image/*" hidden data-upload></label>' +
        (v ? '<img class="mini-prev" src="' + esc(v) + '" alt="">' : '<img class="mini-prev" hidden alt="">') + "</div>";
    } else inner = "<input " + attr + ' value="' + U.attr(v) + '">';
    return '<label class="field"><span>' + esc(f.l) + "</span>" + inner + "</label>";
  }

  function depoisConteudo(keyEnc) {
    var key = decodeURIComponent(keyEnc);
    var s = acharSchema(key);
    if (!s) return;
    var form = $("#form-conteudo");

    function ligarUploads(raiz) {
      $$("[data-upload]", raiz || form).forEach(function (inp) {
        if (inp.dataset.ok) return;
        inp.dataset.ok = "1";
        inp.addEventListener("change", function (e) {
          var f = e.target.files[0];
          if (!f) return;
          var campoDiv = inp.closest(".img-campo");
          toast("Enviando imagem…");
          Store.enviarImagem(f).then(function (url) {
            Store.registrarMidia(url, f.name);
            $("input[data-i], input[data-c]", campoDiv).value = url;
            var prev = $(".mini-prev", campoDiv);
            prev.src = url; prev.hidden = false;
            toast("Imagem enviada.");
          }).catch(function (err) { toast(err.message); });
          e.target.value = "";
        });
      });
    }
    ligarUploads();

    if (s.tipo === "lista") {
      var lista = $("#lista-itens");
      function renumerar() {
        $$("[data-item]", lista).forEach(function (el, i) { $(".item-n", el).textContent = i + 1; });
      }
      $("#add-item").addEventListener("click", function () {
        lista.insertAdjacentHTML("beforeend", itemLista(s, {}, $$("[data-item]", lista).length));
        var novo = lista.lastElementChild;
        ligarUploads(novo);
        renumerar();
        var f = $("input, textarea", novo); if (f) f.focus();
        novo.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      lista.addEventListener("click", function (e) {
        var el = e.target.closest ? e.target.closest("[data-item]") : null;
        if (!el) return;
        if (e.target.closest("[data-rm]")) {
          if (confirm("Remover este item?")) { el.remove(); renumerar(); }
        } else if (e.target.closest("[data-up]")) {
          if (el.previousElementSibling) { lista.insertBefore(el, el.previousElementSibling); renumerar(); }
        } else if (e.target.closest("[data-down]")) {
          if (el.nextElementSibling) { lista.insertBefore(el.nextElementSibling, el); renumerar(); }
        }
      });
      lista.addEventListener("input", function (e) {
        var el = e.target.closest ? e.target.closest("[data-item]") : null;
        if (!el) return;
        var primeiro = $("[data-i]", el);
        if (primeiro && e.target === primeiro) $(".item-t", el).textContent = primeiro.value || "Novo item";
      });
    }

    $("#cont-save").addEventListener("click", function () {
      var valor;
      if (s.tipo === "texto") {
        valor = $('[data-c="_"]', form).value;
      } else if (s.tipo === "objeto") {
        valor = {};
        s.campos.forEach(function (f) {
          var el = $('[data-c="' + f.k + '"]', form);
          valor[f.k] = el ? el.value.trim() : "";
        });
      } else {
        valor = $$("[data-item]", form).map(function (el) {
          if (s.simples) return ($('[data-i="_"]', el) || {}).value || "";
          var o = {};
          s.campos.forEach(function (f) {
            var inp = $('[data-i="' + f.k + '"]', el);
            o[f.k] = inp ? inp.value.trim() : "";
          });
          return o;
        }).filter(function (o) {
          if (typeof o === "string") return o.trim();
          return Object.keys(o).some(function (k) { return o[k]; });
        });
      }
      var btn = $("#cont-save"); btn.disabled = true;
      C.set(key, valor).then(function () {
        return Store.anotar("editou conteúdo", s.titulo);
      }).then(function () {
        btn.disabled = false;
        toast(s.titulo + " salvo.");
        SRJ.montarCasca();
      }).catch(function (err) { btn.disabled = false; toast(err.message); });
    });
  }

  /* =====================================================================
     Mensagens
     ===================================================================== */
  function depoisMensagens() {
    var box = $("#leads-box");
    function carregar() {
      Store.mensagens().then(function (ls) {
        box.innerHTML = ls.length ? ls.map(function (l) {
          return '<div class="lead-item"><div class="lh"><b>' + esc(l.tipo) + (l.nome ? " · " + esc(l.nome) : "") + "</b>" +
            "<small>" + U.rel(l.quando) + "</small></div>" +
            '<div class="lmeta">' + (l.telefone ? '<a href="tel:' + esc(String(l.telefone).replace(/\D/g, "")) + '">' + esc(l.telefone) + "</a>" : "") +
            (l.email ? ' <a href="mailto:' + esc(l.email) + '">' + esc(l.email) + "</a>" : "") + "</div>" +
            "<pre>" + esc(l.resumo) + "</pre>" +
            '<div class="row-btn">' +
            (l.telefone ? '<a class="btn btn-ghost btn-sm" href="' + SRJ.wa("") .replace(/\/\d+/, "/" + String(l.telefone).replace(/\D/g, "").replace(/^(\d{10,11})$/, "55$1")) + '" target="_blank" rel="noopener">' + I.wa + " Responder</a>" : "") +
            '<button type="button" class="btn btn-danger btn-sm" data-del="' + esc(l.id) + '">' + I.trash + " Excluir</button></div></div>";
        }).join("") : '<div class="vazio">' + I.inbox + "<p>Nenhuma mensagem recebida ainda.</p><small>Os formulários de contato, pré-cadastro e currículo aparecem aqui.</small></div>";
      }).catch(function (e) { box.innerHTML = '<div class="note">' + esc(e.message) + "</div>"; });
    }
    carregar();
    box.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-del]") : null;
      if (!b || !confirm("Excluir esta mensagem?")) return;
      Store.excluirMensagem(b.dataset.del).then(carregar).catch(function (err) { toast(err.message); });
    });
  }

  /* =====================================================================
     Usuários
     ===================================================================== */
  function usuarios() {
    return cabecalho("Usuários", "", "Quem pode entrar no painel e publicar no site.") +
      '<div class="cms-cols">' +
      '<div class="panel"><h3 class="box-title">' + I.users + 'Contas</h3><ul class="user-list" id="user-list"><li class="carregando"><span class="spin"></span> Carregando…</li></ul></div>' +
      '<form class="form panel" id="form-user" novalidate><h3 class="box-title">' + I.userplus + "Novo usuário</h3>" +
      '<label>Nome<input name="nome" required maxlength="80"></label>' +
      '<label>Login<input name="usuario" required autocapitalize="none" spellcheck="false" maxlength="40" placeholder="ex.: maria.silva"></label>' +
      '<label>Senha inicial<input name="senha" type="password" required minlength="8" maxlength="100"><span class="hint">Mínimo de 8 caracteres. O usuário troca no primeiro acesso.</span></label>' +
      '<label>Papel<select name="papel"><option value="jornalista">Jornalista — publica e edita matérias</option>' +
      '<option value="admin">Administrador — também gerencia usuários e o site</option></select></label>' +
      '<div class="actions"><button class="btn btn-primary" type="submit">' + I.userplus + " Criar usuário</button></div>" +
      '<div class="form-msg"></div></form></div>';
  }
  function depoisUsuarios() {
    var lista = $("#user-list");
    function carregar() {
      Store.usuarios().then(function (us) {
        lista.innerHTML = us.map(function (u) {
          return '<li><div class="av">' + esc((u.nome || "?").charAt(0).toUpperCase()) + "</div>" +
            "<div><b>" + esc(u.nome) + "</b><small>@" + esc(u.usuario) + (u.criado ? " · desde " + U.fmtShort(u.criado) : "") + "</small></div>" +
            '<span class="role">' + (u.papel === "admin" ? "Admin" : "Jornalista") + "</span>" +
            (u.id !== Store.user.id
              ? '<button type="button" class="icon-act perigo" data-del="' + esc(u.id) + '" aria-label="Remover ' + U.attr(u.nome) + '">' + I.trash + "</button>"
              : '<span class="voce">você</span>') + "</li>";
        }).join("") || "<li>Nenhum usuário.</li>";
      }).catch(function (e) { lista.innerHTML = "<li>" + esc(e.message) + "</li>"; });
    }
    carregar();
    lista.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-del]") : null;
      if (!b || !confirm("Remover este usuário? Ele perde o acesso ao painel.")) return;
      Store.excluirUsuario(b.dataset.del).then(function () {
        toast("Usuário removido."); carregar();
      }).catch(function (err) { toast(err.message); });
    });
    var f = $("#form-user");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var d = { nome: f.nome.value.trim(), usuario: f.usuario.value.trim().toLowerCase(), senha: f.senha.value, papel: f.papel.value };
      if (d.senha.length < 8) return toast("A senha precisa ter ao menos 8 caracteres.");
      Store.salvarUsuario(d).then(function () {
        return Store.anotar("criou usuário", d.usuario);
      }).then(function () {
        f.reset(); toast("Usuário criado."); carregar();
      }).catch(function (err) { $(".form-msg", f).innerHTML = '<div class="note">' + esc(err.message) + "</div>"; });
    });
  }

  /* =====================================================================
     Segurança
     ===================================================================== */
  function seguranca() {
    return cabecalho("Segurança", "", "Como o painel está protegido e o que aconteceu recentemente.") +
      '<div class="cms-cols">' +
      '<div class="panel"><h3 class="box-title">' + I.shield + "Proteções ativas</h3><ul class=\"checklist verde\">" +
      [
        "Senhas guardadas apenas como hash (nunca em texto).",
        "Sessão com validade e encerramento automático.",
        "Bloqueio temporário após 5 tentativas de login erradas.",
        "Troca de senha obrigatória no primeiro acesso.",
        "Envio de imagens restrito a JPG, PNG, WebP e GIF, com verificação do arquivo.",
        "Execução de scripts bloqueada na pasta de uploads.",
        "Pasta de dados inacessível pelo navegador.",
        "Texto das matérias limpo de scripts antes de publicar.",
        "Permissões por papel: jornalista edita as próprias matérias."
      ].map(function (t) { return "<li>" + I.check + "<span>" + esc(t) + "</span></li>"; }).join("") + "</ul></div>" +
      '<div class="panel"><h3 class="box-title">' + I.clock + 'Registro de atividades</h3><div id="log-box"><div class="carregando"><span class="spin"></span> Carregando…</div></div></div>' +
      "</div>" +
      '<div class="panel"><h3 class="box-title">' + I.key + "Recomendações</h3>" +
      '<ul class="reco"><li>Troque a senha padrão do administrador assim que publicar o site.</li>' +
      "<li>Crie um login por jornalista em vez de compartilhar uma conta.</li>" +
      "<li>Remova o acesso de quem sai da equipe.</li>" +
      "<li>Mantenha o site em HTTPS (certificado gratuito no painel da hospedagem).</li>" +
      "<li>Faça uma cópia da pasta <b>api/data</b> de tempos em tempos.</li></ul></div>";
  }
  function depoisSeguranca() {
    var box = $("#log-box");
    Store.registro().then(function (l) {
      box.innerHTML = l.length ? '<ul class="log-list">' + l.slice(0, 40).map(function (r) {
        return "<li><b>" + esc(r.usuario) + "</b> " + esc(r.acao) + (r.detalhe ? ' <span class="det">' + esc(r.detalhe) + "</span>" : "") +
          "<small>" + U.rel(r.quando) + "</small></li>";
      }).join("") + "</ul>" : '<p class="quiet-txt">Nenhuma atividade registrada ainda.</p>';
    }).catch(function (e) { box.innerHTML = '<div class="note">' + esc(e.message) + "</div>"; });
  }

  /* =====================================================================
     Minha conta
     ===================================================================== */
  function conta() {
    var u = Store.user;
    return cabecalho("Minha conta") +
      '<div class="cms-cols">' +
      '<div class="panel"><h3 class="box-title">' + I.users + "Dados</h3>" +
      '<div class="conta-dados"><div class="av grande">' + esc((u.nome || "?").charAt(0).toUpperCase()) + "</div>" +
      "<div><b>" + esc(u.nome) + "</b><small>@" + esc(u.usuario) + "</small>" +
      '<span class="role">' + (u.papel === "admin" ? "Administrador" : "Jornalista") + "</span></div></div></div>" +
      '<form class="form panel" id="form-pass" novalidate><h3 class="box-title">' + I.key + "Alterar senha</h3>" +
      '<label>Senha atual<input name="atual" type="password" required autocomplete="current-password"></label>' +
      '<label>Nova senha<input name="nova" type="password" required minlength="8" autocomplete="new-password"><span class="hint">Mínimo de 8 caracteres.</span></label>' +
      '<label>Confirmar nova senha<input name="conf" type="password" required minlength="8" autocomplete="new-password"></label>' +
      '<div class="actions"><button class="btn btn-primary" type="submit">' + I.key + " Alterar senha</button></div>" +
      '<div class="form-msg"></div></form></div>';
  }
  function trocarSenhaObrigatoria() {
    return cabecalho("Defina uma nova senha", "", "Por segurança, troque a senha padrão antes de usar o painel.") +
      '<form class="form panel destaque-seg" id="form-pass" novalidate style="max-width:480px">' +
      '<div class="note">Este é o seu primeiro acesso. Escolha uma senha pessoal com pelo menos 8 caracteres.</div>' +
      '<label>Senha atual<input name="atual" type="password" required autocomplete="current-password"></label>' +
      '<label>Nova senha<input name="nova" type="password" required minlength="8" autocomplete="new-password"></label>' +
      '<label>Confirmar nova senha<input name="conf" type="password" required minlength="8" autocomplete="new-password"></label>' +
      '<div class="actions"><button class="btn btn-primary" type="submit">' + I.check + " Salvar e continuar</button></div>" +
      '<div class="form-msg"></div></form>';
  }
  function depoisConta(obrigatorio) {
    var f = $("#form-pass");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var msg = $(".form-msg", f);
      if (f.nova.value.length < 8) return toast("A nova senha precisa ter ao menos 8 caracteres.");
      if (f.nova.value !== f.conf.value) { msg.innerHTML = '<div class="note">As senhas não conferem.</div>'; return; }
      if (f.nova.value === f.atual.value) { msg.innerHTML = '<div class="note">A nova senha precisa ser diferente da atual.</div>'; return; }
      var btn = $("button", f); btn.disabled = true;
      Store.trocarSenha(f.atual.value, f.nova.value).then(function () {
        return Store.anotar("alterou a senha", "");
      }).then(function () {
        f.reset(); btn.disabled = false;
        toast("Senha alterada.");
        if (obrigatorio) { location.hash = "#/redacao"; SRJ.render(); }
      }).catch(function (err) {
        btn.disabled = false;
        msg.innerHTML = '<div class="note">' + esc(err.message) + "</div>";
      });
    });
  }
})();
