/* ============================================================================
   GUIDE — SIMULACRUM FARM (Delirium · ground loot)
   ----------------------------------------------------------------------------
   Önregisztráló guide: a window.ATLAS.goals listához adja magát.
   Típus: "guide" (generikus blokk-renderer az app.js-ben).
   UI magyar, ingame nevek angolul. Patch 0.5.x (Return of the Ancients).
   EZT a fájlt nyugodtan szerkeszd — csak adat.
   ========================================================================== */
(function () {
  if (!window.ATLAS || !window.ATLAS.goals) return;

  window.ATLAS.goals.push({
    key: "simulacrum",
    label: "Simulacrum farm",
    mech: "Delirium · ground loot",
    icon: "delirium",
    type: "guide",
    patch: "0.5.x · Return of the Ancients",
    intro: "Tömény Simulacrum Splinter + ground-loot farm teljes Delirium-fával. A hozam a delirium tabletek jó modjainak számával skálázik — minél több jó mod, annál több simulacrum mapenként.",

    blocks: [

      {
        kind: "cards",
        label: "Hozam — a tablet-modok száma szerint",
        items: [
          { title: "2 modos tablet", badge: "~2 sim / map", tone: "neutral", desc: "Alap hozam." },
          { title: "3 modos tablet", badge: "~4 sim / map", tone: "info", desc: "Ajánlott belépő." },
          { title: "4 modos tablet", badge: "~6 sim / map", tone: "good", desc: "Maximális hozam." },
        ],
      },

      {
        kind: "pills",
        items: [
          { k: "Master", v: "Jado" },
          { k: "Map", v: "City — Mountain / Forest / Grass" },
          { k: "Waystone", v: "5 mod (6 NEM jó)" },
        ],
      },

      {
        kind: "callout",
        tone: "info",
        icon: "◈",
        title: "Setup — kötelező alapok",
        items: [
          "Full Delirium Atlas-fa.",
          "Jado passzívok: Unexpected Missions + Partial Translations.",
          "4× Delirium tablet a city mapen.",
          "Grand Mirror → 200% Delirium a mapen.",
        ],
      },

      {
        kind: "mods",
        label: "Delirium tablet — milyen modokat keress",
        hint: "4× delirium tablet · 2 kötelező + 1 jó harmadik",
        legend: true,
        items: [
          { name: "Delirium Fog spawns 15–30% increased Fracturing Mirrors", why: "Kötelező. Célozz 25%+-ra — ez sokszorozza a köd tartalmát (több simulacrum).", level: "mandatory" },
          { name: "15–25% increased Stack Size of Simulacrum Splinters", why: "Kötelező. Célozz 25%+-ra — közvetlenül több splinter mapenként.", level: "mandatory" },
          { name: "25–35% increased number of Rare Monsters", why: "A legjobb harmadik mod — a rare szörnyek viszik a ground lootot.", level: "strong" },
          { name: "monster rarity / pack size (tartalék)", why: "Ha nincs „rare monster count”, ezek a tartalék harmadik modok.", level: "nice" },
        ],
      },

      {
        kind: "callout",
        tone: "warn",
        icon: "⚠",
        title: "200% Delirium kötelező — különben gyenge a loot",
        items: [
          "A city map csak akkor éri meg, ha 200% Deliriumon van (Grand Mirror).",
          "A legkönnyebb út a 200% delihez: non-city map + 3 Breach tablet (2–3 extra rare / breach).",
        ],
      },

      {
        kind: "steps",
        label: "Waystone craft (pontosan 5 mod)",
        items: [
          { title: "5 modos waystone", detail: "Pontosan 5 mod kell — 6 mod NEM működik ehhez a farmhoz." },
          { title: "Omen-kombó", detail: "Omen of Chaotic Effectiveness + Chaotic Quantity + Chaotic Rarity együtt → 100% monster rarity a mapen." },
          { title: "Utolsó mod Exalttal", detail: "Az utolsó modot Exalted Orbbal told rá." },
          { title: "Ne korruptáld", detail: "Ezen a ponton ne korruptáld a waystone-t." },
        ],
      },

      {
        kind: "seealso",
        items: [{ goal: "delirium", text: "Delirium — miért kell sűrűség mellé" }],
      },

    ],
  });
})();
