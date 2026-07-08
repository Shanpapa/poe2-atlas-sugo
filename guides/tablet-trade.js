/* ============================================================================
   GUIDE — TABLET BEVÁSÁRLÓLISTA (direct trade keresések)
   ----------------------------------------------------------------------------
   Önregisztráló guide: a window.ATLAS.goals listához adja magát.
   Típus: "guide" (generikus blokk-renderer az app.js-ben) — új blokk-kind:
   "tradesearch" (trade-site-szerű stat-panel + direct link gomb).
   UI magyar, ingame nevek angolul. League: Runes of Aldur (0.5.x).
   FORRÁS: Dartagnan (𝓓'𝓪𝓻𝓽 [ERA]) saját mentett trade-keresései, Discordról
   (2026-07-07) — VALIDÁLT lista, a linkek az ő beállított min értékeit őrzik.
   EZT a fájlt nyugodtan szerkeszd.
   ========================================================================== */
(function () {
  if (!window.ATLAS || !window.ATLAS.goals) return;

  window.ATLAS.goals.push({
    key: "tablettrade",
    label: "Tablet bevásárlólista",
    mech: "trade · kész keresések",
    icon: "tablet",
    type: "guide",
    patch: "Runes of Aldur · Dartagnan-válogatás ✓",

    blocks: [

      {
        kind: "callout",
        tone: "good",
        icon: "✓",
        title: "Validált lista — egyenesen Dartagnantól",
        items: [
          "Minden link egy MENTETT keresés a hivatalos pathofexile.com trade oldalon — a statok és a minimum értékek előre be vannak állítva.",
          "Nem kell magadnak összekattintgatni a trade oldalt: kattints a gombra, és a keresés már Dartagnan szűrőivel, min értékekkel együtt nyílik meg.",
          "A linkek a Runes of Aldur league-re mutatnak — új league-nél újra össze kell rakni őket (vagy megvárni a friss listát).",
        ],
      },

      {
        kind: "callout",
        tone: "info",
        icon: "◈",
        title: "Hogyan olvasd a kereséseket",
        items: [
          "„min X” = a stat legalább ekkora rollal legyen a tableten — a keresés ez alatt nem is mutat találatot.",
          "„legalább N az alábbiakból” = a trade oldal Count szűrője: a felsoroltakból elég N darab, bármelyik.",
          "Az IMPLICIT címkés sor a tablet beépített statja (az „Adds … to a Map # use remaining” sorok) — ez adja a mechanikát, a többi 5 stat a juice.",
        ],
      },

      {
        kind: "tradesearch",
        label: "Lineage Support farm",
        hint: "tablet prémiumban és budgetben + waystone mellé",
        items: [
          {
            title: "Lineage tablet — a teljes csomag",
            badge: "top pick",
            tone: "good",
            sym: "✦",
            desc: "Mind a négy alap stat megvan minimum rollal, és ötödiknek jön az XP vagy a rarity. Ez a „nem kell tovább keresgélni” példány — az ára is ehhez mérten fáj.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Monsters have #% increased Effectiveness", min: 10 },
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Quantity of Waystones found in Map", min: 25 },
                  { name: "Adds Irradiated to a Map (# use remaining)", min: 10, implicit: true },
                ],
              },
              {
                heading: "Ötödik statnak",
                need: "legalább 1",
                stats: [
                  { name: "#% increased Experience gain in Map", min: 10 },
                  { name: "#% increased Rarity of Items found", min: 10 },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/mk5Gm3nac6",
          },
          {
            title: "Lineage tablet — budget",
            badge: "olcsó",
            tone: "info",
            sym: "◇",
            desc: "Ugyanez fapadosan: a tablet 5 statjából csak erre a 3 kulcsra szűrünk, a maradék 2 slot mindegy. Sokkal olcsóbb, és a lényeget így is tudja.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Quantity of Waystones found in Map", min: 30 },
                  { name: "Adds Irradiated to a Map (# use remaining)", min: 10, implicit: true },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/Md6pe37yFJ",
          },
          {
            title: "Waystone a Lineage farmhoz",
            badge: "waystone",
            tone: "mid",
            sym: "▣",
            desc: "A tablet csak a fél csapat — alá jó waystone is kell. Ez a keresés az öt fontos waystone-statra szűr (a pontos stat-sorok és értékek a linkben vannak beállítva).",
            groups: [
              {
                heading: "Ezekre szűr",
                stats: [
                  { name: "Item Rarity" },
                  { name: "Pack Size" },
                  { name: "Monster Rarity" },
                  { name: "Monster Effectiveness" },
                  { name: "Waystone Drop Chance" },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/nrp75GJlt0",
          },
        ],
      },

      {
        kind: "tradesearch",
        label: "Általánosan jó tabletek",
        hint: "a mindenes — bármilyen farmhoz jó alap",
        items: [
          {
            title: "Univerzális juice-tablet",
            badge: "mindenes",
            tone: "good",
            sym: "◈",
            desc: "A 3 alap juice-stat minimum rollal + legalább egy mechanika-implicit a nagy ötösből. Egy tableten összesen 5 stat fér el — ez a keresés pont az ilyen jól összeállt darabokat találja meg.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Pack Size in Map", min: 7 },
                  { name: "Monsters have #% increased Effectiveness", min: 15 },
                ],
              },
              {
                heading: "Mechanika-implicit",
                need: "legalább 1",
                stats: [
                  { name: "Adds Abysses to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Adds Irradiated to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Adds Ritual Altars to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Adds Vaal Beacons to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Adds an Otherworldly Breach to a Map (# use remaining)", min: 10, implicit: true },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/gl9eG835cQ",
          },
        ],
      },

      {
        kind: "tradesearch",
        label: "Abyss-vadászat",
        hint: "speciális kombók — saját farmra vagy flipre",
        items: [
          {
            title: "Effectiveness / closed Pit",
            badge: "szorzó",
            tone: "info",
            sym: "◉",
            desc: "A „minden pit után erősödik” tablet: az Effectiveness-stack az egész abyss-juice-t felszorozza, akár +100%-ig.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Pack Size in Map", min: 4 },
                  { name: "Adds Abysses to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Abyssal Monsters have #% increased Effectiveness for each closed Pit, up to 100%" },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/kyRGoKqWF5",
          },
          {
            title: "4 additional Abysses chance",
            badge: "tartalom",
            tone: "info",
            sym: "◉",
            desc: "Eséllyel NÉGY extra Abyss a mapon — több pit, több reward, több minden.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Pack Size in Map", min: 4 },
                  { name: "Adds Abysses to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "Map has #% chance to contain four additional Abysses" },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/eR5EY5nbcL",
          },
          {
            title: "Abyssal Modifiers chance",
            badge: "rare-juice",
            tone: "info",
            sym: "◉",
            desc: "Az abyssal mobok nagyobb eséllyel kapnak Abyssal Modifiert → erősebb, de sokkal jobban fizető rare-ök.",
            groups: [
              {
                heading: "Mind kelljen",
                stats: [
                  { name: "Map has # additional random Modifier", min: 2 },
                  { name: "#% increased Pack Size in Map", min: 4 },
                  { name: "Adds Abysses to a Map (# use remaining)", min: 10, implicit: true },
                  { name: "#% increased chance for Abyssal monsters in Map to have Abyssal Modifiers" },
                ],
              },
            ],
            url: "https://www.pathofexile.com/trade2/search/poe2/Runes%20of%20Aldur/gl5gemVjiQ",
          },
        ],
      },

      {
        kind: "seealso",
        items: [
          { goal: "abyssflip", text: "Abyss tablet flip — melyik kombó mennyit ér" },
          { goal: "helper", text: "Loadout helper — mim van, mit toljak" },
        ],
      },

    ],
  });
})();
