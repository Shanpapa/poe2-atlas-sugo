/* ============================================================================
   ATLAS SÚGÓ — RENDERER (vanilla JS)
   Beolvassa a window.ATLAS adatot (content.js) és felépíti belőle az oldalt.
   Általában NEM kell ehhez nyúlni — a tartalom a content.js-ben van.
   ========================================================================== */
(function () {
  "use strict";

  var ATLAS = window.ATLAS;
  var mount = document.getElementById("app");
  if (!ATLAS) {
    mount.textContent = "Hiba: a content.js nem töltődött be (nézd meg a böngésző konzolt: F12).";
    return;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";

  // Az oldal állapota. Ezek változására újrarajzoljuk az oldalt.
  var state = {
    goalKey: ATLAS.goals[0].key,
    variant: 0,
    primerOpen: false,
    atlasView: "overview",   // "overview" | "main" | <mechanika neve>
    atlasSel: null,          // a kiválasztott node neve a fókuszált nézetben
    helper: null,            // a Loadout helper UI-állapota (lazy init: ensureHelper)
  };
  var visitCount = null;     // látogatószámláló cache (Abacus API); null = még nincs/elrejtve

  /* --- apró DOM-segédek -------------------------------------------------- */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null) continue;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      }
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.appendChild(typeof child === "object" ? child : document.createTextNode(String(child)));
  }
  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    return node;
  }

  /* --- ikonok (a célokhoz) ---------------------------------------------- */
  function glyph(type) {
    function C(a) { return svgEl("circle", a); }
    function L(a) { return svgEl("line", a); }
    function P(a) { return svgEl("polygon", a); }
    function R(a) { return svgEl("rect", a); }
    function PL(a) { return svgEl("polyline", a); }
    var kids = [];
    if (type === "currency") kids = [C({ cx: 12, cy: 12, r: 8 }), C({ cx: 12, cy: 12, r: 3.2 })];
    else if (type === "breach") kids = [L({ x1: 12, y1: 3, x2: 12, y2: 21 }), L({ x1: 3, y1: 12, x2: 21, y2: 12 }), L({ x1: 6, y1: 6, x2: 18, y2: 18 }), L({ x1: 18, y1: 6, x2: 6, y2: 18 })];
    else if (type === "omen") kids = [P({ points: "12,3 21,12 12,21 3,12" }), C({ cx: 12, cy: 12, r: 2, fill: "currentColor", stroke: "none" })];
    else if (type === "delirium") kids = [C({ cx: 12, cy: 12, r: 8, "stroke-dasharray": "3 3.4" }), C({ cx: 12, cy: 12, r: 3 })];
    else if (type === "boss") kids = [P({ points: "12,3 21,20 3,20" }), C({ cx: 9.2, cy: 15, r: 1, fill: "currentColor", stroke: "none" }), C({ cx: 14.8, cy: 15, r: 1, fill: "currentColor", stroke: "none" })];
    else if (type === "expedition") kids = [P({ points: "12,4 19,8 19,16 12,20 5,16 5,8" }), C({ cx: 12, cy: 12, r: 2.4 })];
    else if (type === "atlas") kids = [L({ x1: 12, y1: 12, x2: 5, y2: 6 }), L({ x1: 12, y1: 12, x2: 19, y2: 7 }), L({ x1: 12, y1: 12, x2: 7, y2: 18 }), L({ x1: 12, y1: 12, x2: 18, y2: 17 }), C({ cx: 12, cy: 12, r: 2.4, fill: "currentColor", stroke: "none" }), C({ cx: 5, cy: 6, r: 1.8 }), C({ cx: 19, cy: 7, r: 1.8 }), C({ cx: 7, cy: 18, r: 1.8 }), C({ cx: 18, cy: 17, r: 1.8 })];
    else if (type === "mapping") kids = [PL({ points: "4,18 9,10 14,15 20,6", fill: "none" }), C({ cx: 4, cy: 18, r: 1.6, fill: "currentColor", stroke: "none" }), C({ cx: 9, cy: 10, r: 1.6, fill: "currentColor", stroke: "none" }), C({ cx: 14, cy: 15, r: 1.6, fill: "currentColor", stroke: "none" }), C({ cx: 20, cy: 6, r: 1.6, fill: "currentColor", stroke: "none" })];
    else if (type === "tablet") kids = [R({ x: 5, y: 3.5, width: 14, height: 17, rx: 2.6 }), P({ points: "12,8.5 15.2,12 12,15.5 8.8,12" }), C({ cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" })];
    else if (type === "helper") kids = [C({ cx: 12, cy: 12, r: 8.2 }), P({ points: "12,5 14.4,12 12,19 9.6,12", fill: "currentColor", stroke: "none" }), C({ cx: 12, cy: 12, r: 1.5, fill: "currentColor", stroke: "none" })];
    var svg = svgEl("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.4, "stroke-linecap": "round", "stroke-linejoin": "round" });
    kids.forEach(function (k) { svg.appendChild(k); });
    return svg;
  }

  function videoHref(goal) { return ATLAS.meta.videoUrl + "?t=" + goal.videoSeconds; }
  function currentGoal() {
    for (var i = 0; i < ATLAS.goals.length; i++) if (ATLAS.goals[i].key === state.goalKey) return ATLAS.goals[i];
    return ATLAS.goals[0];
  }
  function selectGoal(k) { state.goalKey = k; state.variant = 0; state.primerOpen = false; state.atlasView = "overview"; state.atlasSel = null; pushNav(); render(); }

  /* --- Böngésző-history integráció (back-gomb + deep-link) ---------------
     A cél- és atlas-nézet-váltás history-bejegyzést kap, így a böngésző
     Vissza gombja az ELŐZŐ lapra lép, nem ki az oldalról. A hash egyúttal
     megosztható deep-linket is ad (#/<cél>), és frissítés után ott maradsz. */
  function goalByKey(k) { for (var i = 0; i < ATLAS.goals.length; i++) if (ATLAS.goals[i].key === k) return ATLAS.goals[i]; return null; }
  function stateToHash() {
    var g = state.goalKey;
    if (g === "atlasfa" && state.atlasView && state.atlasView !== "overview") return "#/" + g + "/" + encodeURIComponent(state.atlasView);
    return "#/" + g;
  }
  function parseHash() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) return { goal: ATLAS.goals[0].key, view: "overview" };
    var parts = h.split("/").map(function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } });
    return { goal: parts[0], view: parts[1] || "overview" };
  }
  function normView(goalKey, view) {
    if (goalKey !== "atlasfa") return "overview";
    if (view === "overview" || view === "main") return view;
    var g = goalByKey(goalKey);
    return (g && findTree(g, view)) ? view : "overview";
  }
  function pushNav() { var h = stateToHash(); if (location.hash === h) return; try { history.pushState({ goal: state.goalKey, view: state.atlasView }, "", h); } catch (e) {} }
  function applyNav(st) {
    st = st || parseHash();
    state.goalKey = goalByKey(st.goal) ? st.goal : ATLAS.goals[0].key;
    state.atlasView = normView(state.goalKey, st.view);
    state.variant = 0; state.primerOpen = false; state.atlasSel = null;
    render();
  }
  function setAtlasView(view) { state.atlasView = view; state.atlasSel = null; pushNav(); render(); }
  function seeAlsoRow(items) {
    return el("div", { class: "seealso" },
      el("span", { class: "seealso__label", text: "Lásd még" }),
      el("div", { class: "seealso__links" }, (items || []).map(function (it) {
        return el("button", { class: "seealso__link", type: "button", onclick: function () { selectGoal(it.goal); } },
          el("span", { class: "seealso__arrow", text: "→" }), it.text);
      }))
    );
  }

  /* --- fejléc / lábléc --------------------------------------------------- */
  function renderHeader() {
    var M = ATLAS.meta;
    return el("header", { class: "site-header" },
      el("div", { class: "site-header__inner" },
        el("div", { class: "brand" },
          el("span", { class: "brand__mark" }, el("span", { text: "◆" })),
          el("div", {},
            el("div", { class: "brand__title", text: M.title }),
            el("div", { class: "brand__sub", text: M.subtitle })
          )
        ),
        el("div", { class: "header-actions" },
          el("span", { class: "badge-lang", text: M.langBadge }),
          el("a", { class: "link-credit", href: M.credit.url, target: "_blank", rel: "noopener", text: M.credit.label + " ↗" })
        )
      )
    );
  }
  /* --- látogatószámláló (Abacus — signup-mentes counter API) -------------
     Böngészőnként EGYSZER növel (localStorage flag), utána csak olvas →
     ~egyedi látogatókat számol. A valós "visits" csak az éles domainen nő;
     localhoston külön "visits-dev" kulcs, hogy a teszt ne piszkítsa.
     Hiba esetén a számláló rejtve marad, az oldal megy tovább. */
  function fmtHits(n) { try { return Number(n).toLocaleString("hu-HU"); } catch (e) { return String(n); } }
  function fillHits(span, n) {
    span.textContent = "";
    span.appendChild(el("span", { class: "site-footer__hits-ico", text: "◆" }));
    span.appendChild(document.createTextNode(" " + fmtHits(n) + " kalandozó járt itt"));
  }
  function hitsEl() {
    var span = el("span", { class: "site-footer__hits", id: "visitHits" });
    if (visitCount != null) fillHits(span, visitCount);
    return span;
  }
  function initCounter() {
    var NS = "shanpapa.github.io";
    var live = /github\.io$/i.test(location.hostname);
    var key = live ? "visits" : "visits-dev";
    var flag = "poe2_counted_" + key;
    var first = true;
    try { first = !localStorage.getItem(flag); } catch (e) {}
    fetch("https://abacus.jasoncameron.dev/" + (first ? "hit" : "get") + "/" + NS + "/" + key)
      .then(function (r) { if (!r.ok) throw new Error("counter"); return r.json(); })
      .then(function (d) {
        if (!d || typeof d.value !== "number") return;
        visitCount = d.value;
        if (first) { try { localStorage.setItem(flag, "1"); } catch (e) {} }
        var span = document.getElementById("visitHits");
        if (span) fillHits(span, visitCount);
      })
      .catch(function () {});
  }
  function renderFooter() {
    var M = ATLAS.meta;
    return el("footer", { class: "site-footer" },
      el("span", { class: "site-footer__note", text: M.footerNote }),
      el("div", { class: "site-footer__right" },
        hitsEl(),
        el("span", { class: "site-footer__ver", text: M.footerVersion })
      )
    );
  }

  /* --- "Mielőtt belekezdesz" -------------------------------------------- */
  function renderPrimerBody() {
    return ATLAS.primer.body.map(function (seg) {
      if (typeof seg === "string") return document.createTextNode(seg);
      if (seg.term) {
        var pop = el("span", { class: "gloss__pop", text: ATLAS.gloss[seg.gloss] || "" });
        var span = el("span", { class: "gloss" }, seg.term, pop);
        span.addEventListener("click", function (e) { e.stopPropagation(); span.classList.toggle("is-open"); });
        return span;
      }
      if (seg.strong != null) return el("span", { class: "b", text: seg.strong });
      if (seg.hl != null) return el("span", { class: "hl", text: seg.hl });
      return null;
    });
  }
  function renderPrimer() {
    var P = ATLAS.primer;
    return el("section", { class: "primer" },
      el("button", { class: "primer__toggle", type: "button", onclick: function () { state.primerOpen = !state.primerOpen; render(); } },
        el("span", { class: "primer__icon", text: "✦" }),
        el("span", { class: "primer__title", text: P.title }),
        el("span", { class: "primer__hint", text: P.hint }),
        el("span", { class: "primer__chevron", text: state.primerOpen ? "▾" : "▸" })
      ),
      state.primerOpen ? el("div", { class: "primer__body" }, renderPrimerBody()) : null
    );
  }

  /* --- cél-választó ------------------------------------------------------ */
  function renderGoals() {
    var cards = ATLAS.goals.map(function (g) {
      var active = g.key === state.goalKey;
      return el("button", { class: "goal", type: "button", onclick: function () { selectGoal(g.key); } },
        el("span", { class: "goal__top" },
          el("span", { class: "goal__glyph" }, glyph(g.icon)),
          el("span", { class: "goal__label", text: g.label })
        ),
        el("span", { class: "goal__mech", text: g.mech }),
        active ? el("span", { class: "goal__ring" }) : null
      );
    });
    return el("div", {},
      el("div", { class: "section-head" },
        el("h2", { class: "section-head__title", text: ATLAS.ui.goalsTitle }),
        el("span", { class: "section-head__hint", text: ATLAS.ui.goalsHint })
      ),
      el("div", { class: "goals" }, cards)
    );
  }

  /* --- közös elemek ------------------------------------------------------ */
  function pill(k, v) { return el("span", { class: "pill" }, el("span", { class: "pill__k", text: k }), el("span", { class: "pill__v", text: v })); }
  function ksaCol(kind, title, marker, items) {
    return el("div", { class: "ksa__col ksa__col--" + kind },
      el("div", { class: "ksa__head" }, el("span", { class: "ksa__dot" }), el("span", { class: "ksa__title", text: title })),
      el("ul", { class: "ksa__list" }, (items || []).map(function (it) {
        return el("li", { class: "ksa__item" }, el("span", { class: "ksa__marker", text: marker }), el("span", { text: it }));
      }))
    );
  }
  function videoCta(goal) {
    return el("a", { class: "vcta", href: videoHref(goal), target: "_blank", rel: "noopener" },
      el("span", { class: "vcta__play", text: "▶" }),
      el("div", { class: "vcta__main" },
        el("div", { class: "vcta__title", text: ATLAS.ui.videoCtaTitle }),
        el("div", { class: "vcta__sub", text: ATLAS.ui.videoCtaSub })
      ),
      el("span", { class: "vcta__ts", text: goal.videoTime + " ↗" })
    );
  }

  /* --- recept nézet ------------------------------------------------------ */
  function recipeHead(goal) {
    var head = el("div", { class: "rhead" },
      el("span", { class: "rhead__glyph" }, glyph(goal.icon)),
      el("div", { class: "rhead__main" },
        el("div", { class: "rhead__title", text: goal.label }),
        el("div", { class: "rhead__mech", text: goal.mech })
      )
    );
    if (goal.variants.length > 1) {
      head.appendChild(el("div", { class: "vtabs" }, goal.variants.map(function (v, i) {
        return el("button", { class: "vtab" + (i === state.variant ? " is-active" : ""), type: "button", onclick: function () { state.variant = i; render(); }, text: v.name });
      })));
    }
    return head;
  }
  function renderRecipe(goal) {
    var L = ATLAS.ui, LV = ATLAS.levels;
    var vi = Math.min(state.variant, goal.variants.length - 1);
    var v = goal.variants[vi];
    var sec = el("section", {}, recipeHead(goal));

    if (goal.intro) sec.appendChild(el("p", { class: "intro", text: goal.intro }));

    sec.appendChild(el("div", { class: "pills" },
      pill("Master", v.master), pill("Map", v.map.split("+")[0].trim()), pill("Waystone", v.waystone)
    ));

    if (v.warn) sec.appendChild(el("div", { class: "warn" }, el("span", { class: "warn__icon", text: "⚠" }), el("div", { class: "warn__text", text: v.warn })));

    var waycraft = el("div", { class: "waycraft" }, el("span", { class: "waycraft__main", text: v.waystone }));
    if (v.mapcraft) waycraft.appendChild(el("span", { class: "waycraft__craft", text: v.mapcraft }));

    var left = el("div", { class: "cols__left" },
      el("div", { class: "card" },
        el("div", { class: "card__label", text: L.labelPassives }),
        el("div", { class: "passives" }, v.passives.map(function (p) { return el("span", { class: "passive", text: p }); }))
      ),
      el("div", { class: "card" },
        el("div", { class: "card__label", text: L.labelTablets }),
        el("div", { class: "tablets" }, v.tablets.map(function (tb) {
          var main = el("div", { class: "tablet__main" }, el("div", { class: "tablet__name", text: tb.name }));
          if (tb.note) main.appendChild(el("div", { class: "tablet__note", text: tb.note }));
          return el("div", { class: "tablet" }, el("span", { class: "tablet__qty", text: tb.qty }), main);
        }))
      ),
      el("div", { class: "card" },
        el("div", { class: "card__label card__label--tight", text: L.labelWaystone }),
        waycraft
      )
    );

    var right = el("div", { class: "cols__right" },
      el("div", { class: "mods__head" },
        el("div", { class: "mods__title", text: L.modsTitle }),
        el("span", { class: "mods__hint", text: L.modsHint })
      ),
      el("div", { class: "legend" },
        el("span", { class: "legend-badge lvl-c--mandatory", text: LV.mandatory }),
        el("span", { class: "legend-badge lvl-c--strong", text: LV.strong }),
        el("span", { class: "legend-badge lvl-c--nice", text: LV.nice })
      ),
      el("div", { class: "mods__list" }, v.mods.map(function (m) {
        return el("div", { class: "mod" },
          el("div", { class: "mod__row" },
            el("div", { class: "mod__name", text: m.name }),
            el("span", { class: "mod__badge lvl-c--" + m.level, text: LV[m.level] || m.level })
          ),
          el("div", { class: "mod__why", text: m.why })
        );
      }))
    );

    sec.appendChild(el("div", { class: "cols" }, left, right));
    sec.appendChild(el("div", { class: "ksa" },
      ksaCol("keep", L.ksaKeep, "+", v.keep),
      ksaCol("sell", L.ksaSell, "→", v.sell),
      ksaCol("avoid", L.ksaAvoid, "×", v.avoid)
    ));
    sec.appendChild(videoCta(goal));
    return sec;
  }

  /* --- delirium nézet ---------------------------------------------------- */
  function renderDelirium(goal) {
    var L = ATLAS.ui;
    var sec = el("section", {},
      el("div", { class: "rhead" },
        el("span", { class: "rhead__glyph rhead__glyph--purple" }, glyph(goal.icon)),
        el("div", { class: "rhead__main" },
          el("div", { class: "rhead__title", text: goal.label }),
          el("div", { class: "rhead__mech", text: goal.mech })
        )
      ),
      el("div", { class: "pills" }, pill("Master", goal.master), pill("Map", goal.map)),
      el("div", { class: "deli-concept" }, el("div", { class: "deli-concept__text", text: goal.concept })),
      el("div", { class: "combo-title" }, L.comboTitle + " ", el("span", { class: "combo-title__note", text: L.comboTitleNote }))
    );

    goal.combo.forEach(function (c) {
      var bars = [1, 2, 3].map(function (n) { return el("span", { class: "combo__bar" + (n <= c.strength ? " is-on" : "") }); });
      sec.appendChild(el("div", { class: "combo combo--t" + c.rank + (c.rank === 1 ? " is-top" : "") },
        el("div", { class: "combo__row" },
          el("span", { class: "combo__rank", text: c.rank }),
          el("div", { class: "combo__main" },
            el("div", { class: "combo__nameRow" },
              el("span", { class: "combo__name", text: c.title }),
              el("span", { class: "combo__tier", text: c.tier + "-tier" })
            ),
            el("div", { class: "combo__desc", text: c.desc })
          ),
          el("div", { class: "combo__bars" }, bars)
        )
      ));
    });

    sec.appendChild(el("div", { class: "rewards" },
      el("div", { class: "card__label card__label--tight", text: L.rewardsLabel }),
      el("div", { class: "rewards__text", text: goal.rewards })
    ));
    if (goal.seealso) sec.appendChild(seeAlsoRow(goal.seealso));
    sec.appendChild(videoCta(goal));
    return sec;
  }

  /* --- "Hamarosan" placeholder ------------------------------------------ */
  function renderStub(goal) {
    var L = ATLAS.ui;
    return el("section", { class: "stub" },
      el("div", { class: "stub__glyph" }, glyph(goal.icon)),
      el("div", { class: "stub__badge", text: L.stubBadge }),
      el("h3", { class: "stub__title", text: goal.label }),
      el("p", { class: "stub__note", text: goal.note }),
      el("a", { class: "stub__cta", href: videoHref(goal), target: "_blank", rel: "noopener" },
        el("span", { class: "stub__cta-play", text: "▶" }),
        L.videoCtaTitle + " · " + goal.videoTime
      )
    );
  }

  /* --- Atlas passzív fa: áttekintő (node-ábrás emblémák) + szöveges fókusz ---
     Az ÁTTEKINTŐN maradnak a kis node-ábrás emblémák (jól mutatnak). A
     FÓKUSZÁLT (mechanika-) nézetből kivettük a nagy, címkézett konstellációt —
     ott csak a szöveges panel van. A valódi node-ábrázolás később jön. */
  var atlasUid = 0;
  function auid() { return "ag" + (++atlasUid); }
  function svgText(attrs, str) { var t = svgEl("text", attrs); t.textContent = str; return t; }
  function atlasLvl(level) {
    if (level === "mandatory") return { c: "#e7c987", glow: "rgba(231,201,135,.8)" };
    if (level === "strong") return { c: "#bcabe8", glow: "rgba(188,171,232,.5)" };
    return { c: "#8a8578", glow: "rgba(138,133,120,.3)" };
  }
  function atlasIcon(name) {
    if (/Ritual/i.test(name)) return "❇";
    if (/Delirium/i.test(name)) return "◈";
    if (/Breach/i.test(name)) return "✦";
    if (/Abyss/i.test(name)) return "◉";
    if (/Temple/i.test(name)) return "△";
    return "◆";
  }
  function atlasRng(seed) {
    var s = seed >>> 0;
    return function () { s = (s + 0x6D2B79F5) >>> 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function atlasSeed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function ringPos(i, n, r, cx, cy, start) { var a = (start == null ? -Math.PI / 2 : start) + (i / Math.max(1, n)) * Math.PI * 2; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; }
  function findTree(goal, name) { for (var i = 0; i < goal.trees.length; i++) if (goal.trees[i].name === name) return goal.trees[i]; return null; }
  // poe2db deep-link a node-hoz. Tiszta neveknél direkt oldal; mondat-szerű vagy
  // bizonytalan (?) neveknél Google-keresés fallback (hogy ne legyen törött link).
  function poe2dbUrl(name) {
    var n = String(name).trim();
    // Tiszta angol node-név (betű/szám/szóköz/aposztróf/kötőjel) → direkt poe2db oldal
    // (az aposztróf KELL, pl. Traveller's_Woe).
    if (/^[A-Za-z0-9 '\-]+$/.test(n)) return "https://poe2db.tw/us/" + encodeURI(n.replace(/ /g, "_"));
    // Mondat-szerű / bizonytalan (?) / idézőjeles név → Google-keresés (nincs törött link).
    var clean = n.replace(/[„""''‚‘’.…!?:,()]/g, "").replace(/\s+/g, " ").trim();
    return "https://www.google.com/search?q=" + encodeURIComponent("poe2db PoE2 " + clean);
  }
  function keyNodes(tree) {
    var key = tree.nodes.filter(function (n) { return n.level !== "nice"; });
    if (key.length < 3) key = tree.nodes.slice(0, Math.min(4, tree.nodes.length));
    if (key.length > 7) key = key.slice(0, 7);
    return key;
  }

  function stoneDefs(id) {
    var g = svgEl("radialGradient", { id: id, cx: "50%", cy: "40%", r: "68%" });
    g.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#24221b" }));
    g.appendChild(svgEl("stop", { offset: "58%", "stop-color": "#14130f" }));
    g.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#0a0a0c" }));
    var d = svgEl("defs", {}); d.appendChild(g); return d;
  }
  function triPoints(cx, cy, rr) { var p = []; for (var k = 0; k < 3; k++) { var a = -Math.PI / 2 + k * (Math.PI * 2 / 3); p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); } return p.join(" "); }
  function frameCircle(cx, cy, r, gradId, accent) {
    var out = [];
    out.push(svgEl("circle", { cx: cx, cy: cy, r: r, fill: "url(#" + gradId + ")", stroke: accent, "stroke-width": 2.5 }));
    out.push(svgEl("circle", { cx: cx, cy: cy, r: r - 7, fill: "none", stroke: "rgba(203,169,104,.18)", "stroke-width": 1 }));
    out.push(svgEl("circle", { cx: cx, cy: cy, r: r * 0.8, fill: "none", stroke: "rgba(255,255,255,.05)", "stroke-width": 1, "stroke-dasharray": "2 6" }));
    var ticks = 48;
    for (var i = 0; i < ticks; i++) {
      var a = (i / ticks) * Math.PI * 2, r1 = r - 2.5, r2 = r - (i % 4 === 0 ? 9 : 5.5);
      out.push(svgEl("line", { x1: cx + r1 * Math.cos(a), y1: cy + r1 * Math.sin(a), x2: cx + r2 * Math.cos(a), y2: cy + r2 * Math.sin(a), stroke: "rgba(203,169,104,.28)", "stroke-width": i % 4 === 0 ? 1.1 : 0.6 }));
    }
    return out;
  }
  function frameTriangle(cx, cy, r, gradId, accent) {
    return [
      svgEl("polygon", { points: triPoints(cx, cy, r), fill: "url(#" + gradId + ")", stroke: accent, "stroke-width": 2.5, "stroke-linejoin": "round" }),
      svgEl("polygon", { points: triPoints(cx, cy, r - 9), fill: "none", stroke: "rgba(203,169,104,.18)", "stroke-width": 1, "stroke-linejoin": "round" })
    ];
  }
  function backdrop(cx, cy, r, seed) {
    var out = [], rnd = atlasRng(seed), n = 22, pts = [];
    for (var i = 0; i < n; i++) { var a = rnd() * Math.PI * 2, rr = (0.25 + rnd() * 0.6) * r; pts.push({ x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) }); }
    for (var j = 0; j < n; j++) { var k = (j + 1 + Math.floor(rnd() * 3)) % n; out.push(svgEl("line", { x1: pts[j].x, y1: pts[j].y, x2: pts[k].x, y2: pts[k].y, stroke: "rgba(203,169,104,.07)", "stroke-width": 0.6 })); }
    for (var m = 0; m < n; m++) out.push(svgEl("circle", { cx: pts[m].x, cy: pts[m].y, r: 1.3, fill: "rgba(203,169,104,.13)" }));
    return out;
  }
  function nodeDot(parent, x, y, rad, level, glow) {
    var Lc = atlasLvl(level);
    parent.appendChild(svgEl("circle", { cx: x, cy: y, r: rad + 3, fill: "none", stroke: Lc.c, "stroke-width": 1, opacity: 0.35 }));
    var c = svgEl("circle", { cx: x, cy: y, r: rad, fill: Lc.c, opacity: level === "nice" ? 0.55 : 0.95 });
    if (glow || level === "mandatory") c.setAttribute("style", "filter:drop-shadow(0 0 4px " + Lc.glow + ")");
    parent.appendChild(c);
  }

  function medallionGroup(tree, cx, cy, r) {
    var g = svgEl("g", { class: "atlas-med" });
    var gid = auid(); g.appendChild(stoneDefs(gid));
    var isTri = /Temple/i.test(tree.name), accent = "rgba(150,120,80,.55)";
    (isTri ? frameTriangle(cx, cy, r, gid, accent) : frameCircle(cx, cy, r, gid, accent)).forEach(function (e) { g.appendChild(e); });
    backdrop(cx, cy, r, atlasSeed(tree.name)).forEach(function (e) { g.appendChild(e); });
    var key = keyNodes(tree), ring = key.slice(1), rr = (isTri ? 0.5 : 0.62) * r;
    ring.forEach(function (nd, i) {
      var p = ringPos(i, ring.length, rr, cx, cy, -Math.PI / 2 + 0.3), Lc = atlasLvl(nd.level);
      g.appendChild(svgEl("line", { x1: cx, y1: cy, x2: p.x, y2: p.y, stroke: Lc.c, "stroke-width": nd.level === "mandatory" ? 1.6 : 1.1, opacity: nd.level === "mandatory" ? 0.8 : 0.4 }));
    });
    ring.forEach(function (nd, i) { var p = ringPos(i, ring.length, rr, cx, cy, -Math.PI / 2 + 0.3); nodeDot(g, p.x, p.y, nd.level === "nice" ? 3.2 : 4.2, nd.level, false); });
    nodeDot(g, cx, cy, 7, (key[0] || {}).level || "strong", true);
    var labelY = (isTri ? cy + r * 0.6 : cy + r) + 26;
    g.appendChild(svgText({ x: cx, y: labelY, "text-anchor": "middle", fill: "#e1d9c6", "font-family": "'Cinzel',serif", "font-weight": "700", "font-size": "16", "letter-spacing": "1.2" }, tree.name));
    g.appendChild(svgText({ x: cx, y: labelY + 16, "text-anchor": "middle", fill: "#857f6e", "font-family": "'JetBrains Mono',monospace", "font-size": "10.5" }, tree.sub || ""));
    g.addEventListener("click", function () { setAtlasView(tree.name); });
    return g;
  }
  function mainMedallionGroup(goal, cx, cy, r) {
    var g = svgEl("g", { class: "atlas-med" });
    var gid = auid(); g.appendChild(stoneDefs(gid));
    frameCircle(cx, cy, r, gid, "rgba(150,120,80,.55)").forEach(function (e) { g.appendChild(e); });
    backdrop(cx, cy, r, atlasSeed("MAIN")).forEach(function (e) { g.appendChild(e); });
    var steps = goal.steps, n = steps.length, top = cy - r * 0.72, span = r * 1.44;
    var pts = steps.map(function (s, i) { return { x: cx + r * 0.5 * Math.sin(i * 0.95), y: top + (i / (n - 1)) * span, n: i + 1 }; });
    var path = pts.map(function (p) { return p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" ");
    g.appendChild(svgEl("polyline", { points: path, fill: "none", stroke: "rgba(231,201,135,.2)", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }));
    g.appendChild(svgEl("polyline", { points: path, fill: "none", stroke: "#e7c987", "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": "1 8", style: "animation:atlasDash 1.4s linear infinite;filter:drop-shadow(0 0 5px rgba(231,201,135,.65))" }));
    pts.forEach(function (p) {
      g.appendChild(svgEl("circle", { cx: p.x, cy: p.y, r: 9, fill: "#15140f", stroke: "#e7c987", "stroke-width": 1.5, style: "filter:drop-shadow(0 0 4px rgba(231,201,135,.5))" }));
      g.appendChild(svgText({ x: p.x, y: p.y + 3.2, "text-anchor": "middle", "font-size": "9.5", "font-weight": "700", fill: "#e7c987", "font-family": "'JetBrains Mono',monospace" }, String(p.n)));
    });
    g.appendChild(svgText({ x: cx, y: cy + r + 28, "text-anchor": "middle", fill: "#f0ead9", "font-family": "'Cinzel',serif", "font-weight": "700", "font-size": "19", "letter-spacing": "2" }, "FŐ ATLAS-FA"));
    g.appendChild(svgText({ x: cx, y: cy + r + 46, "text-anchor": "middle", fill: "#9a9277", "font-family": "'JetBrains Mono',monospace", "font-size": "11" }, "sustain-first · 1 → 10 · kezdd itt"));
    g.addEventListener("click", function () { setAtlasView("main"); });
    return g;
  }
  function atlasOverview(goal) {
    var svg = svgEl("svg", { class: "atlas-scene", viewBox: "0 0 1200 920", preserveAspectRatio: "xMidYMid meet" });
    var main = { x: 600, y: 300, r: 178 };
    var sat = { "Ritual": { x: 168, y: 360, r: 96 }, "Vaal Temple": { x: 1032, y: 360, r: 104 }, "Delirium": { x: 300, y: 720, r: 96 }, "Breach": { x: 600, y: 752, r: 96 }, "Abyss": { x: 900, y: 720, r: 96 } };
    Object.keys(sat).forEach(function (name) { var s = sat[name]; svg.appendChild(svgEl("line", { x1: main.x, y1: main.y, x2: s.x, y2: s.y, stroke: "rgba(203,169,104,.14)", "stroke-width": 1.2, "stroke-dasharray": "2 5" })); });
    goal.trees.forEach(function (t) { var s = sat[t.name]; if (s) svg.appendChild(medallionGroup(t, s.x, s.y, s.r)); });
    svg.appendChild(mainMedallionGroup(goal, main.x, main.y, main.r));
    return svg;
  }

  function mechPanel(tree) {
    var LV = ATLAS.levels;
    var panel = el("div", { class: "atlas-focus__panel" },
      el("div", { class: "atlas-panel__head" },
        el("span", { class: "atlas-panel__name", text: tree.name }),
        tree.sub ? el("span", { class: "atlas-panel__sub", text: tree.sub }) : null
      ),
      tree.note ? el("div", { class: "atlas-panel__note", text: tree.note }) : null
    );
    if (tree.best) panel.appendChild(el("div", { class: "bestline" }, el("div", { class: "bestline__label", text: "Legerősebb vonal" }), el("div", { class: "bestline__text", text: tree.best })));
    panel.appendChild(el("div", { class: "atlas-mods__head" },
      el("span", { class: "card__label", text: ATLAS.ui.modsTitle }),
      el("span", { class: "mods__hint", text: "node-ok fontosság szerint" })
    ));
    tree.nodes.forEach(function (nd) {
      var active = state.atlasSel === nd.name;
      panel.appendChild(el("div", { class: "atlas-noderow" + (active ? " is-active" : ""), onclick: function () { state.atlasSel = active ? null : nd.name; render(); } },
        el("div", { class: "atlas-noderow__top" },
          el("span", { class: "atlas-noderow__dot lc-" + nd.level }),
          el("span", { class: "atlas-noderow__name", text: nd.name }),
          el("span", { class: "mod__badge lvl-c--" + nd.level, text: LV[nd.level] || nd.level }),
          el("a", { class: "atlas-noderow__link", href: poe2dbUrl(nd.name), target: "_blank", rel: "noopener", onclick: function (e) { e.stopPropagation(); }, text: "poe2db ↗" })
        ),
        el("div", { class: "atlas-noderow__why", text: nd.why })
      ));
    });
    if (tree.terms) panel.appendChild(el("div", { class: "termlist" }, tree.terms.map(function (tm) {
      return el("div", { class: "term" }, el("span", { class: "term__k", text: tm.k + ":" }), el("span", { text: tm.v }));
    })));
    return panel;
  }
  function atlasMechFocus(goal, tree) { return el("div", { class: "atlas-focus" }, mechPanel(tree)); }
  function atlasMainFocus(goal) {
    var wrap = el("div", { class: "atlas-mainfocus" },
      el("div", { class: "atlas-banner" },
        el("span", { class: "atlas-banner__k", text: "Sustain-first útvonal" }),
        el("span", { class: "atlas-banner__v", text: "— rakd a pontokat ebben a sorrendben, fentről le. A többi node ráér." })
      )
    );
    goal.steps.forEach(function (s, i) {
      wrap.appendChild(el("div", { class: "astep" },
        el("span", { class: "astep__n", text: i + 1 }),
        el("div", { class: "astep__body" },
          el("div", { class: "astep__title", text: s.title }),
          el("div", { class: "astep__detail", text: s.detail }),
          s.nodes ? el("div", { class: "passives" }, s.nodes.map(function (n) { return el("span", { class: "passive", text: n }); })) : null
        )
      ));
    });
    return wrap;
  }

  function renderAtlasTree(goal) {
    var view = state.atlasView || "overview";
    var caption;
    if (view === "overview") caption = "Válassz: a fő fa (kezdő útvonal) vagy egy mechanika. Kattints egy kategóriára.";
    else if (view === "main") caption = "Fő Atlas-fa — kövesd a kiemelt, sustain-first útvonalat sorrendben.";
    else { var t0 = findTree(goal, view); caption = t0 ? (t0.name + " — node-ok fontosság szerint, a legerősebb vonallal.") : ""; }

    var capRow = el("div", { class: "atlas-caption" });
    if (view !== "overview") capRow.appendChild(el("button", { class: "atlas-back", type: "button", onclick: function () { setAtlasView("overview"); } }, "← Áttekintés"));
    capRow.appendChild(el("span", { class: "atlas-caption__text", text: caption }));
    capRow.appendChild(el("div", { class: "atlas-legend" },
      el("span", {}, el("i", { class: "lc-mandatory" }), "Kötelező"),
      el("span", {}, el("i", { class: "lc-strong" }), "Erős"),
      el("span", {}, el("i", { class: "lc-nice" }), "Jó ha van")
    ));

    var sec = el("section", {}, capRow);
    if (view === "overview") sec.appendChild(atlasOverview(goal));
    else if (view === "main") sec.appendChild(atlasMainFocus(goal));
    else { var t = findTree(goal, view); sec.appendChild(t ? atlasMechFocus(goal, t) : atlasOverview(goal)); }
    sec.appendChild(videoCta(goal));
    return sec;
  }

  /* --- Guide nézet (type: "guide") — generikus blokk-renderer ------------
     A blokk-alapú kezdő referencia-lapok motorja. Egy goal `blocks[]` tömböt
     ad meg; minden blokknak van egy `kind`-je. Új blokktípushoz: új ág a
     renderGuideBlock()-ban + (ha kell) minimális CSS a styles.css végén. */
  function gLabel(text, hint) {
    if (!text) return null;
    return el("div", { class: "gblock__head" },
      el("span", { class: "gblock__label", text: text }),
      hint ? el("span", { class: "gblock__hint", text: hint }) : null
    );
  }
  function guideSlotboard(b) {
    var col = el("div", { class: "slotboard__col" });
    col.appendChild(el("div", { class: "slot slot--way" },
      el("span", { class: "slot__ic", text: "▣" }),
      el("div", { class: "slot__main" },
        el("div", { class: "slot__title", text: b.waystone.title }),
        el("div", { class: "slot__sub", text: b.waystone.sub })
      )
    ));
    (b.tablets || []).forEach(function (t) {
      col.appendChild(el("div", { class: "slot slot--tab" },
        el("span", { class: "slot__ic", text: "◈" }),
        el("div", { class: "slot__main" },
          el("div", { class: "slot__title", text: t.title }),
          el("div", { class: "slot__sub", text: t.sub })
        )
      ));
    });
    var board = el("div", { class: "slotboard" },
      col,
      el("div", { class: "slotboard__arrow", text: "→" }),
      el("div", { class: "slot slot--result" },
        el("div", { class: "slot__title", text: b.result.title }),
        el("div", { class: "slot__sub", text: b.result.sub })
      )
    );
    var wrap = el("div", {}, board);
    if (b.myth) wrap.appendChild(el("div", { class: "mythstrip" },
      el("span", { class: "mythstrip__ic", text: "⚠" }),
      el("div", {}, el("span", { class: "mythstrip__t", text: b.myth.title + " " }), b.myth.text)
    ));
    return wrap;
  }
  function renderGuideBlock(b) {
    var LV = ATLAS.levels;
    if (b.kind === "keypoints") {
      return el("div", { class: "gblock" }, gLabel(b.label),
        el("div", { class: "keypoints" }, (b.items || []).map(function (it, i) {
          return el("div", { class: "kpoint" },
            el("span", { class: "kpoint__n", text: String(i + 1) }),
            el("div", { class: "kpoint__text", text: it })
          );
        }))
      );
    }
    if (b.kind === "slotboard") {
      return el("div", { class: "gblock" }, gLabel(b.label), guideSlotboard(b));
    }
    if (b.kind === "cards") {
      return el("div", { class: "gblock" }, gLabel(b.label, b.hint),
        el("div", { class: "gcards" + (b.cols ? " gcards--" + b.cols : "") }, (b.items || []).map(function (c) {
          return el("div", { class: "gcard" + (c.tone ? " tone-" + c.tone : "") },
            el("div", { class: "gcard__head" },
              c.sym ? el("span", { class: "gcard__sym", text: c.sym }) : null,
              el("span", { class: "gcard__title", text: c.title }),
              c.badge ? el("span", { class: "gcard__badge" + (c.tone ? " tone-" + c.tone : ""), text: c.badge }) : null
            ),
            c.desc ? el("div", { class: "gcard__desc", text: c.desc }) : null
          );
        }))
      );
    }
    if (b.kind === "pills") {
      return el("div", { class: "gblock" }, gLabel(b.label),
        el("div", { class: "pills" }, (b.items || []).map(function (p) { return pill(p.k, p.v); }))
      );
    }
    if (b.kind === "mods") {
      var legend = b.legend ? el("div", { class: "legend" },
        el("span", { class: "legend-badge lvl-c--mandatory", text: LV.mandatory }),
        el("span", { class: "legend-badge lvl-c--strong", text: LV.strong }),
        el("span", { class: "legend-badge lvl-c--nice", text: LV.nice })
      ) : null;
      var list = el("div", { class: "mods__list" }, (b.items || []).map(function (m) {
        return el("div", { class: "mod" },
          el("div", { class: "mod__row" },
            el("div", { class: "mod__name", text: m.name }),
            el("span", { class: "mod__badge lvl-c--" + m.level, text: LV[m.level] || m.level })
          ),
          el("div", { class: "mod__why", text: m.why })
        );
      }));
      return el("div", { class: "gblock" }, gLabel(b.label, b.hint), legend, el("div", { class: "card" }, list));
    }
    if (b.kind === "callout") {
      var tone = b.tone || "info";
      var box = el("div", { class: "callout callout--" + tone },
        el("div", { class: "callout__head" },
          el("span", { class: "callout__icon", text: b.icon || (tone === "warn" ? "⚠" : tone === "good" ? "✦" : "◈") }),
          el("span", { class: "callout__title", text: b.title })
        )
      );
      if (b.text) box.appendChild(el("div", { class: "callout__text", text: b.text }));
      if (b.items) box.appendChild(el("ul", { class: "callout__list" }, b.items.map(function (it) { return el("li", { text: it }); })));
      return el("div", { class: "gblock" }, box);
    }
    if (b.kind === "pairings") {
      return el("div", { class: "gblock" }, gLabel(b.label),
        el("div", { class: "pairings" }, (b.items || []).map(function (p) {
          return el("div", { class: "pair" },
            el("div", { class: "pair__sit", text: p.situation }),
            el("div", { class: "pair__flow" },
              el("span", { class: "pair__chip pair__chip--map" }, el("span", { class: "pair__chipk", text: "MAP" }), el("span", { class: "pair__chipv", text: p.map })),
              el("span", { class: "pair__arrow", text: "→" }),
              el("span", { class: "pair__chip pair__chip--tab" }, el("span", { class: "pair__chipk", text: "TABLET" }), el("span", { class: "pair__chipv", text: p.tablet }))
            ),
            el("div", { class: "pair__why", text: p.why })
          );
        }))
      );
    }
    if (b.kind === "steps") {
      var wrap = el("div", { class: "gblock" }, gLabel(b.label, b.hint));
      if (b.intro) wrap.appendChild(el("div", { class: "gblock__intro", text: b.intro }));
      (b.items || []).forEach(function (s, i) {
        wrap.appendChild(el("div", { class: "astep" },
          el("span", { class: "astep__n", text: i + 1 }),
          el("div", { class: "astep__body" },
            el("div", { class: "astep__title", text: s.title }),
            el("div", { class: "astep__detail", text: s.detail }),
            s.tags ? el("div", { class: "passives" }, s.tags.map(function (t) { return el("span", { class: "passive", text: t }); })) : null
          )
        ));
      });
      return wrap;
    }
    if (b.kind === "tiers") {
      return el("div", { class: "gblock" }, gLabel(b.label, b.hint),
        el("div", { class: "tierlist" }, (b.items || []).map(function (t) {
          var tcls = t.tier === "S" ? "mandatory" : (t.tier === "A" ? "strong" : "nice");
          return el("div", { class: "tier-row" },
            el("span", { class: "tier-badge lvl-c--" + tcls, text: t.tier }),
            el("span", { class: "tier-name", text: t.name }),
            el("span", { class: "tier-price lvl-c--" + tcls, text: t.price })
          );
        }))
      );
    }
    if (b.kind === "prose") {
      var card = el("div", { class: "card guide-prose" });
      (b.paras || []).forEach(function (p) { card.appendChild(el("p", { class: "guide-prose__p", text: p })); });
      return el("div", { class: "gblock" }, gLabel(b.label), card);
    }
    if (b.kind === "sources") {
      return el("div", { class: "gblock" }, gLabel(b.label || "Források"),
        el("div", { class: "sources" }, (b.items || []).map(function (s) {
          return el("a", { class: "source-link", href: s.url, target: "_blank", rel: "noopener", text: s.label + " ↗" });
        }))
      );
    }
    if (b.kind === "seealso") {
      return el("div", { class: "gblock" }, seeAlsoRow(b.items));
    }
    if (b.kind === "tradesearch") {
      /* Trade-site-szerű stat-panel kártyák + direct link gomb.
         item: { title, badge, tone, sym, desc, groups:[{heading, need, stats:[{name,min,implicit}]}], url } */
      return el("div", { class: "gblock" }, gLabel(b.label, b.hint),
        el("div", { class: "tsearches" }, (b.items || []).map(function (s) {
          var card = el("div", { class: "tsearch" + (s.tone ? " tone-" + s.tone : "") });
          card.appendChild(el("div", { class: "tsearch__head" },
            el("span", { class: "tsearch__sym", text: s.sym || "◈" }),
            el("span", { class: "tsearch__title", text: s.title }),
            s.badge ? el("span", { class: "gcard__badge" + (s.tone ? " tone-" + s.tone : ""), text: s.badge }) : null
          ));
          if (s.desc) card.appendChild(el("div", { class: "tsearch__desc", text: s.desc }));
          var panel = el("div", { class: "tsearch__panel" });
          (s.groups || []).forEach(function (g) {
            var grp = el("div", { class: "tsgroup" },
              el("div", { class: "tsgroup__head" },
                el("span", { class: "tsgroup__name", text: g.heading }),
                g.need ? el("span", { class: "tsgroup__need", text: g.need }) : null
              )
            );
            (g.stats || []).forEach(function (st) {
              grp.appendChild(el("div", { class: "tsrow" },
                st.implicit ? el("span", { class: "tsrow__imp", text: "implicit" }) : null,
                el("span", { class: "tsrow__name", text: st.name }),
                st.min != null ? el("span", { class: "tsrow__min", text: "min " + st.min }) : null
              ));
            });
            panel.appendChild(grp);
          });
          card.appendChild(panel);
          card.appendChild(el("div", { class: "tsearch__foot" },
            s.note ? el("div", { class: "tsearch__note", text: s.note }) : el("span"),
            el("a", { class: "tsearch__btn", href: s.url, target: "_blank", rel: "noopener" },
              el("span", { text: "Keresés megnyitása" }),
              el("span", { class: "tsearch__btnarrow", text: "↗" })
            )
          ));
          return card;
        }))
      );
    }
    return null;
  }
  function renderGuide(goal) {
    var head = el("div", { class: "rhead" },
      el("span", { class: "rhead__glyph" }, glyph(goal.icon)),
      el("div", { class: "rhead__main" },
        el("div", { class: "rhead__title", text: goal.label }),
        el("div", { class: "rhead__mech", text: goal.mech })
      ),
      goal.patch ? el("span", { class: "guide-patch", text: goal.patch }) : null
    );
    var sec = el("section", {}, head);
    if (goal.intro) sec.appendChild(el("p", { class: "intro", text: goal.intro }));
    (goal.blocks || []).forEach(function (b) { sec.appendChild(renderGuideBlock(b)); });
    if (goal.videoSeconds) sec.appendChild(videoCta(goal));
    return sec;
  }

  /* --- Loadout helper: interaktív „mim van → mit toljak" --------------------
     A katalógus a guides/helper.js-ben (goal.tabletTypes / waystoneFields /
     archetypes / decision). Itt csak a PONTOZÓ logika + az interaktív UI van.
     Az állapot a state.helper-ben él (navigáció közt is megmarad); a vezérlők
     csak a helper-blokkot rajzolják újra (paint), nem az egész oldalt → a
     görgetés nem ugrik. */
  function ensureHelper() {
    if (!state.helper) state.helper = { tablets: {}, tabletItems: {}, openTypes: {}, ws: {}, tier: "high", wsMods: 6, surv: "ok", detailOpen: false };
    if (!state.helper.tabletItems) state.helper.tabletItems = {};
    if (!state.helper.openTypes) state.helper.openTypes = {};
    return state.helper;
  }
  function modTierBonus(t) { return t === "jackpot" ? 0.08 : t === "strong" ? 0.05 : 0.02; }
  function metaWeight(key) {
    if (key === "abyss" || key === "expedition") return 0.12;
    if (key === "breach" || key === "delirium") return 0.08;
    if (key === "ritual" || key === "vaal") return 0.05;
    return 0.04; // sustain / juice (mindig releváns alap)
  }
  function tabletTypeByKey(goal, key) {
    var T = goal.tabletTypes || [];
    for (var i = 0; i < T.length; i++) if (T[i].key === key) return T[i];
    return null;
  }
  function slotsFromMods(m) { return m >= 6 ? 3 : m >= 3 ? 2 : 1; }
  // egy KONKRÉT tablet értéke = a rajta bepipált modok tier-bónuszainak összege
  function tabletItemValue(tt, ms) {
    var v = 0; if (!tt || !tt.mods || !ms) return 0;
    for (var i = 0; i < tt.mods.length; i++) if (ms[tt.mods[i].key]) v += modTierBonus(tt.mods[i].tier);
    return v;
  }
  // a felhasználó adott típusú tabletjei érték szerint csökkenőben ({idx, ms, value})
  function rankTablets(goal, H, typeKey) {
    var tt = tabletTypeByKey(goal, typeKey);
    var items = (H.tabletItems && H.tabletItems[typeKey]) || [];
    return items.map(function (ms, i) { return { idx: i, ms: ms || {}, value: tabletItemValue(tt, ms || {}) }; })
      .sort(function (a, b) { return b.value - a.value; });
  }
  function tabletItemMods(tt, ms) {
    var out = []; if (!tt || !tt.mods || !ms) return out;
    for (var i = 0; i < tt.mods.length; i++) if (ms[tt.mods[i].key]) out.push(tt.mods[i].name);
    return out;
  }
  function slotQuality(v) { return v >= 0.13 ? "jackpot" : v >= 0.08 ? "erős" : v > 0 ? "ok" : "üres"; }
  function huArt(name) { return /^[aeiouáéíóöőúüű]/i.test(String(name || "")) ? "az" : "a"; }
  function scoreArchetype(a, H, goal) {
    var want = a.want || {}, ideal = want.ideal || 3;
    var have = (H.tablets[want.tablet] || 0);
    var tabletFit = ideal ? Math.min(have, ideal) / ideal : 0;
    var likes = a.wsLikes || [], got = 0;
    for (var i = 0; i < likes.length; i++) if (H.ws[likes[i]]) got++;
    var wsFit = likes.length ? got / likes.length : 0.5;
    var score = tabletFit * 0.6 + wsFit * 0.2 + metaWeight(a.key);
    if ((a.alt || []).indexOf("unique") >= 0 && (H.tablets.unique || 0) > 0) score += 0.05;
    if (a.key === "sustain" && H.tier === "low") score += 0.35;     // sustain-first kis tieren
    if (a.key === "sustain" && (H.tablets.overseer || 0) > 0) score += 0.05;
    // opcionális tabletenkénti bónusz: a TE legjobb N tabletedből (N = slotok), ha megadtad
    var modBonus = 0, items = (H.tabletItems && H.tabletItems[want.tablet]) || null;
    if (items && items.length) {
      var useN = Math.min(ideal, slotsFromMods(H.wsMods)), ranked = rankTablets(goal, H, want.tablet);
      for (var k = 0; k < useN && k < ranked.length; k++) modBonus += ranked[k].value;
      if (modBonus > 0.15) modBonus = 0.15;
    }
    score += modBonus;
    var gated = false;
    if (a.risk === "high" && H.surv === "squishy") { score = score * 0.55; gated = true; }
    return { score: score, tabletFit: tabletFit, wsFit: wsFit, have: have, ideal: ideal, gated: gated, modBonus: modBonus };
  }

  function renderHelper(goal) {
    var H = ensureHelper(), LV = ATLAS.levels, D = goal.decision || {};
    function tabletName(key) {
      for (var i = 0; i < goal.tabletTypes.length; i++) if (goal.tabletTypes[i].key === key) return goal.tabletTypes[i].name;
      return key;
    }

    var head = el("div", { class: "rhead" },
      el("span", { class: "rhead__glyph" }, glyph(goal.icon)),
      el("div", { class: "rhead__main" },
        el("div", { class: "rhead__title", text: goal.label }),
        el("div", { class: "rhead__mech", text: goal.mech })
      ),
      goal.patch ? el("span", { class: "guide-patch", text: goal.patch }) : null
    );
    var sec = el("section", {}, head);
    if (goal.intro) sec.appendChild(el("p", { class: "intro", text: goal.intro }));

    var body = el("div", { class: "helper" });

    /* --- kis UI-építők --------------------------------------------------- */
    function seg(label, opts, cur, onpick) { // szegmentált egy-választós
      return el("div", { class: "hfield" },
        el("div", { class: "hfield__lab", text: label }),
        el("div", { class: "hseg" }, opts.map(function (o) {
          return el("button", { class: "hseg__b" + (o.v === cur ? " is-on" : ""), type: "button", onclick: function () { onpick(o.v); } }, o.t);
        }))
      );
    }

    function paint() {
      body.replaceChildren();

      /* === 1. VEZÉRLŐK === */
      var controls = el("div", { class: "hcard" },
        el("div", { class: "hcard__lab", text: "1 · Mid van? (tabletek — kattints: +1, jobbklikk: −1)" }),
        el("div", { class: "hchips" }, goal.tabletTypes.map(function (t) {
          var n = H.tablets[t.key] || 0;
          return el("button", {
            class: "hchip" + (n > 0 ? " is-on" : ""), type: "button", title: t.hu,
            onclick: function () { H.tablets[t.key] = (n + 1) % 7; paint(); },
            oncontextmenu: function (e) { e.preventDefault(); H.tablets[t.key] = (n + 6) % 7; paint(); }
          },
            el("span", { class: "hchip__n", text: t.name }),
            el("span", { class: "hchip__c" + (n > 0 ? " is-on" : ""), text: n > 0 ? (n === 6 ? "6+" : String(n)) : "0" })
          );
        }))
      );

      var ws = el("div", { class: "hcard" },
        el("div", { class: "hcard__lab", text: "2 · A waystone-od modjai (kattints, ha jellemzően van rajta)" }),
        el("div", { class: "hchips" }, goal.waystoneFields.map(function (f) {
          var on = !!H.ws[f.key];
          return el("button", { class: "hchip" + (on ? " is-on" : ""), type: "button", title: f.real + " — " + f.hu, onclick: function () { H.ws[f.key] = !on; paint(); } },
            el("span", { class: "hchip__n", text: f.name }),
            el("span", { class: "hchip__c" + (on ? " is-on" : ""), text: on ? "✓" : "+" })
          );
        })),
        seg("A legjobb waystone-od mod-száma (ez adja a slotokat):",
          [0, 1, 2, 3, 4, 5, 6].map(function (m) { return { v: m, t: String(m) }; }), H.wsMods, function (v) { H.wsMods = v; paint(); }),
        seg("Tier:", [{ v: "low", t: "T1–10" }, { v: "mid", t: "T11–14" }, { v: "high", t: "T15–16" }], H.tier, function (v) { H.tier = v; paint(); }),
        seg("Mennyit bír a karaktered?:", [{ v: "squishy", t: "Szottyos" }, { v: "ok", t: "Elmegy" }, { v: "tanky", t: "Tank" }], H.surv, function (v) { H.surv = v; paint(); })
      );
      // --- opcionális: TABLETENKÉNTI mod-bevitel (csak amiből van darabod) ---
      var ownedTypes = goal.tabletTypes.filter(function (t) { return (H.tablets[t.key] || 0) > 0 && t.mods && t.mods.length; });
      if (ownedTypes.length) {
        var det = el("div", { class: "hdetail" });
        det.appendChild(el("button", { class: "hdetail__toggle", type: "button", onclick: function () { H.detailOpen = !H.detailOpen; paint(); } },
          el("span", { class: "hdetail__chev", text: H.detailOpen ? "▾" : "▸" }),
          "Tabletenkénti modok (opcionális — megmondja, melyiket slotold)"
        ));
        if (H.detailOpen) {
          ownedTypes.forEach(function (t) {
            var cnt = H.tablets[t.key] || 0;
            var items = H.tabletItems[t.key] || (H.tabletItems[t.key] = []);
            while (items.length < cnt) items.push({});   // a sorok számát a darabszámhoz igazítjuk
            if (items.length > cnt) items.length = cnt;
            var filled = items.filter(function (ms) { for (var k in ms) if (ms[k]) return true; return false; }).length;
            var open = !!H.openTypes[t.key];
            var grp = el("div", { class: "hdetail__grp" + (open ? " is-open" : "") });
            grp.appendChild(el("button", { class: "hdetail__grphead", type: "button", onclick: function () { H.openTypes[t.key] = !open; paint(); } },
              el("span", { class: "hdetail__chev", text: open ? "▾" : "▸" }),
              el("span", { class: "hdetail__name", text: t.name + " ×" + cnt }),
              el("span", { class: "hdetail__summary", text: filled + "/" + cnt + " kitöltve" })
            ));
            if (open) items.forEach(function (ms, ri) {
              grp.appendChild(el("div", { class: "titem" },
                el("span", { class: "titem__lab", text: "Tablet " + (ri + 1) }),
                el("div", { class: "hchips" }, t.mods.map(function (m) {
                  var on = !!ms[m.key];
                  return el("button", { class: "hchip hchip--sm" + (on ? " is-on" : ""), type: "button", title: m.hu, onclick: function () { ms[m.key] = !on; paint(); } },
                    el("span", { class: "hchip__n", text: m.name }),
                    el("span", { class: "hchip__c" + (on ? " is-on" : ""), text: on ? "✓" : "+" })
                  );
                }))
              ));
            });
            det.appendChild(grp);
          });
        }
        controls.appendChild(det);
      }

      controls.appendChild(el("div", { class: "hreset" },
        el("button", { class: "hreset__b", type: "button", onclick: function () { state.helper = null; H = ensureHelper(); paint(); } }, "Nullázás")
      ));

      body.appendChild(controls);
      body.appendChild(ws);

      /* === 2. ÁLLAPOT-SÁV (slot + respawn) === */
      var slots = slotsFromMods(H.wsMods);
      var rev = (D.revivesByMods || [5, 5, 4, 3, 2, 1, 0])[H.wsMods];
      var status = el("div", { class: "hstatus" },
        el("span", { class: "hstatus__b" }, el("b", { text: H.wsMods + " mod" }), " → ", el("b", { text: slots + " tablet-slot" }), (slots < 3 ? el("span", { class: "hstatus__mut", text: " (mind a 3-hoz 6-mod waystone kell)" }) : null)),
        el("span", { class: "hstatus__b" + (rev <= 1 ? " is-warn" : "") }, el("b", { text: rev + " respawn" }), (rev === 0 ? " · egy halál = elveszett map!" : ""))
      );
      if (H.tier === "high" && H.ws.drop) status.appendChild(el("span", { class: "hstatus__mut", text: "Waystone Drop Chance T15–16-on már lényegtelen (a T15 a legmagasabb drop)." }));
      body.appendChild(status);

      /* === 3. EREDMÉNY (rangsorolt loadoutok) === */
      var ranked = goal.archetypes.map(function (a) { return { a: a, sc: scoreArchetype(a, H, goal) }; })
        .sort(function (x, y) { return y.sc.score - x.sc.score; });

      var anyTablet = goal.tabletTypes.some(function (t) { return (H.tablets[t.key] || 0) > 0; });
      body.appendChild(el("div", { class: "hresult-head" },
        el("span", { class: "hresult-head__t", text: anyTablet ? "Neked ezt ajánlom" : "Általános default (pipálj be amid van → élesedik a rangsor)" }),
        el("span", { class: "hresult-head__h", text: "illeszkedés szerint" })
      ));

      // sustain-first emlékeztető
      if (D.sustainFirst) body.appendChild(el("div", { class: "callout callout--good" },
        el("div", { class: "callout__head" }, el("span", { class: "callout__icon", text: "✦" }), el("span", { class: "callout__title", text: "Sustain-first" })),
        el("div", { class: "callout__text", text: D.sustainFirst })
      ));

      ranked.slice(0, 3).forEach(function (r, idx) { body.appendChild(loadoutCard(r.a, r.sc, slots, idx + 1)); });

      // a többi opció kcompakt sorként
      var rest = ranked.slice(3);
      if (rest.length) {
        body.appendChild(el("div", { class: "hmore" },
          el("div", { class: "hmore__lab", text: "További opciók" }),
          el("div", { class: "hmore__list" }, rest.map(function (r) {
            return el("div", { class: "hmore__row" },
              el("span", { class: "hmore__name", text: r.a.label }),
              el("span", { class: "hmore__pct", text: Math.min(99, Math.round(r.sc.score * 100)) + "%" })
            );
          }))
        ));
      }

      /* === 4. ÁLLANDÓ REFERENCIA === */
      if (D.dontCombine) body.appendChild(el("div", { class: "gblock" },
        el("div", { class: "callout callout--warn" },
          el("div", { class: "callout__head" }, el("span", { class: "callout__icon", text: "×" }), el("span", { class: "callout__title", text: "Mit NE kombinálj" })),
          el("ul", { class: "callout__list" }, D.dontCombine.map(function (it) { return el("li", { text: it }); }))
        )
      ));
      if (D.dangerMods) body.appendChild(el("div", { class: "gblock" },
        el("div", { class: "callout callout--warn" },
          el("div", { class: "callout__head" }, el("span", { class: "callout__icon", text: "⚠" }), el("span", { class: "callout__title", text: "Veszélyes waystone-modok (kezdőként kerüld)" })),
          el("ul", { class: "callout__list" }, D.dangerMods.map(function (it) { return el("li", { text: it }); }))
        )
      ));
      if (goal.sources) body.appendChild(el("div", { class: "gblock" }, gLabel("Források · 0.5.x"),
        el("div", { class: "sources" }, goal.sources.map(function (s) { return el("a", { class: "source-link", href: s.url, target: "_blank", rel: "noopener", text: s.label + " ↗" }); }))
      ));
    }

    /* --- egy loadout-kártya ---------------------------------------------- */
    function loadoutCard(a, sc, slots, rank) {
      var pct = Math.min(99, Math.round(sc.score * 100));
      var primaryName = tabletName((a.want || {}).tablet);
      var card = el("div", { class: "lcard" + (rank === 1 ? " is-top" : "") });

      card.appendChild(el("div", { class: "lcard__head" },
        el("span", { class: "lcard__glyph" }, glyph(a.icon)),
        el("div", { class: "lcard__main" },
          el("div", { class: "lcard__title", text: a.label }),
          el("div", { class: "lcard__mech", text: a.mech })
        ),
        el("div", { class: "lcard__meta" },
          el("span", { class: "lcard__metatag", text: a.meta || "" }),
          el("div", { class: "matchbar", title: "illeszkedés: " + pct + "%" }, el("span", { class: "matchbar__fill", style: "width:" + pct + "%" })),
          el("span", { class: "matchbar__pct", text: pct + "%" })
        )
      ));

      // van/kell sor a fő tabletre
      if ((a.want || {}).ideal) {
        var need = sc.ideal - sc.have;
        var ok = sc.have >= sc.ideal;
        card.appendChild(el("div", { class: "lhave" + (ok ? " is-ok" : (sc.have > 0 ? " is-part" : " is-miss")) },
          el("span", { class: "lhave__ic", text: ok ? "✓" : (sc.have > 0 ? "◐" : "○") }),
          el("span", {}, "Neked " + sc.have + "/" + sc.ideal + " " + primaryName + (ok ? " — megvan a stack!" : (sc.have > 0 ? (" — még " + need + " kéne") : " — ehhez kéne tablet")))
        ));
      }

      // slot-valóság
      if ((a.want || {}).ideal >= 3 && slots < 3) {
        card.appendChild(el("div", { class: "lnote", text: "A waystone-odon most csak " + slots + " slot nyílik → " + slots + " tablet fér be (a teljes stackhez 6-mod waystone kell)." }));
      }

      // tabletenkénti slot-ajánlás (csak ha megadtál tabletenkénti modot erre a típusra)
      var ttC = tabletTypeByKey(goal, (a.want || {}).tablet);
      var rankedT = rankTablets(goal, H, (a.want || {}).tablet);
      if (ttC && rankedT.length && rankedT.some(function (r) { return r.value > 0; })) {
        var useN = Math.min((a.want || {}).ideal || 3, slots);
        var chosen = rankedT.slice(0, useN), bench = rankedT.slice(useN);
        var lb = el("div", { class: "lblock" }, el("div", { class: "lblock__lab", text: "Slotold ezeket " + huArt(primaryName) + " " + primaryName + " tabletjeidet (a legjobb " + useN + ")" }));
        var list = el("div", { class: "lslots" });
        chosen.forEach(function (r) {
          var mods = tabletItemMods(ttC, r.ms), q = slotQuality(r.value);
          list.appendChild(el("div", { class: "lslot lslot--pick" },
            el("span", { class: "lslot__n", text: "Tablet " + (r.idx + 1) }),
            el("span", { class: "lslot__mods", text: mods.length ? mods.join(" · ") : "nincs értelmes mod" }),
            el("span", { class: "lslot__q lvl-c--" + (q === "jackpot" ? "mandatory" : q === "erős" ? "strong" : "nice"), text: q })
          ));
        });
        lb.appendChild(list);
        if (bench.length) lb.appendChild(el("div", { class: "lslot-bench" }, "Padon marad: " + bench.map(function (r) {
          var mods = tabletItemMods(ttC, r.ms); return "Tablet " + (r.idx + 1) + (mods.length ? " (" + mods.join(", ") + ")" : " (üres)");
        }).join(" · ") + " — gyengébb, cseréld/add el, ha jobb jön."));
        card.appendChild(lb);
      }

      // warn / risk-gate
      if (sc.gated) card.appendChild(el("div", { class: "warn" }, el("span", { class: "warn__icon", text: "⚠" }), el("div", { class: "warn__text", text: "Szottyos buildre kockázatos: " + (a.warn || "ez magas-kockázatú tartalom — előbb tankosodj.") })));
      else if (a.warn) card.appendChild(el("div", { class: "warn" }, el("span", { class: "warn__icon", text: "⚠" }), el("div", { class: "warn__text", text: a.warn })));

      // master + waystone
      card.appendChild(el("div", { class: "pills" }, pill("Master", a.master)));
      card.appendChild(el("div", { class: "lblock" }, el("div", { class: "lblock__lab", text: "Waystone" }), el("div", { class: "lblock__txt", text: a.waystone })));

      // tablet-stack
      card.appendChild(el("div", { class: "lblock" }, el("div", { class: "lblock__lab", text: "Tablet-stack" }),
        el("div", { class: "tablets" }, (a.stack || []).map(function (s) {
          var main = el("div", { class: "tablet__main" }, el("div", { class: "tablet__name", text: s.name }));
          if (s.note) main.appendChild(el("div", { class: "tablet__note", text: s.note }));
          return el("div", { class: "tablet" }, el("span", { class: "tablet__qty", text: s.qty }), main);
        }))
      ));

      // atlas node-ok
      card.appendChild(el("div", { class: "lblock" }, el("div", { class: "lblock__lab", text: "Atlas node-ok" }),
        el("div", { class: "mods__list" }, (a.nodes || []).map(function (n) {
          return el("div", { class: "mod" },
            el("div", { class: "mod__row" },
              el("a", { class: "mod__name lnode", href: poe2dbUrl(n.name), target: "_blank", rel: "noopener", text: n.name }),
              el("span", { class: "mod__badge lvl-c--" + n.level, text: LV[n.level] || n.level })
            ),
            el("div", { class: "mod__why", text: n.why })
          );
        }))
      ));

      // miért
      card.appendChild(el("div", { class: "lblock" }, el("div", { class: "lblock__lab", text: "Miért" }),
        el("ul", { class: "lwhy" }, (a.why || []).map(function (w) { return el("li", { text: w }); }))
      ));

      return card;
    }

    paint();
    sec.appendChild(body);
    return sec;
  }

  function renderContent() {
    var goal = currentGoal();
    if (goal.type === "atlastree") return renderAtlasTree(goal);
    if (goal.type === "helper") return renderHelper(goal);
    if (goal.type === "delirium") return renderDelirium(goal);
    if (goal.type === "guide") return renderGuide(goal);
    if (goal.type === "stub") return renderStub(goal);
    return renderRecipe(goal);
  }

  /* --- összerakás -------------------------------------------------------- */
  function buildPage() {
    return el("div", { class: "page" },
      renderHeader(),
      el("main", { class: "main" },
        renderPrimer(),
        renderGoals(),
        renderContent(),
        renderFooter()
      )
    );
  }
  function render() { mount.replaceChildren(buildPage()); }

  function initNav() {
    var st = parseHash();
    state.goalKey = goalByKey(st.goal) ? st.goal : ATLAS.goals[0].key;
    state.atlasView = normView(state.goalKey, st.view);
    try { history.replaceState({ goal: state.goalKey, view: state.atlasView }, "", stateToHash()); } catch (e) {}
  }
  window.addEventListener("popstate", function (e) { applyNav(e.state); });

  document.title = ATLAS.meta.title + " — Path of Exile 2";
  initNav();
  render();
  initCounter();
})();
