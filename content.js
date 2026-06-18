/* ============================================================================
   ATLAS SÚGÓ — TARTALOM
   ============================================================================
   EZT A FÁJLT SZERKESZD, ha a tartalmon akarsz változtatni!
   (A dizájnhoz/működéshez NEM kell hozzányúlni — az a assets/ mappában van.)

   Néhány egyszerű szabály, hogy ne törjön el semmi:
     • A szövegeket idézőjelek között találod:  label: "ide írj"
     • Minden sor végén vessző van:  ...,
     • Lista (több elem) szögletes zárójelben:  ["első", "második"]
     • Ha idézőjelet akarsz a szövegben, használj  „ "  jeleket (mint itt).
   Mentés után frissítsd a böngészőt — azonnal látszik a változás.

   Ha valami elromlana: a böngészőben F12 → "Console" fül megmondja, melyik
   sorban van a hiba (általában egy lemaradt vessző vagy idézőjel).
   ========================================================================== */

window.ATLAS = {

  /* ----- Fejléc, lábléc, általános szövegek ------------------------------ */
  meta: {
    title:    "ATLAS SÚGÓ",
    subtitle: "Path of Exile 2 · endgame farmolás újoncoknak",
    langBadge: "UI: magyar · terms: English",

    // A videó alap-linkje. Az időbélyegek (lent a céloknál) ehhez adódnak hozzá.
    videoUrl: "https://youtu.be/b5hJUpY9S5E",

    // A fejléc jobb oldali linkje (a készítő csatornája/videója).
    credit: { label: "Dartagnan videója", url: "https://youtu.be/b5hJUpY9S5E" },

    footerNote:    "Nem hivatalos, közösségi segédlet — nincs kapcsolat a Grinding Gear Games-szel. Eredeti, ihletett art; nem tartalmaz hivatalos PoE2 assetet.",
    footerVersion: "v0 · demó",
  },

  /* ----- Visszatérő gombfeliratok, címkék (UI szövegek) ------------------- */
  ui: {
    goalsTitle: "Mit akarsz csinálni?",
    goalsHint:  "válassz célt — a recept azonnal frissül",

    labelPassives: "Atlas passzívok",
    labelTablets:  "Tablet setup",
    labelWaystone: "Waystone & map craft",

    modsTitle: "Keresd ezeket",
    modsHint:  "és miért számít",

    ksaKeep:  "Tartsd",
    ksaSell:  "Add el",
    ksaAvoid: "Kerüld",

    comboTitle:     "Kombó-mátrix",
    comboTitleNote: "— erősség szerint rangsorolva",
    rewardsLabel:   "Jutalmak",
    stubBadge:      "Hamarosan",

    videoCtaTitle: "Nézd meg a videóban",
    videoCtaSub:   "Ez a recept Dartagnan végigjátszásából készült — itt a teljes, részletes magyarázat.",
  },

  // A mod-fontossági címkék (a "Keresd ezeket" listában a kis színes jelvény).
  levels: {
    mandatory: "Kötelező",
    strong:    "Erős",
    nice:      "Jó ha van",
  },

  /* ----- Fogalomtár ------------------------------------------------------- */
  // Ezek a magyarázó buborékok. A "Mielőtt belekezdesz" szövegben hivatkozunk
  // rájuk (lásd lent: primer.body → { term: "...", gloss: "atlas" }).
  gloss: {
    atlas:    "Az Atlas passzív fa: külön, 336 pontos fa, ami a térképfarmod jutalmait és sűrűségét szabja — nem a karaktered erejét.",
    sustain:  "Annyi waystone-t (mapot) termelsz vissza, amennyit elhasználsz — sosem fogysz ki a futnivalóból.",
    waystone: "A map megnyitásához használt tárgy; minél magasabb a tier és minél több a mod, annál nagyobb a haszon és a veszély.",
    packsize: "Pack Size = mennyi szörny spawnol a mapen. Több mob = több loot és XP.",
    rarity:   "Item Rarity = a dropok mennyisége és ritkasága; magasabb rarity = több és jobb tárgy.",
    tribute:  "Tribute = a Ritual saját valutája, amiből a körben felkínált jutalmakat rerollozod és megveszed.",
  },

  /* ----- "Mielőtt belekezdesz" nyitó blokk -------------------------------- */
  // A body egy darabokból álló bekezdés. Egy elem lehet:
  //   "sima szöveg"                      → normál szöveg
  //   { term: "látható szó", gloss:"atlas" } → aláhúzott szó tooltippel (a kulcs a gloss-ból)
  //   { strong: "kiemelt" }              → világos, félkövér kiemelés
  //   { hl: "halvány kiemelés" }         → lágy színes kiemelés
  primer: {
    title: "Mielőtt belekezdesz",
    hint:  "sustain-first alapok",
    body: [
      "Az Atlas a második fejlődési rendszered: a karakterfád eldönti hogyan ölsz, az ",
      { term: "atlas passzív", gloss: "atlas" },
      " fa azt, hogy miből gazdagodsz — külön 336 pont. A ",
      { strong: "#1 noob hiba" },
      ": túl korán „profitálni” akarni. Előbb ",
      { term: "sustain", gloss: "sustain" },
      " (legyen mindig miből mapot futni), és csak utána specializálódj egy farmer-identitásra: ",
      { hl: "currency · boss · breach · expedition · delirium" },
      ". A ",
      { term: "waystone", gloss: "waystone" },
      " a térképed üzemanyaga; a ",
      { term: "pack size", gloss: "packsize" },
      ", ",
      { term: "item rarity", gloss: "rarity" },
      " és — Ritualnál — a ",
      { term: "tribute", gloss: "tribute" },
      " azok a statok, amikből a profit jön. Röviden, a magamfajta nooboknak: ne akarj egyszerre mindenhez érteni.",
    ],
  },

  /* ----- CÉLOK (a fő tartalom) -------------------------------------------
     Minden cél egy kártya a "Mit akarsz csinálni?" rácsban, és alatta a
     hozzá tartozó recept/leírás. A "type" dönti el, mit jelenít meg:
        type: "recipe"   → teljes recept (variánsok, passzívok, tabletek, modok, tartsd/add el/kerüld)
        type: "delirium" → szorzó-nézet (koncepció + kombó-mátrix + jutalmak)
        type: "stub"     → "Hamarosan" placeholder + videó-link

     icon: melyik ikon legyen — választható:
        "currency" "breach" "omen" "delirium" "boss" "expedition"
     videoSeconds: hányadik másodpercnél kezdődik a videóban (a link ide ugrik)
     videoTime:    a megjelenített időbélyeg (pl. "12:45")
     -------------------------------------------------------------------- */
  goals: [

    /* ===== 1) STABIL CURRENCY (recept, 2 variánssal) ===== */
    {
      key: "currency",
      label: "Stabil currency",
      mech: "Abyss",
      icon: "currency",
      type: "recipe",
      videoSeconds: 765,
      videoTime: "12:45",
      intro: "Kiszámítható, megbízható currency-farm — az egyik legstabilabb belépő stratégia.",
      // Ha több variáns van, fülek jelennek meg fent. Ha csak 1, nincs fül.
      variants: [
        {
          name: "Jado · nyers currency",
          master: "Jado",
          map: "City map (4 slot) + Grand Mirror 200% Delirium",
          waystone: "T15+ · 6+ mod",
          mapcraft: "6 modra craftolva, Omennel erősítve, majd korruptálva (ideál 8 mod, de 6 is jó). T16 csak ha az area level 81 → ilvl 82.",
          passives: ["partial translations", "unforcing threads", "unexpected mission"],
          tablets: [
            { qty: "4×", name: "Abyss tablet", note: "ebből 2 cserélhető költségcsökkentésre" },
          ],
          // level lehet: "mandatory" | "strong" | "nice"
          mods: [
            { name: "Chance to contain +4 Abysses",              why: "a motor: több Abyss = több mob = több reward.",                 level: "mandatory" },
            { name: "+2 random map modifiers (minden tableten)", why: "jelenleg a legerősebb általános tablet-stat; minimum 3-mod tablet kell.", level: "mandatory" },
            { name: "Double chance Abyss Pit contains reward",   why: "nem minden pit ad értékeset — ez megemeli az esélyt.",          level: "strong" },
            { name: "Abyss effectiveness / closed pit (max 100%)", why: "pitenként erősebb mob: több HP, XP és loot.",                 level: "strong" },
            { name: "Chance abyss monsters spawn with abyssal mod", why: "egyik legerősebb loot-stat; 1 érezhető, 2 sem sok.",          level: "strong" },
            { name: "Increased item Rarity (+ rare count, pack size)", why: "a rengeteg mobbal kiválóan skálázódik.",                  level: "nice" },
          ],
          keep:  ["a fenti kulcs-modifierek", "magas effectiveness Abyss tablet"],
          sell:  ["magas rollú Abyss tablet (drága)", "Overseer → Rogue Exile dropok"],
          avoid: ["negative Pack Size → kevesebb mob"],
          warn:  "A per-pit effectiveness + 2 random map mod nagyon tankossá teszi a mobokat — erős build kell hozzá.",
        },
        {
          name: "Hilda · kiegyensúlyozott",
          master: "Hilda",
          map: "City map + Grand Mirror 200% Delirium",
          waystone: "T15/T16 · 6+ mod",
          mapcraft: "Ugyanaz, mint a Jado verziónál: 6+ modra craftolva, Omennel erősítve, korruptálva.",
          passives: ["Breeding Season", "Ancient Inscriptions"],
          tablets: [
            { qty: "1×", name: "Abyss tablet" },
            { qty: "1×", name: "Irradiated tablet" },
            { qty: "1×", name: "Overseer tablet" },
            { qty: "1×", name: "Breach tablet" },
          ],
          mods: [
            { name: "Abyss tablet: +4 Abyss + abyssal effectiveness", why: "ugyanaz a két kulcs-stat, mint a Jado verziónál.", level: "mandatory" },
            { name: "A másik 3 tableten: +1–2 random map modifier",   why: "kötelező alap minden tableten.",                  level: "mandatory" },
            { name: "Hasznos statok: rare monster, pack size, rarity", why: "ez adja a kiegyensúlyozott, vegyes lootot.",      level: "nice" },
          ],
          keep:  ["Breeding Season + Ancient Inscriptions (kötelező passzív)"],
          sell:  ["felesleges, magas rollú tabletek"],
          avoid: ["negative Pack Size"],
          warn:  "Kevésbé tiszta Abyss-fókusz: több liga-mechanikát kombinál egy mapen → változatosabb, de szórtabb profit.",
        },
      ],
    },

    /* ===== 2) BREACH SŰRŰSÉG (recept) ===== */
    {
      key: "breach",
      label: "Breach sűrűség",
      mech: "Breach (+ Delirium)",
      icon: "breach",
      type: "recipe",
      videoSeconds: 425,
      videoTime: "7:05",
      intro: "Tömeges loot brutális sűrűségből; Deliriummal a játék egyik legsűrűbb tartalma.",
      variants: [
        {
          name: "Jado · sűrűség",
          master: "Jado",
          map: "City map (4 slot) + Grand Mirror 200% Delirium",
          waystone: "T15+ · 6–8 mod · high rarity + effectiveness",
          mapcraft: "6–8 modra előkészítve, high rarity és effectiveness fókusszal.",
          passives: ["partial translations", "unforcing threads", "unexpected mission"],
          tablets: [
            { qty: "3×", name: "Breach tablet", note: "„+3 rare on stabilise”" },
            { qty: "1×", name: "Unique Breach tablet" },
          ],
          mods: [
            { name: "Unstable Breaches summon +3 rare (×3)", why: "a rare mob adja a loot zömét; a roll 1–3 — olcsóbb low-roll + Divine is jó.", level: "mandatory" },
            { name: "Monster Effectiveness",                 why: "ha csak 1 stat fér: ez a legerősebb; legalább 2-t a 3 fontosból.",          level: "strong" },
            { name: "Unique Breach tablet (+5 rare)",        why: "a negyedik slot; kerüld a negatív pack size verziót.",                     level: "strong" },
            { name: "Increased item Rarity",                 why: "főleg már zsúfolt mapen éri meg.",                                         level: "nice" },
          ],
          keep:  ["unique Breach tablet", "monster effectiveness roll"],
          sell:  ["magas rollú Breach tablet"],
          avoid: ["negative Pack Size → kevesebb mob"],
          warn:  "Erős build kell a sűrűséghez — a Breach + Delirium combó gyorsan tankossá és veszélyessé válik.",
        },
      ],
    },

    /* ===== 3) OMEN JACKPOT (recept) ===== */
    {
      key: "omen",
      label: "Omen jackpot",
      mech: "Ritual (+ Delirium)",
      icon: "omen",
      type: "recipe",
      videoSeconds: 1063,
      videoTime: "17:43",
      intro: "Célzott Omen-farm — nem gyors mapozás, hanem maximális tribute → reroll → omen.",
      variants: [
        {
          name: "Jado · omen farm",
          master: "Jado",
          map: "T15 · 6+ mod · area level 79+",
          waystone: "T15 · 6+ mod",
          mapcraft: "Area level 79+ kötelező az Omen of Whittlinghez.",
          passives: ["partial translations", "unforcing threads", "unexpected mission"],
          tablets: [
            { qty: "1×", name: "Freedom of Fate", note: "unique" },
            { qty: "2×", name: "Ritual tablet", note: "+3 favour reroll" },
            { qty: "1×", name: "Ritual tablet", note: "2 hasznos mod" },
          ],
          mods: [
            { name: "Reduced favour reroll cost", why: "kötelező: több reroll ugyanannyi tribute-ból.",        level: "mandatory" },
            { name: "Increased tribute",          why: "a Ritual saját valutája — mindent felhúz.",            level: "mandatory" },
            { name: "Increased omen spawn chance", why: "omen jön az unique helyett; hosszú távon óriási.",     level: "strong" },
            { name: "Reduced defer cost",         why: "a drága rewardot életben tartod a poolban.",           level: "strong" },
            { name: "Freedom of Fate (unique tablet)", why: "megemeli a jutalmak értékét.",                    level: "nice" },
          ],
          keep:  ["Freedom of Fate tablet"],
          sell:  ["ritka, nagy értékű omenek (ez a jackpot)"],
          avoid: ["area level < 79 → nincs drága omen"],
          warn:  "A Delirium itt indirekt: több mob → több tribute → több reroll → omen. Kevésbé stabil, de nagy a jackpot.",
        },
      ],
    },

    /* ===== 4) DELIRIUM (szorzó-nézet) ===== */
    {
      key: "delirium",
      label: "Delirium",
      mech: "szorzó — nem önálló farm",
      icon: "delirium",
      type: "delirium",
      videoSeconds: 1238,
      videoTime: "20:38",
      master: "Jado",
      map: "City map · T15+ · 6+ mod",
      concept: "A Delirium nem önálló farm — a reward bar a megölt mobok számától és sűrűségétől tölt. Önmagában közepes; sok mobbal viszont a játék egyik legerősebb módszere. (A 0.5.2 csökkentette a nehézségét: felezett unique toughness, kevesebb depth-damage.) Ezért mindig egy sűrűség-mechanika MELLÉ tedd.",
      // A kombó-mátrix kártyái. rank = sorszám (1 a legjobb), tier = S/A/B betű,
      // strength = 1–3 (a kis sávok száma jobb oldalt).
      combo: [
        { rank: 1, tier: "S", strength: 3, title: "Abyss + Delirium",  desc: "A legerősebb. Jado + Abyss tabletek, City map + 200% Delirium — a sűrűség hajtja a reward bart." },
        { rank: 2, tier: "A", strength: 2, title: "Breach + Delirium", desc: "Második. 3 Breach tablet + 1 unique — rengeteg rare mob, gyorsan tölti a depth-et." },
        { rank: 3, tier: "B", strength: 1, title: "Ritual + Delirium", desc: "Más logika: indirekt. Több mob → több tribute → több reroll → omen." },
      ],
      rewards: "Currency, catalyst (most főleg Breach/genesis fa) és simulacrum splinter — gyakran a simulacrum többet ér, mint a teljes map loot. Cél: high size, monster effectiveness, item rarity.",
    },

    /* ===== 5) BOSS FARM (placeholder) ===== */
    {
      key: "boss",
      label: "Boss farm",
      mech: "a videó csak említi",
      icon: "boss",
      type: "stub",
      videoSeconds: 362,
      videoTime: "6:02",
      note: "Teljesen más atlas fa: a cél nem a több mob, hanem a jobb boss-drop és a gyorsabb boss-elérés (Pinnacle bossok, speciális encounterök). A részletes setupot a készítő nem ebben a videóban adja — ez itt placeholder a teljességhez.",
    },

    /* ===== 6) EXPEDITION (placeholder) ===== */
    {
      key: "expedition",
      label: "Expedition",
      mech: "külön videó",
      icon: "expedition",
      type: "stub",
      videoSeconds: 310,
      videoTime: "5:10",
      note: "A Return of the Ancients egyik legnagyobb nyertese — a craft- és runa-gyűjtők iránya. A készítő külön videóra tolta, így itt egyelőre csak placeholder szerepel.",
    },

  ],
};
