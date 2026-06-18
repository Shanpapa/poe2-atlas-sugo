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
  };

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
    var kids = [];
    if (type === "currency") kids = [C({ cx: 12, cy: 12, r: 8 }), C({ cx: 12, cy: 12, r: 3.2 })];
    else if (type === "breach") kids = [L({ x1: 12, y1: 3, x2: 12, y2: 21 }), L({ x1: 3, y1: 12, x2: 21, y2: 12 }), L({ x1: 6, y1: 6, x2: 18, y2: 18 }), L({ x1: 18, y1: 6, x2: 6, y2: 18 })];
    else if (type === "omen") kids = [P({ points: "12,3 21,12 12,21 3,12" }), C({ cx: 12, cy: 12, r: 2, fill: "currentColor", stroke: "none" })];
    else if (type === "delirium") kids = [C({ cx: 12, cy: 12, r: 8, "stroke-dasharray": "3 3.4" }), C({ cx: 12, cy: 12, r: 3 })];
    else if (type === "boss") kids = [P({ points: "12,3 21,20 3,20" }), C({ cx: 9.2, cy: 15, r: 1, fill: "currentColor", stroke: "none" }), C({ cx: 14.8, cy: 15, r: 1, fill: "currentColor", stroke: "none" })];
    else if (type === "expedition") kids = [P({ points: "12,4 19,8 19,16 12,20 5,16 5,8" }), C({ cx: 12, cy: 12, r: 2.4 })];
    var svg = svgEl("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.4, "stroke-linecap": "round", "stroke-linejoin": "round" });
    kids.forEach(function (k) { svg.appendChild(k); });
    return svg;
  }

  function videoHref(goal) { return ATLAS.meta.videoUrl + "?t=" + goal.videoSeconds; }
  function currentGoal() {
    for (var i = 0; i < ATLAS.goals.length; i++) if (ATLAS.goals[i].key === state.goalKey) return ATLAS.goals[i];
    return ATLAS.goals[0];
  }
  function selectGoal(k) { state.goalKey = k; state.variant = 0; state.primerOpen = false; render(); }

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
  function renderFooter() {
    var M = ATLAS.meta;
    return el("footer", { class: "site-footer" },
      el("span", { class: "site-footer__note", text: M.footerNote }),
      el("span", { class: "site-footer__ver", text: M.footerVersion })
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

  function renderContent() {
    var goal = currentGoal();
    if (goal.type === "delirium") return renderDelirium(goal);
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

  document.title = ATLAS.meta.title + " — Path of Exile 2";
  render();
})();
