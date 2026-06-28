/* ============================================================================
   LOADOUT HELPER — interaktív "mit toljak le?" tervező
   ----------------------------------------------------------------------------
   Önregisztráló goal: a window.ATLAS.goals listához adja magát. Típus: "helper"
   → a renderer (assets/app.js) renderHelper()-rel rajzolja, interaktívan.

   ÖTLET: a felhasználó bekattintgatja, MIJE VAN (tabletek típus+darab, waystone
   modok, tier, build-túlélés), a helper pedig RANGSOROLT loadout-recepteket ad:
   "ezt a waystone-t + ezt a 3-4 tabletet, EZEKEN az atlas node-okon, MERT…".

   ADAT-VEZÉRELT: ez a fájl csak ADAT. A pontozó/illesztő logika az app.js-ben
   van (scoreArchetype + renderHelper). Itt csak a katalógust bővíted.

   FORRÁS: verifikált 0.5.x ("Return of the Ancients") mester-brief — Map-Device
   tablet-modell (NEM torony/sugár!), slot = waystone mod-szám függvénye,
   same-type stacking meta. Az ingame nevek angolul (kánoni); a bizonytalanok (?).
   UI magyar. EZT a fájlt nyugodtan szerkeszd.
   ========================================================================== */
(function () {
  if (!window.ATLAS || !window.ATLAS.goals) return;

  window.ATLAS.goals.push({
    key: "helper",
    label: "Loadout helper",
    mech: "mim van → mit toljak",
    icon: "helper",
    type: "helper",
    patch: "0.5.x · Return of the Ancients",
    intro: "Van egy kupac tableted és waystone-od, és csak ülsz, hogy mit mivel? Kattintsd be lent, MID VAN — a helper kiírja a top loadoutokat: melyik waystone + mely 3-4 tablet, milyen Atlas node-okon, és MIÉRT. (Verifikált 0.5-ös mechanika: a tablet a Map Device-ba megy a waystone mellé, és a slotok száma a waystone mod-számától függ.)",

    /* ----- 1) TABLET-TÍPUSOK (a számlálós chipek) -------------------------
       feeds = melyik archetípus „fő tabletje". A unique univerzális bónusz.
       mods[] = a típus KULCS-modjai (opcionális, mod-szintű bevitelhez). Ha a
       felhasználó bepipálja, mely modok vannak a tabletjein, az feljebb tolja a
       találatot, és a kártyán visszajelzi (✓ megvan / 💡 keresd).
       tier: "jackpot" (+0.08) | "strong" (+0.05) | "nice" (+0.02), max +0.15. */
    tabletTypes: [
      { key: "irradiated", name: "Irradiated", hu: "generikus map-juice (+1 area level)", feeds: "juice", mods: [
        { key: "qty",    name: "increased Quantity of Items", hu: "a top pick minden tableten", tier: "jackpot" },
        { key: "rarity", name: "increased Rarity of Items",   hu: "rarity — ha már van density", tier: "strong" },
        { key: "pack",   name: "increased Pack Size",         hu: "több mob", tier: "strong" },
        { key: "rares",  name: "increased Rare Monsters",     hu: "a loot-motor", tier: "strong" },
      ] },
      { key: "abyss", name: "Abyss", hu: "currency-printer (desecrated/bone)", feeds: "abyss", mods: [
        { key: "addAbyss", name: "Map contains additional Abysses",     hu: "több Abyss = több reward", tier: "jackpot" },
        { key: "eff",      name: "Effectiveness / closed Pit (max 100%)", hu: "az egész stacket felszorozza", tier: "jackpot" },
        { key: "pitRwd",   name: "Pits 2× likely to have rewards",      hu: "nem minden pit ad — ez megemeli", tier: "strong" },
        { key: "rare",     name: "+1–2 Rare Monsters from Abysses",     hu: "loot a rare-ökből", tier: "strong" },
        { key: "qty",      name: "increased Quantity of Items",         hu: "generikus juice", tier: "strong" },
      ] },
      { key: "breach", name: "Breach", hu: "rare-density · splinter", feeds: "breach", mods: [
        { key: "addBreach", name: "additional Breach",                    hu: "több Breach a mapen", tier: "jackpot" },
        { key: "splinter",  name: "increased Quantity of Breach Splinters", hu: "a fő nyersanyag", tier: "jackpot" },
        { key: "rare",      name: "Breaches spawn additional Rare Monster", hu: "a loot zöme a rare-ökből", tier: "strong" },
        { key: "hand",      name: "+1 Clasped Hand",                      hu: "több Breach-kéz", tier: "strong" },
        { key: "qty",       name: "increased Quantity of Items",          hu: "generikus juice", tier: "strong" },
      ] },
      { key: "ritual", name: "Ritual", hu: "biztonságos omen-farm", feeds: "ritual", mods: [
        { key: "reroll",  name: "reduced Favour reroll cost",  hu: "több reroll ugyanannyi Tribute-ból", tier: "jackpot" },
        { key: "omen",    name: "increased Omen chance",       hu: "omen jön az unique helyett", tier: "jackpot" },
        { key: "tribute", name: "+Tribute from sacrifice",     hu: "a Ritual valutája — mindent felhúz", tier: "strong" },
        { key: "defer",   name: "reduced defer cost",          hu: "a drága rewardot életben tartod", tier: "nice" },
        { key: "qty",     name: "increased Quantity of Items", hu: "generikus juice", tier: "strong" },
      ] },
      { key: "delirium", name: "Delirium", hu: "magas kockázat · simulacrum", feeds: "delirium", mods: [
        { key: "splinter", name: "increased Stack size of Simulacrum Splinters", hu: "a legjobb Delirium-mod", tier: "jackpot" },
        { key: "reward",   name: "chance for additional Reward type", hu: "változatosabb, értékesebb loot", tier: "jackpot" },
        { key: "mirror",   name: "extra Fracturing Mirror",          hu: "több simulacrum-encounter", tier: "strong" },
        { key: "fog",      name: "longer / slower Delirium fog",     hu: "több idő a reward barhoz", tier: "nice" },
        { key: "qty",      name: "increased Quantity of Items",      hu: "generikus juice", tier: "strong" },
      ] },
      { key: "expedition", name: "Expedition", hu: "Kalguur artifact · önfinanszírozó", feeds: "expedition", mods: [
        { key: "artifacts", name: "increased Quantity of Artifacts", hu: "a fő currency-forrás", tier: "jackpot" },
        { key: "remnant",   name: "+1 Remnant",                      hu: "több remnant = több loot", tier: "jackpot" },
        { key: "logbook",   name: "increased Quantity of Logbooks",  hu: "önfinanszírozó loop", tier: "strong" },
        { key: "rareExp",   name: "+Rare Expedition Monsters",       hu: "értékesebb encounter", tier: "strong" },
        { key: "qty",       name: "increased Quantity of Items",     hu: "generikus juice", tier: "strong" },
      ] },
      { key: "overseer", name: "Overseer", hu: "map-boss → waystone sustain", feeds: "sustain", mods: [
        { key: "waystoneQty", name: "increased Quantity of Waystones from Map Bosses", hu: "a sustain power-modja", tier: "jackpot" },
        { key: "bossCount",   name: "Up to 2–4 Maps contain a Map Boss",               hu: "több boss = több Waystone", tier: "jackpot" },
        { key: "bossQR",      name: "+Quantity/Rarity from bosses",                     hu: "jobb boss-drop", tier: "strong" },
        { key: "bossXp",      name: "+Boss XP",                                         hu: "gyorsabb szintezés", tier: "nice" },
      ] },
      { key: "temple", name: "Temple (Vaal)", hu: "Vaal Beacon ládák", feeds: "vaal", mods: [
        { key: "beaconRare",  name: "Vaal Beacon Chests chance to be Rare", hu: "értékesebb ládák", tier: "jackpot" },
        { key: "beaconMobs",  name: "Beacons summon additional Monsters",   hu: "több mob a Beacon körül", tier: "strong" },
        { key: "extraPack",   name: "extra pack around Beacons",            hu: "sűrűség", tier: "nice" },
        { key: "qty",         name: "increased Quantity of Items",          hu: "generikus juice", tier: "strong" },
      ] },
      { key: "unique", name: "Unique", hu: "bármelyik archetípust feldobja", feeds: "*", mods: [] },
    ],

    /* ----- 2) WAYSTONE-MEZŐK (a be/ki toggle chipek) ---------------------
       A felhasználó 6 mezője → valós 0.5 stat. (A „Quantity of Items" külön
       waystone-roll MÁR NINCS — a quantity a Monster Effectiveness + density
       felől jön.) */
    waystoneFields: [
      { key: "monsterRarity", name: "Monster Rarity", real: "more Magic & Rare Monsters", hu: "a #1 loot-kar — a rare mob adja a loot zömét" },
      { key: "anymod",        name: "Any modifier",   real: "Rare Monsters have an additional Modifier (Of Nemeses)", hu: "univerzálisan erős" },
      { key: "packsize",      name: "Pack Size",      real: "increased Pack Size", hu: "noob-barát; 0.5-ben extra rare esélyt is ad" },
      { key: "rarity",        name: "Item Rarity",    real: "increased Rarity of Items", hu: "csak ha már van density — magában „üres”" },
      { key: "monsterEff",    name: "Monster Effectiveness", real: "increased Monster Effectiveness", hu: "haladó, DPS-kapus; a loot-bónuszt 0.5 felezte" },
      { key: "drop",          name: "Waystone Drop Chance",  real: "more Waystones found", hu: "sustain — T15–16-on már lényegtelen" },
    ],

    /* ----- 3) LOADOUT-ARCHETÍPUSOK (a kimeneti katalógus) -----------------
       Mezők:
         risk: "low|mid|high"  → a túlélés-kapuhoz (high+szottyos = figyelmeztetés)
         meta: rövid rang-címke (S/A/B + szöveg)
         want: { tablet, ideal } → a fő tablet és az ideális darab (3 = teljes stack)
         alt:  extra tabletek, amik bónuszt adnak (pl. unique)
         wsLikes / wsBait: mely waystone-mezők segítenek / nem ehhez
         waystone: a recept waystone-sora
         stack: a tablet-stack (qty + név + megjegyzés)
         nodes: atlas node-ok (level: mandatory|strong|nice + why) — poe2db-linkkel
         master: ajánlott Atlas Master
         why: indoklás-pontok
         warn: kockázat-figyelmeztetés (vagy null) */
    archetypes: [

      {
        key: "sustain", label: "Boss / Waystone sustain", mech: "az alap minden loadout alatt",
        icon: "boss", risk: "low", meta: "ALAP · ezt építsd először",
        want: { tablet: "overseer", ideal: 2 }, alt: [],
        wsLikes: ["monsterRarity", "drop"], wsBait: [],
        waystone: "A top tieredhez közeli, erős-boss map. A map-boss ~100%-ban dob 1 tierrel magasabb Waystone-t → ez a sustain motorja.",
        stack: [
          { qty: "1–2×", name: "Overseer Precursor Tablet", note: "+map boss · increased Quantity of Waystones a bossoktól" },
        ],
        nodes: [
          { name: "Pathkeepers", level: "mandatory", why: "+15% Waystone-mennyiség a map-bossoktól — a sustain gerince." },
          { name: "Valuable Paths", level: "strong", why: "+10% Waystone a bossoktól." },
          { name: "Eons of Contamination", level: "nice", why: "további Waystone-sustain." },
          { name: "Archaeological Interest", level: "nice", why: "több tablet-drop — tölti a kupacot." },
        ],
        master: "Hilda's Hunting (boss) vagy Doryani's Science (Citadel-push)",
        why: [
          "Ezt építsd ki MIELŐTT bármit juicelnél — egy fenntarthatatlan alapon a juicing pénzt VESZÍT.",
          "A #1 noob hiba a tablet-gyűjtögetés: a tabletek elfogynak és vissza is termelődnek — használd el őket, hogy többet kapj.",
        ],
        warn: null,
      },

      {
        key: "juice", label: "Általános quantity / rarity", mech: "univerzális alap-réteg",
        icon: "currency", risk: "low", meta: "BÁRMIKOR · a réteg a többi alatt",
        want: { tablet: "irradiated", ideal: 3 }, alt: ["unique"],
        wsLikes: ["monsterRarity", "rarity", "packsize"], wsBait: [],
        waystone: "Item Rarity (~40–50%) + minél több mod a sustainhez. Monster Effectiveness CSAK ha a DPS-ed elbírja.",
        stack: [
          { qty: "1×", name: "Irradiated Tablet (a flaghez)", note: "+1 area level (jobb mod-tierek, XP). A flag csak 1× kell — a TÖBBI slotot a juice-MODOK stackeléséért töltsd." },
          { qty: "+ a slotok", name: "bármely tablet jó quantity / rarity / pack rollal", note: "ezek a modok additívan stackelnek a slotokon — ezért éri meg több juice-tabletet összerakni" },
        ],
        nodes: [
          { name: "Rising Danger", level: "strong", why: "a rare-mod klaszter része — a rare-ök a loot-motor." },
          { name: "No Simple Battles", level: "strong", why: "rare-mod floor: minden rare-en min. 3 mod." },
          { name: "Expanding Hordes", level: "nice", why: "pack size — több mob." },
          { name: "Bountiful Bloodlines", level: "nice", why: "pack/magic density." },
        ],
        master: "Doryani's Science",
        why: [
          "A Quantity additívan adódik a slotokon; a Monster Effectiveness az EGÉSZ stacket felszorozza (de a DPS-t megkéri).",
          "Az Irradiated csak +1 area levelt ad — egy darab elég, a második elveszett slot.",
        ],
        warn: null,
      },

      {
        key: "abyss", label: "Abyss / desecrated currency", mech: "top nyers-currency meta",
        icon: "currency", risk: "mid", meta: "S · jelenleg a legjobb currency",
        want: { tablet: "abyss", ideal: 3 }, alt: ["unique"],
        wsLikes: ["monsterRarity", "rarity", "packsize"], wsBait: ["drop"],
        waystone: "Magas tier, area level 79+ (a garantált bone commanderekhez), 4–5 mod. Roll: rare count → quantity → (effectiveness ha bírod) + sustain.",
        stack: [
          { qty: "3×", name: "Abyss Precursor Tablet", note: "Map contains additional Abysses · pit 2× eséllyel ad rewardot · Effectiveness / closed pit (max 100%)" },
        ],
        nodes: [
          { name: "Lightless Legions", level: "mandatory", why: "az Abyss-fa belépője — vedd elsőként." },
          { name: "Sprawling Rupture", level: "strong", why: "több fissure → hosszabb Abyss-vonal." },
          { name: "Unholy Influence", level: "strong", why: "quantity + rarity az Abyss-ból." },
          { name: "Shadow of Undeath", level: "nice", why: "Lichborn — extra abyssal density." },
          { name: "Amanamu, Liege of the Lightless", level: "nice", why: "frakció-választás: defenzív, currency-re a legjobb (vs Ulaman offenzív / Kurgal ailment)." },
        ],
        master: "Jado's Spycraft",
        why: [
          "Omeneket, Abyss Jewelt, Stygian Vise-t és bone currency-t printel — a 0.5.3 garantált Desecrated Currency-t adott az Abyssal Depths bossaitól.",
          "KRITIKUS: a rare mobokat HÚZD KI a sötétből, mielőtt megölöd — a sötétség elnyeli a lootot.",
        ],
        warn: "A per-pit effectiveness gyorsan tankossá teszi a mobokat — közepes+ build kell.",
      },

      {
        key: "expedition", label: "Expedition (Kalguur)", mech: "0.5.3 óta top tier",
        icon: "expedition", risk: "mid", meta: "S · önfinanszírozó loop",
        want: { tablet: "expedition", ideal: 3 }, alt: ["unique"],
        wsLikes: ["packsize", "monsterRarity"], wsBait: ["rarity"],
        waystone: "Pack size → rare mods → (effectiveness). T10+, a Remnant-szám tierrel skálázódik (T15+-on csúcsosodik).",
        stack: [
          { qty: "3×", name: "Expedition Precursor Tablet", note: "increased Quantity of Artifacts/Logbooks · +1 Remnant · +Rare Expedition Monsters" },
        ],
        nodes: [
          { name: "Detailed Records", level: "mandatory", why: "+1 logbook level & implicit mod — a fa kifizetődése." },
          { name: "Steady Development", level: "strong", why: "+1 Remnant encounterenként." },
          { name: "Double or Nothing", level: "strong", why: "az Expedition (Runes of Aldur) fa magja." },
          { name: "Calculated Investment", level: "nice", why: "Power Rune — erősebb remnant." },
        ],
        master: "Jado's Spycraft (Veressium remnant újradob, a legritkábbat tartja)",
        why: [
          "Zárt, ÖNFINANSZÍROZÓ loop — új ligára barát: a Kalguur artifact → currency, ami a következő Logbookot fedezi.",
          "Célozd a Grand Expedition encountereket (~2–3× remnant). Likviditás után válts Abyssra.",
        ],
        warn: null,
      },

      {
        key: "breach", label: "Breach density / splinters", mech: "extrém rare-density",
        icon: "breach", risk: "mid", meta: "A · sűrűség-bomba",
        want: { tablet: "breach", ideal: 3 }, alt: ["unique"],
        wsLikes: ["anymod", "rarity", "packsize", "monsterRarity"], wsBait: ["drop"],
        waystone: "~100–115% Item Rarity, prioritás: 'Rare Monsters have an additional Modifier' (Of Nemeses) + pack/quantity.",
        stack: [
          { qty: "3×", name: "Breach Precursor Tablet", note: "additional Breach · +1 Clasped Hand · additional Rare Monster · increased Breach Splinter quantity" },
          { qty: "1×", name: "Unique Breach tablet (ha van)", note: "pl. Wraeclast Besieged (?)" },
        ],
        nodes: [
          { name: "Rising Pyre", level: "mandatory", why: "+40% Breach density — kötelező keystone." },
          { name: "Crumbling Walls", level: "strong", why: "extra Breach / gyorsabb terjedés." },
          { name: "Reactive Hiveseeding", level: "strong", why: "extra Breach-hívek." },
          { name: "Xesht's Madness", level: "nice", why: "a Breach-payoff vége." },
        ],
        master: "Hilda's Hunting / Doryani's Science",
        why: [
          "Hatalmas, halmozódó rare-density → rengeteg Breach Splinter → Breachstone + nyers currency.",
          "A Breach IDŐZÍTVE záródik — ölj GYORSAN, különben összeomlik és a density kárba vész. Ne told a Breach-számot 100% fölé — a többletet density-re váltsd.",
        ],
        warn: "Erős clear kell — a Breach (főleg +Delirium) gyorsan tankossá és veszélyessé válik.",
      },

      {
        key: "delirium", label: "Delirium", mech: "magas kockázat · simulacrum",
        icon: "delirium", risk: "high", meta: "A · CSAK ha bírod",
        want: { tablet: "delirium", ideal: 3 }, alt: [],
        wsLikes: ["packsize", "monsterRarity"], wsBait: ["drop"],
        waystone: "Max density (rare count + pack size). A deliriousness% a szorzó — de TÚL kell élned a ködöt.",
        stack: [
          { qty: "3×", name: "Delirium Precursor Tablet", note: "increased Stack size of Simulacrum Splinters (best) · extra Fracturing Mirror · longer fog" },
        ],
        nodes: [
          { name: "Is this about me... or you?", level: "mandatory", why: "KÖTELEZŐ a Simulacrum Splinterhez 75+ szinten." },
          { name: "Recurring Nightmares", level: "strong", why: "a ködöt +4 mapra teríti." },
          { name: "You can't just wake up from this one.", level: "nice", why: "fracturing-mirror / simulacrum node." },
          { name: "Tablets Have Double Effect in Grand Mirror Areas", level: "nice", why: "a tablet-hatást duplázza a Grand Mirrorban." },
        ],
        master: "Hilda's Hunting",
        why: [
          "A deliriousness% felszorozza a splintert és a ground lootot — a Simulacrum gyakran többet ér, mint a teljes map loot.",
          "3× Delirium a MAX nehézség ÉS kizárja az összes többi mechanikát a mapen.",
        ],
        warn: "Csak gyors/tankos buildre! Szottyos buildet a köd megöl. Tedd inkább egy sűrűség-mechanika (Breach/Abyss) MELLÉ, ne tisztán.",
      },

      {
        key: "ritual", label: "Ritual (biztonságos omen)", mech: "kis kockázat · te választasz",
        icon: "omen", risk: "low", meta: "B · stabil, halálbiztos",
        want: { tablet: "ritual", ideal: 3 }, alt: ["unique"],
        wsLikes: ["rarity", "packsize"], wsBait: ["drop"],
        waystone: "Item Rarity → Ritual size; pakold a Pack Size-t (a Ritual a mob-számmal skálázódik).",
        stack: [
          { qty: "3×", name: "Ritual Precursor Tablet", note: "reduced reroll Tribute · +Tribute from sacrifice · increased Omen chance" },
          { qty: "1×", name: "Freedom of Faith (ha van)", note: "unique — feldobja a jutalmak értékét" },
        ],
        nodes: [
          { name: "He Approaches", level: "mandatory", why: "vedd elsőként — monster rarity a Ritualokban." },
          { name: "Ominous Portents", level: "strong", why: "Omen-esély a jutalmakban." },
          { name: "Spreading Darkness", level: "strong", why: "4 oltár garantálva." },
          { name: "Reinvigorated Sacrifices", level: "nice", why: "eltünteti a per-revive Tribute-büntetést." },
        ],
        master: "Doryani's Science (biztonság)",
        why: [
          "TE választod a jutalmat (kis RNG) és deferrelhetsz a poolban — alacsony halálkockázat, stabil profit.",
          "KRITIKUS: a Tribute map-enként van és kilépéskor ELVÉSZ — költsd el az egészet (tarts ~1000-et egy drága defer-re).",
        ],
        warn: null,
      },

      {
        key: "vaal", label: "Vaal Temple (Beacon)", mech: "Vaal Beacon ládák · corrupt loot",
        icon: "boss", risk: "mid", meta: "B · niche",
        want: { tablet: "temple", ideal: 3 }, alt: [],
        wsLikes: ["rarity", "monsterRarity"], wsBait: ["drop"],
        waystone: "Tier ízlés szerint; rare/quantity fókusz.",
        stack: [
          { qty: "3×", name: "Temple Precursor Tablet (Vaal)", note: "Vaal Beacon Chest rare esély · +monster a Beacon körül; stackelve több Beacon" },
        ],
        nodes: [
          { name: "Offerings to the Queen", level: "strong", why: "a Fate of the Vaal fa magja." },
          { name: "Secrets of the Ancients", level: "strong", why: "erősebb Vaal-jutalmak." },
          { name: "Stolen Authority", level: "nice", why: "további Beacon-érték." },
          { name: "Royal Prerogative", level: "nice", why: "a payoff vége." },
        ],
        master: "Hilda's Hunting",
        why: [
          "A Vaal Beacon ládák + corrupt loot iránya; stackelve egyre több Beacon kerül a mapre.",
        ],
        warn: null,
      },

    ],

    /* ----- 4) ÁLLANDÓ DÖNTÉSI SZÖVEGEK ----------------------------------- */
    decision: {
      // A respawn-tábla a waystone mod-szám függvényében (0.5 verifikált).
      revivesByMods: [5, 5, 4, 3, 2, 1, 0],

      sustainFirst: "Sustain-first: előbb legyen mindig miből mapot futni (boss node-ok + Waystone-sustain), és csak utána juicelj. Egy fenntarthatatlan alapon a juicing pénzt veszít.",

      dontCombine: [
        "Vegyes tablet-típusok, ha EGY mechanikára farmolsz pénzt — a 3× azonos típus (same-type stacking) többet hoz.",
        "Két mechanika-alfa megosztva 50/50 az Atlas-fán — egyik sem éri el a payoffot (~60%-os hozam).",
        "Boolean-flag duplázása a flagért (pl. 2× Irradiated csak az Irradiated-ért) — a +1 area level NEM duplázódik. (DE: a tableteken lévő quantity/rarity/pack MODOK additívan stackelnek a slotokon — azokért épp megéri több juice-tabletet összerakni.)",
        "Count-mod a cap fölé (pl. Breach-szám 100% fölé) — a többlet kárba vész, density-re váltsd.",
        "Item Rarity, MIELŐTT van density — egy kis bázist szoroz fel, alig ér valamit.",
        "Nehéz juice egy buildre, ami nem bírja — a Breach/Delirium időzítője összeomlik, a loot elszáll.",
      ],

      dangerMods: [
        "Of Exhaustion (−Life/ES Recovery Rate) — szottyos buildet azonnal megöl.",
        "Of Exposure (−max ellenállás) — a leglopakodóbb belövés-forrás.",
        "Of Critical Strikes (+monster crit) — top one-shot forrás.",
        "Of Stagnation (−Cooldown) / Of Flask Scarcity (−flask töltet).",
        "Curse-ök: Enfeeble / Temporal Chains / Elemental Weakness.",
        "Extra elem prefix (Fire/Cold/Lightning/Chaos) + Of Penetration — hirtelen elemi belövések.",
      ],
    },

    sources: [
      { label: "Maxroll · Atlas & mapping", url: "https://maxroll.gg/poe2/resources/atlas-of-worlds-and-mapping" },
      { label: "PoE2 wiki · Precursor Tablet", url: "https://www.poe2wiki.net/wiki/Precursor_tablet" },
      { label: "PoE2 wiki · Waystones", url: "https://www.poe2wiki.net/wiki/Waystone" },
    ],
  });
})();
