/* ============================================================================
   GUIDE: Atlas Passzív Fa kezdés  (Dartagnan — "Így rakd ki az Atlas pontjaidat")
   ----------------------------------------------------------------------------
   Ez egy ÚJ tartalomtípus (type: "atlastree") — nem farm-recept, hanem a fő
   atlas fa ajánlott kezdése + a mechanikák külön fái.

   Külön fájlban van (nem a content.js-ben), és magától beregisztrálja magát az
   appba: hozzáfűz egy új célt a window.ATLAS.goals listához. Így működik majd a
   "1 videó = 1 fájl" elv. Az index.html a content.js UTÁN tölti be ezt.

   MINDEN ingame név poe2db.tw / poe2wiki / Game8 ellen ellenőrizve (lásd a
   chat verifikációs riportját). Bizonytalan tételek külön jelölve a végén.
   ========================================================================== */

window.ATLAS.goals.push({
  key: "atlasfa",
  label: "Atlas fa kezdés",
  mech: "passzív fa · alapozás",
  icon: "atlas",
  type: "atlastree",
  videoSeconds: 5,
  videoTime: "0:05",
  patch: "0.5 · Return of the Ancients",
  intro: "Dartagnan ajánlott Atlas passzív fa kezdése: előbb a sustain-first fő fa, majd mechanikánként a külön fák. Minden node-név poe2db-vel ellenőrizve. Cél: kezdőként ne vessz el — rakd ki a fő fát, aztán válassz egy mechanikát.",

  /* ---- FŐ FA: ajánlott sorrend (sustain-first) ---- */
  steps: [
    {
      title: "Fel a fa tetejére — tablet node-ok",
      detail: "Ez fizet vissza a leggyorsabban: minden tabletedet felhúzza. Az Arbiter of Divinity legyőzése után jönnek a jobb (3→4 modos) rare tabletek.",
      nodes: ["Partial Translation", "Reverse Transcription", "Propagating Secrets"],
    },
    {
      title: "Belépő mechanika-node-ok (sustain)",
      detail: "A 0.5 csökkentette az alap spawn-rátákat, ezért a választott mechanikád node-jait kell kirakni. Legegyszerűbb kezdés: Azmeri Spirit vagy Essence.",
      nodes: ["Strongbox", "Shrine", "Azmeri Spirit", "Essence", "Summoning Circle", "Rogue Exiles"],
    },
    {
      title: "Általános „minden mapen” statok",
      detail: "Sűrűség + sustain: ez megy minden farmhoz. A waystone drop a térkép-üzemanyagod.",
      nodes: ["Increased Rare Monsters", "Magic Monsters", "Pack Size", "Item Rarity", "Waystone Drop Chance"],
    },
    {
      title: "Rare-monster sűrűség — Nemesis Rising",
      detail: "A tabletek után a második legnagyobb szorzó. Több rare-modifier = több loot, de tankosabb mobok — erős build kell hozzá.",
      nodes: ["Nemesis Rising", "Desert rare-monster cluster"],
    },
    {
      title: "Shrine ág — Seeking Shrine",
      detail: "A Seeking Shrine item rarity-t ad (a Gloom Shrine damage-et). A mini-node-okkal hosszabb és erősebb a buff, és magic packok őrzik a shrine-t.",
      nodes: ["Seeking Shrine", "Prayer of Guidance"],
    },
    {
      title: "Magic pack — Evolving Thorns",
      detail: "A pack size oldalt válaszd. Magic moboknak NE adj modifiert — azt a rare moboknak akarjuk (azt fent már megoldottuk).",
      nodes: ["Evolving Thorns"],
    },
    {
      title: "Válassz EGY biome-ot és építsd ki",
      detail: "Ne szórd szét. Desert = rare monsterek; Grass = pack size + currency-upgrade; Swamp = exalted→chaos. Mellé: Eons of Domination (Overseer tablet), Hidden Scars (Fracturing Orb), Blood on the Stone.",
      nodes: ["Desert / Grass / Swamp Mastery", "Eons of Domination", "Eons of Contamination", "Hidden Scars", "Blood on the Stone"],
    },
  ],

  /* ---- MECHANIKA-FÁK ---- */
  trees: [
    {
      name: "Vaal Temple",
      sub: "Fate of the Vaal",
      note: "A templom szobákból épül; a cél több reward-room + medallion → Atziri. ⚠️ A Secrets of the Ancients NEM respeccelhető — terraforming/research roomokat ad a reward-roomok helyett, kezdőként kerüld.",
      best: "„Több juice per room” klaszter (Efficient Arteries · Power Relays · Transcendent Progress · Machinations) + Patrolling Legions + The Lost Architect — több mini-boss és modifier-medallion.",
      nodes: [
        { name: "Riches of the Empire", level: "strong", why: "~15% esély a temple currency duplázására." },
        { name: "Patrolling Legions", level: "strong", why: "Több Vaal mini-boss + modifier-medallion." },
        { name: "The Lost Architect", level: "strong", why: "Párban a Patrolling Legionsszel — extra mini-bossok." },
        { name: "Royal Prerogative", level: "strong", why: "Kevesebb room-törlés (Destabilisation)." },
        { name: "Expanded Design", level: "strong", why: "+Restricted Room minden Architect-ölésért." },
        { name: "Offerings to the Queen", level: "nice", why: "Korai pick: több temple currency a beacon-ládákból." },
        { name: "Secrets of the Ancients", level: "nice", why: "FIGYELEM: trap, nem respeccelhető — kihagyni ajánlott." },
      ],
      terms: [
        { k: "Vaal Beacon", v: "Abyss-szerű beacon a mapen, ami felerősíti a közeli mobokat." },
        { k: "Zantipi's Medallion", v: "Random waystone-modot rak a templomra (több veszély + jutalom)." },
      ],
    },
    {
      name: "Abyss",
      sub: "pit-sűrűség",
      note: "A cél minél több Abyss Pit (több pit = több mob, láda, jutalom). A Balance of Power-nél válassz frakciót. Dartagnan ajánlása: Amanamu + Omen-farm (az Omeneknek jó áruk van).",
      best: "Dark Depths + From Below + Lord of the Pit — az „extra-pit” volumen-vonal: brutálisan megsokszorozza a piteket.",
      nodes: [
        { name: "Lord of the Pit", level: "mandatory", why: "Keystone: pitek szétszórva + abyss-effectiveness/lezárt pit (max 100%)." },
        { name: "Dark Depths", level: "mandatory", why: "10/20/30% esély +pitekre — a volumen motorja." },
        { name: "From Below", level: "strong", why: "Minden abyss +1 pitet tartalmaz." },
        { name: "Stir the Swarm", level: "strong", why: "A mapjaid +1 abysst tartalmaznak." },
        { name: "Unholy Influence", level: "strong", why: "+100% esély, hogy az abyss-mobok abyssal-modot kapnak." },
        { name: "Endless War", level: "strong", why: "Overrun abyss után 50% eséllyel a szomszéd mapet is elárasztja." },
        { name: "Vile Treasures", level: "nice", why: "Keystone: +50% abyss-drop (Abyssal Eyes / Omens / Lineage)." },
      ],
      terms: [
        { k: "Balance of Power", v: "Frakció-keystone: Amanamu (armour, Omen-farm) · Ulaman (currency) · Kurgal (weapon)." },
        { k: "Lichborn", v: "Abyss-befolyásolt Rogue Exile — a Heart of the Well jewelek forrása." },
      ],
    },
    {
      name: "Breach",
      sub: "a transcriptben tévesen „Bridge”",
      note: "A bal oldal a nyers volumen (több breach/hive/wave), a jobb oldal a Genesis-craft (gyűrű/öv/amulet/currency womb) — utóbbi külön videó téma.",
      best: "Reactive Hiveseeding + Frantic Invasion + Swelling Hives + Reality Wound (+ Shape the Chains +15% pack size) — a „több breach, több mob, több loot” vonal.",
      nodes: [
        { name: "Reactive Hiveseeding", level: "strong", why: "Breach teljesítésekor 10% esély hive-ot rakni egy közeli mapre." },
        { name: "Frantic Invasion", level: "strong", why: "+100% esély, hogy Vruun, Marshal of Xesht megjelenjen." },
        { name: "Swelling Hives", level: "strong", why: "A breach hive-ok +1 szörnyhullámot tartalmaznak." },
        { name: "Reality Wound", level: "nice", why: "Az unstable breachek +10 mp-ig maradnak nyitva." },
        { name: "Shape the Chains", level: "strong", why: "Keystone: rare effectiveness +30% VAGY +15% pack size." },
        { name: "Tear Open the Rift", level: "nice", why: "Keystone: a breach stronghold-ok modokat adnak a felfedett mapekhez." },
      ],
      terms: [
        { k: "Ailith", v: "A hive-védő NPC (a transcript „Elite”-nek hallotta), őt véded a hullámok közben." },
        { k: "Vruun, Marshal of Xesht", v: "A ritka Breach-boss; a Flesh Flower → Grasping Orchid hozzá kötődik." },
        { k: "Wombgift", v: "Signet=gyűrű · Ornate=amulet · Banded=öv · Lavish=currency · Revelatory=breachstone." },
      ],
    },
    {
      name: "Ritual",
      sub: "tribute → reroll → omen",
      note: "Cél: maximális tribute + reroll + Audience with the King progresszió. A Tainted ritual ad öveket (a Mageblood/Headhunter slotja).",
      best: "Patient Devotion + Magnanimous Offerings + Tempting Offers + Mysterious Rites + Royal Tithe. ⚠️ Ez reroll-hatékonyság, nem tribute-termelés — párosítsd tribute-forrással (Reborn in Shadow / Ancient Enmities), különben nem lesz mit elkölteni.",
      nodes: [
        { name: "Patient Devotion", level: "mandatory", why: "Defer 50% olcsóbb és 50%-kal hamarabb tér vissza — a drága rewardot életben tartja." },
        { name: "Magnanimous Offerings", level: "strong", why: "20% esély ingyen rerollra." },
        { name: "Tempting Offers", level: "strong", why: "+1 reroll altáronként." },
        { name: "Mysterious Rites", level: "strong", why: "8% Queen's Ritual: +Omenek és garantált Idol — a jackpot." },
        { name: "Royal Tithe", level: "strong", why: "+15% Audience with the King progresszió." },
        { name: "Reborn in Shadow", level: "nice", why: "Feltámasztott mobok +40% Magic/+40% Rare — tribute-forrás." },
      ],
      terms: [
        { k: "Traveller's Woe", v: "Keystone (NEM waystone!): +100% esély adott ritual-típusra (Tainted = övek)." },
        { k: "Mageblood / Headhunter", v: "Öv-uniquek: Tainted ritual (öv-slot) + Hour of the Nameless / Spreading Darkness." },
      ],
    },
    {
      name: "Delirium",
      sub: "a node-ok hátborzongató mondatok",
      note: "A node-nevek tényleg ijesztő mondatok — ezek a valódi nevek! A 0.5 könnyített rajta (felezett unique toughness). Cél: vagy sűrűség, vagy jackpot (simulacrum / megalomaniac / fracturing mirror).",
      best: "Sűrűség: „You can't just wake up from this one.” + „These demons are all your own…” + „Get out of my head!” + „There's nowhere to hide…” + „You thought you were free?”  ·  Jackpot: „The mirrors… the mirrors!” + „Is that the best you've got?!” + „Is this about me… or you?”",
      nodes: [
        { name: "„These demons are all your own…”", level: "strong", why: "Sűrűség: a rare mobok mindig delirium démonokat idéznek a ködben." },
        { name: "„You can't just wake up from this one.”", level: "strong", why: "Sűrűség: a köd 30%-kal lassabban oszlik el." },
        { name: "„There's nowhere to hide…”", level: "strong", why: "A köd mindig átterjed a simulacrumot körülvevő mapekre." },
        { name: "„The mirrors… the mirrors!”", level: "strong", why: "Jackpot: +50% fracturing mirror a ködben." },
        { name: "„Is this about me… or you?”", level: "strong", why: "Jackpot: simulacrum splinter 75+ mapeken; megalomaniac jewel 10% eséllyel 3 notable-t ad." },
        { name: "Recurring Nightmares", level: "nice", why: "Keystone: hogyan terjed a köd a Grand Mirrorból (pl. +4 map fixen)." },
      ],
      terms: [
        { k: "Liquid Emotion", v: "Melancholy / Ferocity / Contempt (a transcript „Velocity”-t mondott — az Ferocity). Tier: base → Potent → Ancient." },
        { k: "Megalomaniac", v: "Unique jewel a Simulacrumból (2–3 random notable passzívot ad)." },
      ],
    },
  ],
});
