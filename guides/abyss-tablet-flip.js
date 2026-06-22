/* ============================================================================
   GUIDE — ABYSS TABLET FLIP / CRAFT (currency-profit)
   ----------------------------------------------------------------------------
   Önregisztráló guide: a window.ATLAS.goals listához adja magát.
   Típus: "guide" (generikus blokk-renderer az app.js-ben).
   UI magyar, ingame nevek angolul. Patch 0.5.x (Return of the Ancients).
   Forrás: a felhasználó in-game piaci képei + jegyzete (abyss tablets.txt) +
   verifikált web (Maxroll, Sportskeeda, timesaver, 0.5.3 patch notes).
   d = Divine Orb (prémium), ex = Exalted Orb. EZT a fájlt nyugodtan szerkeszd.
   ========================================================================== */
(function () {
  if (!window.ATLAS || !window.ATLAS.goals) return;

  window.ATLAS.goals.push({
    key: "abyssflip",
    label: "Abyss tablet flip",
    mech: "trade / craft profit",
    icon: "tablet",
    type: "guide",
    patch: "0.5.x · Return of the Ancients",
    intro: "Az Abyss tabletek jelenleg az egyik legjövedelmezőbb flip/craft. A lényeg: olcsón rare-ré craftolsz (vagy veszel) egy Abyss tabletet, és a jó mod-kombókat sokszoros áron adod el. Itt a „miért” — és pontosan mit keress.",

    blocks: [

      {
        kind: "callout",
        tone: "good",
        icon: "✦",
        title: "Az üzleti modell dióhéjban",
        items: [
          "Bázis Abyss Tablet ≈ 70 Exalted; bármilyen rare tablet ≈ 60 Exalted alsó küszöb.",
          "A modok rollozása csak ~10 Exalted / tablet → a floor + a jó rollok felső vége miatt „safe profit”.",
          "Craft-út: Transmute + Augment → magic (2 mod), majd Regal + Exalted → rare (3–4+ mod). Ehhez kell a craft-feloldás („Reverse Transcription”) — ezért RITKA a magas-modos rare, és ezért fizetnek érte prémiumot.",
        ],
      },

      {
        kind: "cards",
        label: "A 3 érték-húzó mod (ezeket keresd)",
        items: [
          { sym: "↑", title: "Map has additional random Modifiers", badge: "#1 jackpot", tone: "good", desc: "Extra map-modokat rak a pályára → mindent felszoroz. Egyedül 3–6 Divine, kombóban 9–25 Divine." },
          { sym: "✦", title: "Effectiveness (per closed pit)", badge: "szorzó", tone: "good", desc: "Egyszerre skálázza az ÖSSZES többi modot — ez a „tablet effectiveness stacking”." },
          { sym: "◉", title: "4 additional Abysses · +Rogue Exile · Desecrated Currency", badge: "tartalom", tone: "info", desc: "Több tartalom / több hot-currency ugyanazon a mapen." },
        ],
      },

      {
        kind: "tiers",
        label: "Mod-kombók értéke",
        hint: "d = Divine Orb (prémium) · ex = Exalted · 1 Divine ≫ 1 Exalted · az árak ingadoznak",
        items: [
          { tier: "S", name: "additional map mods + 4 abyss chance", price: "18–25 d" },
          { tier: "S", name: "additional map mods + effectiveness / pit", price: "18–23 d" },
          { tier: "S", name: "additional map mods + abyss modifiers", price: "10–16 d" },
          { tier: "S", name: "rare monsters + additional map mods", price: "9–14 d" },
          { tier: "S", name: "additional random modifier (egyetlen mod)", price: "3–6 d" },
          { tier: "A", name: "additional map mods + abyss rare monsters", price: "4–10 d" },
          { tier: "A", name: "4 abyss chance + effectiveness / pit", price: "~3.5 d" },
          { tier: "A", name: "rogue exile + rare monsters", price: "~3 d" },
          { tier: "A", name: "rare monsters + abyss modifiers", price: "~3 d" },
          { tier: "A", name: "abyss modifiers + effectiveness / pit", price: "170 ex" },
          { tier: "A", name: "abyss rare monsters + effectiveness / pit", price: "70 ex–2 d" },
          { tier: "A", name: "abyss rare monsters + abyss modifiers", price: "1–3 d" },
          { tier: "B", name: "4 abyss chance + abyss pit rewards", price: "140 ex" },
          { tier: "B", name: "abyss modifiers + desecrated currency", price: "120 ex" },
          { tier: "B", name: "chance for 4 additional abysses (egyetlen mod)", price: "~100 ex" },
          { tier: "B", name: "additional rogue exile (egyetlen mod)", price: "~80 ex" },
          { tier: "B", name: "rare monsters + abyss rare monsters", price: "60 ex–1 d" },
        ],
      },

      {
        kind: "prose",
        label: "Miért fial ez?",
        paras: [
          "Kereslet: az Abyss most az egyik legjobb currency-farm. A 0.5.3 garantált Desecrated Currency-t adott az Abyssal Depths bossaitól/ládáitól (Vandroth, a nagy Abyssal Trove). Akkora ugrás, hogy Kulemak invitációja 5–7 Exaltedről ~245 Exaltedre ugrott. Mellé Abyss Jewel-ök (Heart of the Well), Stygian Vise öv, Omen of Light, Divine-ok. → Mindenki Abyss-t futtat → óriási a kereslet a tabletekre (innen a ~70ex bázisár).",
          "Craft-modell: a bázis + rollozás költsége eltörpül az eladási ár mellett. A rare-ré craftoláshoz feloldás kell („Reverse Transcription”), ezért a magas-modos darabok ritkák → prémiumért mennek (a 3-affixos már 30+ Exalted; a jó kombók 9–26 Divine — pont ezt látod az eladási előzményekben).",
          "Miért pont EZEK a modok: az „additional random Modifiers” még extra map-modokat is rárak (mindent felszoroz), az „Effectiveness” pedig egyszerre dobja meg az összes többit. A vásárló EGY tabletben akar több juicing-hatást — ezért ér a 2–3 modos kombó jóval többet, mint a modok külön-külön.",
        ],
      },

      {
        kind: "callout",
        tone: "info",
        icon: "◈",
        title: "Szűrés a kupacban (regex-ötlet) + mit tarts",
        items: [
          "A legritkább, legértékesebb single-modokat szűrd külön / utoljára (ritkák, könnyű egyenként ellenőrizni).",
          "A gyakori „decent” modokat (pack size, rarity, rare monsters) rostáld ki elsőként.",
          "Vásárláshoz/eladáshoz: keresd az „additional random Modifiers”-t + bármi az effectiveness / 4 abysses / rogue exile / desecrated currency / rare monsters közül.",
          "Saját farmra a B-tier (100–170ex) is bőven megéri; a S-tier kombókat tartsd eladásra.",
        ],
      },

      {
        kind: "sources",
        label: "Források · patch 0.5.x",
        items: [
          { label: "Maxroll · Abyss", url: "https://maxroll.gg/poe2/resources/abyss" },
          { label: "Sportskeeda · Tablet crafting 0.5", url: "https://www.sportskeeda.com/mmo/path-exile-2-tablet-crafting-guide-0-5-rota" },
          { label: "timesaver · Abyss farming", url: "https://timesaver.gg/blog/poe2-abyss-farming-guide" },
          { label: "Patch 0.5.3 notes", url: "https://patchbot.io/games/path-of-exile-2/articles/568-053-patch-notes" },
        ],
      },

    ],
  });
})();
