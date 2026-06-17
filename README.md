# Atlas Súgó — Path of Exile 2

Endgame (Atlas) farmolás újoncoknak — magyar nyelvű, egyoldalas tutorial.
UI: magyar · játékkifejezések: English.

**Élő oldal:** https://shanpapa.github.io/poe2-atlas-sugo/

## Mi ez?

Egy önálló, statikus weboldal, amit a [Claude Design](https://claude.ai) készített.
A `index.html` a `support.js` runtime segítségével kliensoldalon (React + Babel,
unpkg.com CDN-ről) rendereli a tartalmat — nincs szükség szerverre, ezért
GitHub Pages-en is elérhető.

> Internet szükséges a megtekintéshez (React/ReactDOM/Babel a CDN-ről + Google Fonts).

## Fájlok

| Fájl | Szerep |
| --- | --- |
| `index.html` | A GitHub Pages által kiszolgált belépőpont (az `Atlas Súgó.dc.html` másolata). |
| `Atlas Súgó.dc.html` | Az eredeti Claude Design export (visszaimportálható). |
| `support.js` | A Claude Design runtime (a `<x-dc>` tartalmat rendereli). |
| `.nojekyll` | Kikapcsolja a Jekyll-feldolgozást, hogy a Pages mindent változatlanul szolgáljon ki. |
| `screenshots/`, `uploads/` | Kiegészítő anyagok, korábbi verziók (az oldal nem hivatkozik rájuk). |

## Helyi megtekintés

Nyisd meg az `index.html`-t egy böngészőben (vagy egy egyszerű helyi szerverrel,
pl. `python -m http.server`).
