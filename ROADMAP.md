# PoE2 Atlas Súgó — Fejlesztési terv (roadmap)

> **Státusz:** brainstorm, 2026-06-18. Még semmit nem kódoltunk — ez a terv, amihez
> később *frissen* nekiállunk. Amikor folytatjuk: ezzel a fájllal kezdj.

---

## 1. Vízió / pozícionálás

- **Noob / referencia guide — NEM build guide.** Build-oldalból van elég; ez a
  „hogyan működik a játék" rést tölti be magyarul.
- Témák: **Atlas, mapok, statok, stat-kombók, crafting, runecrafting, gemek,
  trade, túlélés (damage mitigation).**
- Magyar UI · angol játék-szakszavak (a meglévő konvenció).
- A tartalom **egy konkrét magyar tartalomgyártó videóira** épül (az ő videóiból
  dolgozunk fel guide-okat).
- Ebből **két tartalomtípus** adódik:
  1. **Guide-ok** — videóból, narratív, lépésről lépésre.
  2. **Referencia** — táblázatok: stat-kombók, craft-receptek, map-modok.

## 2. Jelenlegi állapot

- Élő oldal: <https://shanpapa.github.io/poe2-atlas-sugo/>
- Repo: <https://github.com/Shanpapa/poe2-atlas-sugo> (public, GitHub Pages, `main` gyökér)
- Technika: Claude Design export (`index.html` + `support.js` runtime, React/Babel
  unpkg CDN-ről, kliensoldali render). Statikus, szerver nélkül megy.
- **Korlát:** egyetlen, kézzel készült monolit HTML fájl. Egy oldalnak gyönyörű,
  de sok, folyamatosan bővülő tartalomhoz nem skálázódik.

## 3. Architektúra-döntés (javaslat)

**Váltás tartalom-vezérelt statikus oldalra — `Astro` content-collections.**
- **1 guide = 1 Markdown fájl** (frontmatter + törzs).
- A mostani dizájnt **újrahasznosítható komponensekbe** portoljuk → minden új guide
  automatikusan örökli a szép kinézetet (a szépség ma 1 fájlba zárva; utána
  *design-rendszer* lesz belőle).
- A meglévő React-komponensek megmaradhatnak **Astro „island"-ként**.
- **Marad:** ingyenes GitHub Pages, magyar/English konvenció.
- **Plusz:** előre renderelt HTML → gyors + **SEO** (noob guide-nak létkérdés, hogy
  megtalálják), beépíthető **kereső** (pl. Pagefind).
- **Deploy:** push a `main`-re → GitHub Actions build → ~2 perc múlva élő. A user
  soha nem futtat buildet kézzel.
- *Alternatíva:* VitePress / Docusaurus — gyorsabb induló docs-site, de merevebb,
  kevésbé szabható kinézet. A custom „PoE grimoire" esztétika miatt az Astro nyer.

## 4. A lényeg: transcript → kész guide pipeline (1 parancs)

Egy **repo-beli Claude Code skill**, pl. `/uj-guide <youtube-url>`, ami végigviszi:

1. **Felirat lehúzása** — `yt-dlp` (a magyar auto-felirat is megy), vagy beillesztett
   transcript.
2. **Fogalomtár-korrekció** — az auto-felirat elrontja az angol szakszavakat
   (Abyss, Waystone, Kalguuran, Delirium…); egy közös **glossary** alapján kijavítjuk.
