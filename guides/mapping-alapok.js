/* ============================================================================
   GUIDE — MAPPING KEZDÉS (Atlas alapok újoncoknak)
   ----------------------------------------------------------------------------
   Önregisztráló guide: a window.ATLAS.goals listához adja magát.
   Típus: "guide" (generikus blokk-renderer az app.js-ben).
   UI magyar, ingame nevek angolul. Patch 0.5.x (Return of the Ancients).
   Forrás: a sessionben összeszedett + verifikált infók (Maxroll, PoE2 wiki,
   0.5.3 patch notes). EZT a fájlt nyugodtan szerkeszd — csak adat.
   ========================================================================== */
(function () {
  if (!window.ATLAS || !window.ATLAS.goals) return;

  window.ATLAS.goals.push({
    key: "mapping",
    label: "Mapping kezdés",
    mech: "Atlas alapok · 0.5",
    icon: "mapping",
    type: "guide",
    patch: "0.5.x · Return of the Ancients",
    intro: "Most fejezted be a kampányt és belépsz az Atlasba? Itt a noob-barát alap: melyik node-ra mi megy, milyen Waystone-t keress, és melyik tabletet mikor. (A friss rendszer: a tablet a Map Device-ba megy, NEM a Toronyba — sok régi videó még a régit mutatja.)",

    blocks: [

      {
        kind: "keypoints",
        label: "A lényeg 3 mondatban",
        items: [
          "Egy node = egy Waystone. A „map” maga a Waystone — ezt rakod a Map Device-ba; ez adja a pálya szintjét és a loot mennyiségét.",
          "A tablet a Waystone MELLÉ megy, ugyanabba a Map Device-ba — és csak azt az egy mapot buffolja. Hány fér be? A Waystone modjainak száma dönti: 1 mod → 1 slot, 3+ mod → 2 slot, 6 mod → mind a 3.",
          "A Toronyba (Lost Tower) NEM raksz tabletet. A Tower ma már csak ködöt tár fel és dob egy ingyen tabletet. (A „tedd a toronyba, sugárban hat” infó elavult, 0.3.1 előtti.)",
        ],
      },

      {
        kind: "slotboard",
        label: "Hova mi megy? — minden a Map Device-ba",
        waystone: { title: "Waystone — ez a „map”", sub: "1 db · ezt futtatod le" },
        tablets: [
          { title: "Tablet 1", sub: "mindig elérhető" },
          { title: "Tablet 2", sub: "ha a Waystone-on 3+ mod van" },
          { title: "Tablet 3", sub: "ha a Waystone-on 6 mod van" },
        ],
        result: { title: "1 felhúzott map", sub: "a Waystone + tabletek együttes hatásával" },
        myth: { title: "Tower node ≠ tablet-tartó.", text: "Csak feltárja a ködöt az Atlaszon és dob 1 tabletet — ide NEM raksz tabletet." },
      },

      {
        kind: "cards",
        label: "Atlas node-típusok — mit raksz bele",
        cols: 4,
        items: [
          { sym: "◆", title: "Sima map node", badge: "alap", tone: "neutral", desc: "1 Waystone + tetszőleges tablet. A kenyered-vajad; csak a már teljesített mappal szomszédos node futtatható." },
          { sym: "☉", title: "Lost Tower", badge: "feltárás", tone: "info", desc: "Csak 1 Waystone. Ködöt tár fel + 1 ingyen tablet. Ide NEM rakod a tabletet." },
          { sym: "△", title: "Boss node", badge: "sustain", tone: "good", desc: "1 Waystone (+ Overseer tablet). Magasabb tier Waystone-t dob — a sustain motorja." },
          { sym: "✦", title: "Citadel / unique", badge: "endgame", tone: "risk", desc: "T15+ Waystone (Iron/Copper/Stone). Endgame-kapu — kezdőként hagyd ki." },
        ],
      },

      {
        kind: "mods",
        label: "Milyen tulajdonságú legyen a Waystone (mire rollolj)",
        hint: "a loot ~90%-a a rare szörnyekből jön — eszerint a prioritás",
        legend: true,
        items: [
          { name: "increased number of Rare Monsters / monsters have an additional modifier", why: "A loot fő forrása. Több/erősebb rare = több zsákmány. Ezt keresd elsőként.", level: "mandatory" },
          { name: "increased Item Quantity", why: "Több drop összességében.", level: "strong" },
          { name: "increased Item Rarity", why: "Csak akkor jó, ha már sok a rare — magában „üres”, nincs mit dobnia.", level: "nice" },
          { name: "increased Pack Size", why: "Lootra inkább „bait”; főleg XP-farmra és Expeditionhöz hasznos.", level: "nice" },
        ],
      },

      {
        kind: "callout",
        tone: "warn",
        icon: "⚠",
        title: "Veszélyes suffixek, amiket kezdőként kerülj",
        items: [
          "„less Recovery Rate of Life / Energy Shield” — squishy buildet könnyen megöl.",
          "„Monsters deal extra X damage as Extra [element]” — hirtelen, brutál belövések.",
          "Túl-moddolás: minden mod az ELSŐ után elvesz egy újraéledést. 0–1 mod = 6 próbálkozás, 5 mod = 2, 6 mod = csak 1 (0 respawn). Plusz minden halál a teljes XP-csíkod ~10%-a.",
        ],
      },

      {
        kind: "cards",
        label: "Tabletek — típus és kezdő-besorolás",
        items: [
          { title: "Irradiated / generic", badge: "Könnyű", tone: "good", desc: "Tiszta map-juice (+1 szint), nincs új mechanika." },
          { title: "Ritual", badge: "Könnyű", tone: "good", desc: "Oltárok; saját tempóban, te választasz jutalmat." },
          { title: "Expedition", badge: "Könnyű", tone: "good", desc: "Kalguur ásatás; te robbantasz, kontrollált harc." },
          { title: "Overseer", badge: "Sustain", tone: "info", desc: "Map bosst erősít → több Waystone. Boss node-hoz." },
          { title: "Breach", badge: "Közepes", tone: "mid", desc: "Sűrű szörny-hullámok; jó clear-speed kell." },
          { title: "Abyss", badge: "Közepes", tone: "mid", desc: "Repedést követsz; a záró gödör-harc megugorhat. (De pénzt hoz — lásd az „Abyss tablet flip” lapot!)" },
          { title: "Delirium", badge: "Kockázatos", tone: "risk", desc: "Köd, gyorsan nő a veszély. Tankosabb build kell." },
        ],
      },

      {
        kind: "pairings",
        label: "Páros ajánlások (node → map → tablet)",
        items: [
          { situation: "Most kezdesz — biztonságos tierezés", map: "T1–T5, Orb of Alchemyvel 4-modos Rare (Rare Monsters + Quantity)", tablet: "0–1× Overseer", why: "Boss mapok magasabb tier Waystone-t dobnak → gyűlik a készleted." },
          { situation: "Könnyű extra loot tanulás közben", map: "Közepes Rare (3+ mod → nyílik a 2. slot)", tablet: "Ritual + Expedition", why: "Mindkettő saját tempóban megy, nincs beragadós halál." },
          { situation: "Új régió feltárása az Atlaszon", map: "Bármilyen olcsó Waystone", tablet: "— (semmi)", why: "A Tower jutalma a köd + 1 ingyen tablet; ne pazarolj rá jó tabletet." },
          { situation: "Egy map kimaxolása (mid-game)", map: "6-modos Rare (mind a 3 slot nyílik)", tablet: "2–3× UGYANAZ a típus (pl. 3× Breach)", why: "Az azonos-típus stack a 0.5 juicing metája (a tower-átfedés megszűnt)." },
        ],
      },

      {
        kind: "steps",
        label: "Gyors indulás (lépésről lépésre)",
        items: [
          { title: "Identify-old a Waystone-t", detail: "0.5.0 óta kötelező, mielőtt aktiválnád a Map Device-ban." },
          { title: "Orb of Alchemy a Waystone-ra", detail: "Azonnal 4-modos Rare lesz. Nézd: van-e rajta Rare Monsters / Quantity." },
          { title: "Futtass egy kék node-ot", detail: "Tedd a Map Device-ba, válassz kéken világító (szomszédos) node-ot, Traverse." },
          { title: "Tornyokat tárj fel", detail: "Lost Tower → gyújtsd meg a Precursor Beacont → köd feltárul + 1 ingyen tablet. Tabletet NE rakj bele." },
          { title: "Sustain az első", detail: "Boss node-ok + Atlas-passzív (Waystone quantity / rarity / +tier), hogy sose fogyj ki T15 előtt." },
          { title: "Tegyél 1 tabletet a Waystone mellé", detail: "Kezdőbarát: Ritual / Expedition / Overseer. Több slothoz több mod kell a Waystone-on." },
          { title: "Reforging Bench a tierezéshez", detail: "3 azonos tier, nem-korruptált Waystone → 1 eggyel magasabb (3× T5 → T6). A kimenet mod nélkül jön, rollold újra. A rarity a legalacsonyabb inputé — ne keverj Rare-t Normallal!" },
          { title: "Specializálódj", detail: "Válassz 1 mechanikát, fejleszd az Atlas-alfáját, stackeld azonos tabletekkel. Citadel + pinnacle bossok (Arbiter of Ash → Arbiter of Divinity) ráérnek, ha a T15 rutin." },
        ],
      },

      {
        kind: "callout",
        tone: "good",
        icon: "✦",
        title: "Atlas-fa prioritás kezdőként",
        text: "Sustain (Waystone qty / rarity / +tier) → boss node-ok → 1 választott mechanika alfája → „Adjacent Map Unlock” a gyorsabb terjedéshez. A veszélyeset (Delirium) hagyd későbbre.",
      },

      {
        kind: "sources",
        label: "Források · patch 0.5.x",
        items: [
          { label: "Maxroll · Atlas & mapping", url: "https://maxroll.gg/poe2/resources/atlas-of-worlds-and-mapping" },
          { label: "PoE2 wiki · Waystones", url: "https://pathofexile2.wiki.fextralife.com/Waystones" },
          { label: "Patch 0.5.3 notes", url: "https://patchbot.io/games/path-of-exile-2/articles/568-053-patch-notes" },
        ],
      },

    ],
  });
})();
