# Lizly

**Earn here. Unlock there.**

Lizly is a click-around prototype of a shared loyalty passport for neighborhood
businesses. There's no backend — every bit of state (progress, unlocked
rewards, redeemed codes, theme, onboarding) lives in `localStorage` via
Zustand, so the whole app is fully interactive and persists between reloads
without a database.

## The mechanic

Progress earned at one partner unlocks a reward redeemed at a **different**
partner — never the same shop. Chains of these earn → unlock links form
closed loops. Lizly ships with three:

- **The Grind Loop** (5 partners) — coffee → sauna → HIIT → food → boutique → back to coffee
- **The Style Loop** (4 partners) — florist → record shop → barber → bookshop → back to florist
- **The Mind Loop** (3 partners) — yoga → veggie bar → massage → back to yoga

## Screens

- **Loops** — a circular loop diagram (the visual centerpiece) plus the
  chain list, showing earn progress, the "unlocks X at Y" connector, and
  redeem targets.
- **Partners** — searchable/filterable directory of every business, each
  showing what you can earn there and what you can redeem there.
- **Wallet** — every reward as a ticket, grouped by locked / ready to redeem
  / redeemed, with a generated QR code + code for the ready ones.
- **Profile** — stats, dark/light theme toggle, and a reset-demo button.

Tap "+ Log a stamp/visit/purchase…" inside any chain sheet to simulate
progress — reaching the goal triggers an unlock animation, then you can
reveal a QR code and mark it redeemed.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Zustand (persisted), Framer
Motion, `qrcode.react`, `lucide-react`.

## Run it

```bash
npm install
npm run dev
```