3. **Sablon szerinti Markdown** — frontmatter (`title`, `category`, `video` URL,
   `patch`, `updated`, `difficulty`, `tags`, `timestamps`) + szekciók
   (TL;DR · lépésről lépésre · „tartsd / add el / kerüld" blokkok · stat-táblák).
4. **Emberi review** — a felirat hibázik és a játék patch-enként változik, ezért a
   user mindig átnézi/jóváhagyja a vázlatot. **Ember a hurokban kötelező.**
5. **Push → Actions build → élő.**

**Két kiemelt feature, ami pont a videós forrásból jön:**
- ⏱ **Időbélyeg deep-link** — minden szekció a videó pontos pillanatára ugrik
  (`youtu.be/...?t=`). Olvasd **vagy** nézd.
- 🔖 **Patch-frissesség** — minden guide-on „0.5.x-re érvényes" címke; újabb patchnél
  jelzi, hogy lehet elavult.

## 5. Tartalom-modell

- Astro **content collections**: `guides/` (szigorú frontmatter-sémával) és
  `reference/` (vagy `data/` a táblázatos tartalomnak).
- **Frontmatter mezők (terv):** `title`, `category`, `video`, `patch`, `updated`,
  `difficulty`, `tags`, `timestamps[]`.
- **Kategóriák:** Atlas · Crafting · Runecrafting · Gemek/Skillek · Trade ·
  Védelem/Túlélés · Map/Stat referencia · „Mi változott" (patch-idővonal).

## 6. Extra feature-ök (noob-fókusz)

- **Fogalomtár tooltipekkel** — ugyanaz a glossary javítja a feliratot *és* ad
  hover-magyarázatot az oldalon (dupla haszon).
- **„Noob-ösvény"** — ajánlott olvasási sorrend kezdőnek (Atlas → túlélés →
  crafting → trade). Ez a fő különbség a build-oldalakhoz képest.
- **Creator-kreditek** — beágyazott videó + csatorna-link minden guide tetején (co-branding).
- **Statikus kereső** (Pagefind) — ahogy nő a tartalom.
- **Mobil** — reszponzív (már megvan a mostani oldalon).

## 7. Induló sitemap — a feldolgozandó videók

| Videó | Hova kerül |
|---|---|
| Így rakd ki az Atlas pontjaidat! \| PoE2 | **Atlas** — passzív fa kezdés + mechanika-fák *(a meglévő oldalhoz kapcsolódik)* |
| Szia Uram! POE2 Trade Alapok | **Trade** |
| Return of the Ancients 0.5.2 Patch Notes + Hotfix | **„Mi változott"** idővonal (friss-tartás) |
| A PoE2 Craftingja sokkal egyszerűbb, mint gondolnád | **Crafting** alapok |
| POE2: Kalguuran Gem bemutató (Runes of Aldur) | **Gemek / Skillek** |
| Runes of Aldur: Runecrafting, POE2 0.5 | **Runecrafting** (Crafting alatt) |
| EZÉRT HALSZ MEG FOLYAMATOSAN A POE2-BEN! | **Védelem / Túlélés** (damage mitigation) |

## 8. Javasolt első lépések (amikor nekiállunk)

1. Astro váz felállítása + GitHub Actions deploy a Pages-re.
2. Dizájn portolása komponensekbe; a **mostani Atlas-oldal = az első guide** (bizonyíték: ugyanúgy néz ki).
3. `/uj-guide` skill megírása (`yt-dlp` + fogalomtár + guide-sablon).
4. **1 videó end-to-end** legyártása proofként — javaslat: az *Atlas-pontos* videó (kapcsolódik a meglévő tartalomhoz).
5. Fogalomtár (glossary) első verziója.
6. Iterálás: a többi videó feldolgozása.

## 9. Nyitott kérdések (később eldöntendő)

- Astro vs VitePress — végső döntés.
- Saját domain, vagy marad a `github.io`?
- Felirat-forrás: elég az auto-felirat, vagy a creator ad pontosabb scriptet/jegyzetet?
- Nyelv: csak magyar, vagy később EN is?
- Creator bevonása — ő adja a videókat/jegyzeteket, esetleg lektorál?
- Patch-elavulás jelzése: kézi vagy (félig) automatikus?

---

*Készült Claude Code-dal. Folytatáskor: olvasd el ezt, majd a 8. pont szerint indulj.*
