/* =====================================================================
   Sindicato Rural de Jataí — núcleo
   Utilitários, ícones, camada de conteúdo e armazenamento.
   Compatível com Chrome, Edge, Firefox e Safari 13+.
   ===================================================================== */
(function () {
  "use strict";

  var SRJ = window.SRJ = window.SRJ || {};
  var U = SRJ.U = {};

  /* ---------------- DOM ---------------- */
  U.$ = function (s, el) { return (el || document).querySelector(s); };
  U.$$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  U.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  U.attr = function (s) { return U.esc(s).replace(/\n/g, " "); };

  /* ---------------- Datas ---------------- */
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var MES3 = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  U.MESES = MESES; U.MES3 = MES3; U.DIAS = DIAS;

  U.parseDate = function (iso) {
    var p = String(iso || "").slice(0, 10).split("-");
    var d = new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1, 12, 0, 0);
    return isNaN(d.getTime()) ? new Date() : d;
  };
  U.fmtLong = function (iso) { var d = U.parseDate(iso); return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear(); };
  U.fmtShort = function (iso) {
    var d = U.parseDate(iso);
    return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
  };
  U.todayISO = function () {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  };
  U.rel = function (iso) {
    var s = String(iso || "");
    var d = s.length > 10 ? new Date(s) : U.parseDate(s);
    if (isNaN(d.getTime())) return "";
    var diff = Date.now() - d.getTime();
    var min = Math.floor(diff / 60000), h = Math.floor(min / 60), dd = Math.floor(h / 24);
    if (diff < 0) return d.getDate() + " " + MES3[d.getMonth()];
    if (min < 1) return "agora";
    if (min < 60) return "há " + min + " min";
    if (h < 24) return "há " + h + "h";
    if (dd === 1) return "ontem";
    if (dd < 7) return "há " + dd + " dias";
    var ano = d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : "";
    return d.getDate() + " " + MES3[d.getMonth()] + ano;
  };

  /* ---------------- Texto ---------------- */
  U.semAcento = function (s) {
    s = String(s == null ? "" : s);
    if (String.prototype.normalize) s = s.normalize("NFD").replace(new RegExp("[\u0300-\u036f]","g"), "");
    return s.toLowerCase();
  };
  U.slugify = function (s) {
    return U.semAcento(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  };
  U.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); };
  U.brl = function (v) {
    if (v == null || v === "" || isNaN(+v)) return "—";
    return "R$ " + (+v).toFixed(2).replace(".", ",");
  };
  U.numero = function (v) {
    var n = parseFloat(String(v).replace(/\./g, "").replace(",", "."));
    return isNaN(n) ? null : n;
  };
  U.linhas = function (txt) {
    return String(txt || "").split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
  };
  U.ytId = function (url) {
    var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  };

  /* ---------------- Ícones ---------------- */
  function ico(path, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra ? " " + extra : "") + ">" + path + "</svg>";
  }
  U.I = {
    search: ico('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
    menu: ico('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: ico('<path d="M6 6l12 12M18 6 6 18"/>'),
    chev: ico('<path d="m6 9 6 6 6-6"/>', 'class="chev"'),
    right: ico('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    left: ico('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    up: ico('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    check: ico('<path d="m5 12 5 5L20 7"/>'),
    phone: ico('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    mail: ico('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
    pin: ico('<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    clock: ico('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>'),
    chart: ico('<path d="M4 20V4M4 20h16"/><path d="m7.5 15 3.5-4.5 3 3 5-6"/>'),
    gavel: ico('<path d="m14 4 6 6M4 20l8-8M9 9l6 6M12 6l6 6"/>'),
    cap: ico('<path d="m3 9 9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4"/><path d="M21 9v5"/>'),
    building: ico('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>'),
    briefcase: ico('<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A2 2 0 0 1 11 3.5h2a2 2 0 0 1 2 2V7M3 12.5h18"/>'),
    horse: ico('<path d="M5 20v-6a7 7 0 0 1 7-7h2l3-3 2 2-1 3v2a4 4 0 0 1-4 4h-1v5"/><path d="M9 20v-4"/>'),
    userplus: ico('<circle cx="10" cy="8" r="4"/><path d="M3 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>'),
    percent: ico('<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>'),
    ribbon: ico('<circle cx="12" cy="9" r="5"/><path d="m9 13-2 8 5-3 5 3-2-8"/>'),
    cloud: ico('<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4 4 0 0 1 0 9H7z"/>'),
    users: ico('<circle cx="9" cy="8" r="3.6"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0M16 4.4a4 4 0 0 1 0 7.2M21.5 20.5a6.5 6.5 0 0 0-4.5-6.2"/>'),
    edit: ico('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>'),
    trash: ico('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    plus: ico('<path d="M12 5v14M5 12h14"/>'),
    image: ico('<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m21 16-5-5-8 8"/>'),
    inbox: ico('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 14h5l1.5 2.2h5L16 14h5"/>'),
    logout: ico('<path d="M10 4H5v16h5M14.5 8.5 18 12l-3.5 3.5M18 12H9"/>'),
    key: ico('<circle cx="8" cy="14" r="4"/><path d="m11 11 9-9M17 5l2 2M14 8l2 2"/>'),
    eye: ico('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    doc: ico('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'),
    home: ico('<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>'),
    play: ico('<circle cx="12" cy="12" r="9.2"/><path d="m10 8.2 6 3.8-6 3.8z" fill="currentColor" stroke="none"/>'),
    fontp: ico('<path d="M3 19 9 5l6 14M5.5 14h7M19 8.5v6M16 11.5h6"/>'),
    fontm: ico('<path d="M3 19 9 5l6 14M5.5 14h7M16 11.5h6"/>'),
    contrast: ico('<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" stroke="none"/>'),
    map: ico('<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    a11y: ico('<circle cx="12" cy="4.2" r="1.6"/><path d="M4.5 8.5h15M12 8.5v6M9 20.5l3-6 3 6"/>'),
    shield: ico('<path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z"/><path d="m9 12 2 2 4-4"/>'),
    settings: ico('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"/>'),
    grid: ico('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
    star: ico('<path d="m12 3.5 2.7 5.5 6 .9-4.35 4.2 1 6-5.35-2.8-5.35 2.8 1-6L3.3 9.9l6-.9z"/>'),
    bold: ico('<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>'),
    italic: ico('<path d="M14 5h-4M14 19h-4M13.5 5 10.5 19"/>'),
    link: ico('<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>'),
    list: ico('<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'),
    quote: ico('<path d="M9 10H5.5V6.5H9zm0 0c0 4-1.5 6-3.5 7M18.5 10H15V6.5h3.5zm0 0c0 4-1.5 6-3.5 7"/>'),
    undo: ico('<path d="M4 9h10a5 5 0 0 1 0 10h-4"/><path d="m8 5-4 4 4 4"/>'),
    save: ico('<path d="M5 4h11l3 3v13H5z"/><path d="M9 4v5h6V4M8 20v-6h8v6"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1c.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2-.2-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5h3V5h-3a4 4 0 0 0-4 4v2H7.5v3.5H10V22h4v-7.5h2.6l.9-3.5H14V9a.5.5 0 0 1 .5-.5z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.5a3 3 0 0 0-2-2C18 6 12 6 12 6s-6 0-8 .5a3 3 0 0 0-2 2A31 31 0 0 0 2 12a31 31 0 0 0 0 3.5 3 3 0 0 0 2 2c2 .5 8 .5 8 .5s6 0 8-.5a3 3 0 0 0 2-2 31 31 0 0 0 0-3.5 31 31 0 0 0 0-3.5zM10 15V9l5 3z"/></svg>'
  };
  U.inline = function (name) { return U.I[name].replace("<svg", '<svg class="ico-inline"'); };

  /* =====================================================================
     Sanitização do HTML das matérias
     ===================================================================== */
  var TAGS = {
    P: [], BR: [], STRONG: [], B: [], EM: [], I: [], U: [], S: [], H2: [], H3: [], H4: [],
    UL: [], OL: [], LI: [], A: ["href"], IMG: ["src", "alt"], BLOCKQUOTE: [], FIGURE: [],
    FIGCAPTION: [], DIV: [], SPAN: [], HR: [], TABLE: [], THEAD: [], TBODY: [], TR: [], TH: [], TD: []
  };
  U.sanitize = function (html) {
    var doc = new DOMParser().parseFromString("<div>" + String(html || "") + "</div>", "text/html");
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) return;
        if (ch.nodeType !== 1) { ch.parentNode.removeChild(ch); return; }
        var tag = ch.tagName;
        if (!TAGS[tag]) {
          if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "FORM", "INPUT", "BUTTON", "LINK", "META"].indexOf(tag) >= 0) {
            ch.parentNode.removeChild(ch); return;
          }
          walk(ch);
          while (ch.firstChild) ch.parentNode.insertBefore(ch.firstChild, ch);
          ch.parentNode.removeChild(ch);
          return;
        }
        Array.prototype.slice.call(ch.attributes).forEach(function (a) {
          if (TAGS[tag].indexOf(a.name) < 0) ch.removeAttribute(a.name);
        });
        if (tag === "A") {
          var href = ch.getAttribute("href") || "";
          if (!/^(https?:|mailto:|tel:|#)/i.test(href)) ch.removeAttribute("href");
          else { ch.setAttribute("rel", "noopener"); if (href.charAt(0) !== "#") ch.setAttribute("target", "_blank"); }
        }
        if (tag === "IMG") {
          var src = ch.getAttribute("src") || "";
          if (!/^(https?:|data:image\/(png|jpe?g|gif|webp);base64,|uploads\/|assets\/)/i.test(src)) {
            ch.parentNode.removeChild(ch); return;
          }
          ch.setAttribute("loading", "lazy");
          ch.setAttribute("decoding", "async");
        }
        walk(ch);
      });
    })(doc.body.firstChild);
    return doc.body.firstChild.innerHTML;
  };
  U.texto = function (html) {
    var d = document.createElement("div");
    d.innerHTML = U.sanitize(html);
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  };

  /* =====================================================================
     Imagens
     ===================================================================== */
  /* O site guarda cada foto em .jpg e .webp. Quando o navegador aceita
     WebP, usamos o arquivo menor; senao fica o JPG original.
     Só vale para assets/: imagens enviadas pelo painel nao tem versao WebP. */
  SRJ.webp = false;
  U.detectarWebp = function () {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () { SRJ.webp = img.width === 1 && img.height === 1; res(SRJ.webp); };
      img.onerror = function () { SRJ.webp = false; res(false); };
      img.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
    });
  };
  U.img = function (src) {
    src = String(src || "");
    if (!SRJ.webp) return src;
    if (src.indexOf("assets/") !== 0) return src;
    return src.replace(/\.(jpe?g|png)$/i, ".webp");
  };

  U.reduzirImagem = function (file, max, q) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        try { res(c.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", q)); }
        catch (e) { rej(new Error("Não foi possível processar a imagem.")); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("Arquivo de imagem inválido.")); };
      img.src = url;
    });
  };

  /* =====================================================================
     Armazenamento — API PHP quando disponível, senão navegador
     ===================================================================== */
  var API = "api/index.php";

  function sha(txt) {
    if (window.crypto && crypto.subtle && window.TextEncoder && window.isSecureContext !== false) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode("srj$" + txt)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      }).catch(function () { return simples(txt); });
    }
    return Promise.resolve(simples(txt));
  }
  function simples(txt) {
    var h1 = 0x811c9dc5, h2 = 0x1000193, s = "srj$" + txt;
    for (var i = 0; i < s.length; i++) {
      h1 = (h1 ^ s.charCodeAt(i)) >>> 0; h1 = (h1 * 16777619) >>> 0;
      h2 = ((h2 << 5) + h2 + s.charCodeAt(i)) >>> 0;
    }
    return "s" + h1.toString(16) + h2.toString(16);
  }
  function lsGet(k, def) {
    try { var v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); }
    catch (e) { return def; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }

  var Store = SRJ.Store = {
    mode: "local",
    token: null,
    user: null,
    online: false,

    init: function () {
      var self = this;
      this.token = lsGet("srj_token", null);
      this.user = lsGet("srj_user", null);
      if (!/^https?:$/.test(location.protocol)) return this.initLocal();
      return this.pedir("ping").then(function (j) {
        if (j && j.ok) {
          self.mode = "api"; self.online = true;
          self.user = j.user || null;
          if (!j.user && self.token) self.sair(true);
          return j;
        }
        return self.initLocal();
      }).catch(function () { return self.initLocal(); });
    },
    initLocal: function () {
      this.mode = "local";
      if (lsGet("srj_users", null) === null) {
        return sha("srj2026").then(function (h) {
          lsSet("srj_users", [{ id: "u1", nome: "Administrador", usuario: "admin", hash: h, papel: "admin", trocarSenha: true, criado: U.todayISO() }]);
        });
      }
      return Promise.resolve();
    },

    cab: function (extra) {
      var o = extra || {};
      if (this.token) o["X-Auth"] = this.token;
      return o;
    },
    pedir: function (rota, opts) {
      var self = this;
      opts = opts || {};
      var o = { method: opts.method || "GET", headers: this.cab(opts.headers || {}) };
      if (opts.json) { o.body = JSON.stringify(opts.json); o.headers["Content-Type"] = "application/json"; }
      if (opts.body) o.body = opts.body;
      var ctl, tm;
      if (window.AbortController) {
        ctl = new AbortController(); o.signal = ctl.signal;
        tm = setTimeout(function () { ctl.abort(); }, opts.timeout || 15000);
      }
      return fetch(API + "?r=" + rota, o).then(function (res) {
        if (tm) clearTimeout(tm);
        return res.json().catch(function () { return {}; }).then(function (j) {
          if (!res.ok || j.error) {
            var err = new Error(j.error || ("Erro " + res.status));
            err.status = res.status;
            if (res.status === 401 && self.token) self.sair(true);
            throw err;
          }
          return j;
        });
      }, function (e) { if (tm) clearTimeout(tm); throw e; });
    },

    /* ---- matérias ---- */
    posts: function () {
      if (this.mode === "api") {
        return this.pedir("posts").then(function (j) { return j.posts || []; });
      }
      var list = lsGet("srj_posts", null);
      if (list === null) { list = JSON.parse(JSON.stringify(SRJ.postsIniciais)); lsSet("srj_posts", list); }
      return Promise.resolve(list);
    },
    salvarPost: function (p) {
      if (this.mode === "api") return this.pedir("post", { method: "POST", json: p }).then(function (j) { return j.post; });
      var list = lsGet("srj_posts", []);
      var i = -1;
      list.forEach(function (x, k) { if (x.id === p.id) i = k; });
      if (i >= 0) list[i] = p; else list.unshift(p);
      if (!lsSet("srj_posts", list)) return Promise.reject(new Error("Sem espaço no navegador. Use imagens menores ou publique na versão hospedada."));
      return Promise.resolve(p);
    },
    excluirPost: function (id) {
      if (this.mode === "api") return this.pedir("post&id=" + encodeURIComponent(id), { method: "DELETE" });
      lsSet("srj_posts", lsGet("srj_posts", []).filter(function (x) { return x.id !== id; }));
      return Promise.resolve();
    },

    /* ---- conteúdo do site ---- */
    conteudo: function () {
      if (this.mode === "api") return this.pedir("content").then(function (j) { return j.content || {}; });
      return Promise.resolve(lsGet("srj_content", {}));
    },
    salvarConteudo: function (key, valor) {
      if (this.mode === "api") return this.pedir("content", { method: "POST", json: { key: key, valor: valor } });
      var c = lsGet("srj_content", {});
      c[key] = valor;
      if (!lsSet("srj_content", c)) return Promise.reject(new Error("Sem espaço no navegador."));
      return Promise.resolve({ ok: true });
    },

    /* ---- mídia ---- */
    enviarImagem: function (file) {
      if (this.mode === "api") {
        var fd = new FormData(); fd.append("file", file);
        return this.pedir("upload", { method: "POST", body: fd, timeout: 60000 }).then(function (j) { return j.url; });
      }
      return U.reduzirImagem(file, 1280, 0.82);
    },
    midia: function () {
      if (this.mode === "api") return this.pedir("media").then(function (j) { return j.media || []; });
      return Promise.resolve(lsGet("srj_media", []));
    },
    registrarMidia: function (url, nome) {
      if (this.mode === "api") return Promise.resolve();
      var m = lsGet("srj_media", []);
      m.unshift({ url: url, nome: nome, quando: new Date().toISOString() });
      lsSet("srj_media", m.slice(0, 60));
      return Promise.resolve();
    },
    excluirMidia: function (url) {
      if (this.mode === "api") return this.pedir("media&url=" + encodeURIComponent(url), { method: "DELETE" });
      lsSet("srj_media", lsGet("srj_media", []).filter(function (x) { return x.url !== url; }));
      return Promise.resolve();
    },

    /* ---- autenticação ---- */
    entrar: function (usuario, senha) {
      var self = this;
      if (this.mode === "api") {
        return this.pedir("login", { method: "POST", json: { usuario: usuario, senha: senha } }).then(function (j) {
          self.token = j.token; self.user = j.user;
          lsSet("srj_token", j.token); lsSet("srj_user", j.user);
          return j.user;
        });
      }
      var bloq = lsGet("srj_bloqueio", null);
      if (bloq && bloq.ate > Date.now()) {
        return Promise.reject(new Error("Muitas tentativas. Aguarde " + Math.ceil((bloq.ate - Date.now()) / 60000) + " min."));
      }
      var login = String(usuario || "").trim().toLowerCase();
      return sha(senha).then(function (h) {
        var u = lsGet("srj_users", []).filter(function (x) { return x.usuario === login && x.hash === h; })[0];
        if (!u) {
          var t = lsGet("srj_tent", 0) + 1;
          lsSet("srj_tent", t);
          if (t >= 5) { lsSet("srj_bloqueio", { ate: Date.now() + 900000 }); lsSet("srj_tent", 0); }
          throw new Error("Usuário ou senha incorretos.");
        }
        lsSet("srj_tent", 0);
        self.user = { id: u.id, nome: u.nome, usuario: u.usuario, papel: u.papel, trocarSenha: !!u.trocarSenha };
        lsSet("srj_user", self.user);
        return self.user;
      });
    },
    sair: function (silencioso) {
      if (this.mode === "api" && this.token && !silencioso) this.pedir("logout", { method: "POST" }).catch(function () {});
      this.token = null; this.user = null;
      try { localStorage.removeItem("srj_token"); localStorage.removeItem("srj_user"); } catch (e) {}
    },
    ehAdmin: function () { return !!(this.user && this.user.papel === "admin"); },

    /* ---- usuários ---- */
    usuarios: function () {
      if (this.mode === "api") return this.pedir("users").then(function (j) { return j.users || []; });
      return Promise.resolve(lsGet("srj_users", []).map(function (u) {
        return { id: u.id, nome: u.nome, usuario: u.usuario, papel: u.papel, criado: u.criado };
      }));
    },
    salvarUsuario: function (u) {
      if (this.mode === "api") return this.pedir("user", { method: "POST", json: u }).then(function (j) { return j.user; });
      var list = lsGet("srj_users", []);
      if (list.some(function (x) { return x.usuario === u.usuario && x.id !== u.id; })) {
        return Promise.reject(new Error("Já existe um usuário com esse login."));
      }
      return sha(u.senha || "").then(function (h) {
        var atual = list.filter(function (x) { return x.id === u.id; })[0] || {};
        var rec = {
          id: u.id || U.uid(), nome: u.nome, usuario: u.usuario, papel: u.papel,
          criado: atual.criado || U.todayISO(), hash: u.senha ? h : atual.hash, trocarSenha: u.senha ? true : !!atual.trocarSenha
        };
        var i = -1; list.forEach(function (x, k) { if (x.id === rec.id) i = k; });
        if (i >= 0) list[i] = rec; else list.push(rec);
        lsSet("srj_users", list);
        return rec;
      });
    },
    excluirUsuario: function (id) {
      if (this.mode === "api") return this.pedir("user&id=" + encodeURIComponent(id), { method: "DELETE" });
      var list = lsGet("srj_users", []).filter(function (x) { return x.id !== id; });
      if (!list.length) return Promise.reject(new Error("É preciso manter ao menos um usuário."));
      lsSet("srj_users", list);
      return Promise.resolve();
    },
    trocarSenha: function (atual, nova) {
      var self = this;
      if (this.mode === "api") {
        return this.pedir("password", { method: "POST", json: { atual: atual, nova: nova } }).then(function () {
          if (self.user) { self.user.trocarSenha = false; lsSet("srj_user", self.user); }
        });
      }
      var list = lsGet("srj_users", []);
      var u = list.filter(function (x) { return x.id === self.user.id; })[0];
      if (!u) return Promise.reject(new Error("Usuário não encontrado."));
      return sha(atual).then(function (h) {
        if (u.hash !== h) throw new Error("Senha atual incorreta.");
        return sha(nova);
      }).then(function (h2) {
        u.hash = h2; u.trocarSenha = false; lsSet("srj_users", list);
        self.user.trocarSenha = false; lsSet("srj_user", self.user);
      });
    },

    /* ---- mensagens dos formulários ---- */
    mensagens: function () {
      if (this.mode === "api") return this.pedir("leads").then(function (j) { return j.leads || []; });
      return Promise.resolve(lsGet("srj_leads", []));
    },
    enviarMensagem: function (l) {
      var rec = { id: U.uid(), quando: new Date().toISOString() };
      for (var k in l) if (Object.prototype.hasOwnProperty.call(l, k)) rec[k] = l[k];
      if (this.mode === "api") return this.pedir("lead", { method: "POST", json: rec }).then(function (j) { return j; });
      var list = lsGet("srj_leads", []);
      list.unshift(rec); lsSet("srj_leads", list.slice(0, 300));
      return Promise.resolve({ ok: true, email: false });
    },
    excluirMensagem: function (id) {
      if (this.mode === "api") return this.pedir("lead&id=" + encodeURIComponent(id), { method: "DELETE" });
      lsSet("srj_leads", lsGet("srj_leads", []).filter(function (x) { return x.id !== id; }));
      return Promise.resolve();
    },

    /* ---- registro de atividades ---- */
    registro: function () {
      if (this.mode === "api") return this.pedir("log").then(function (j) { return j.log || []; });
      return Promise.resolve(lsGet("srj_log", []));
    },
    anotar: function (acao, detalhe) {
      if (this.mode === "api") return Promise.resolve();
      var l = lsGet("srj_log", []);
      l.unshift({ quando: new Date().toISOString(), usuario: (this.user || {}).usuario || "—", acao: acao, detalhe: detalhe || "" });
      lsSet("srj_log", l.slice(0, 200));
      return Promise.resolve();
    }
  };

  /* =====================================================================
     Conteúdo — padrão + alterações salvas no painel
     ===================================================================== */
  var Content = SRJ.Content = {
    overrides: {},
    carregar: function () {
      var self = this;
      return Store.conteudo().then(function (c) { self.overrides = c || {}; }).catch(function () { self.overrides = {}; });
    },
    bruto: function (path) {
      var parts = String(path).split(".");
      var v = SRJ.defaults;
      for (var i = 0; i < parts.length && v != null; i++) v = v[parts[i]];
      return v;
    },
    clonar: function (v) {
      return (typeof v === "object" && v !== null) ? JSON.parse(JSON.stringify(v)) : v;
    },
    /* Devolve o valor de `path` já com as alterações salvas no painel,
       inclusive as que foram salvas em sub-chaves (ex.: "diretoria.titulares"
       ao pedir "diretoria"). */
    get: function (path) {
      var base = Object.prototype.hasOwnProperty.call(this.overrides, path)
        ? this.clonar(this.overrides[path])
        : this.clonar(this.bruto(path));
      var prefixo = path + ".";
      if (typeof base === "object" && base !== null) {
        for (var k in this.overrides) {
          if (!Object.prototype.hasOwnProperty.call(this.overrides, k)) continue;
          if (k.indexOf(prefixo) !== 0) continue;
          var resto = k.slice(prefixo.length).split(".");
          var alvo = base;
          for (var i = 0; i < resto.length - 1; i++) {
            if (typeof alvo[resto[i]] !== "object" || alvo[resto[i]] === null) alvo[resto[i]] = {};
            alvo = alvo[resto[i]];
          }
          alvo[resto[resto.length - 1]] = this.clonar(this.overrides[k]);
        }
      }
      return base;
    },
    set: function (path, valor) {
      var self = this;
      return Store.salvarConteudo(path, valor).then(function () { self.overrides[path] = valor; });
    },
    /* atalho: objeto completo de info */
    info: function () { return this.get("info"); }
  };

  /* =====================================================================
     Links derivados dos dados de contato
     ===================================================================== */
  SRJ.wa = function (texto) {
    var num = String(Content.get("info").whatsapp || "").replace(/\D/g, "");
    if (num.length <= 11) num = "55" + num;
    return "https://wa.me/" + num + (texto ? "?text=" + encodeURIComponent(texto) : "");
  };
  SRJ.tel = function () {
    return "tel:+55" + String(Content.get("info").telefone || "").replace(/\D/g, "");
  };
  SRJ.mapa = function () {
    var i = Content.get("info");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(i.endereco + ", " + i.cidade);
  };
})();
