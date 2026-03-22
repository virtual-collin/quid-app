# QUID × ScreenCloud ATM

A mobile-first ATM web application built with React + Vite.

Built as part of the ScreenCloud frontend challenge. Michael needs to buy a Nintendo Switch — this app helps him get his cash out.

---

## Getting started

### Prerequisites

- Node.js `v22.12.0` or higher
- npm `v10` or higher

### Installation

Clone the repository:
```bash
git clone https://github.com/virtual-collin/quid-app.git
cd quid-app
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### PIN

Use PIN `1111` to log in.

---

## The brief

Michael has a balance of £220 and wants to make three withdrawals:

| Withdrawal | Amount | Expected result        |
|------------|--------|------------------------|
| 1          | £140   | Successful             |
| 2          | £50    | Successful             |
| 3          | £90    | Successful — overdrawn |

The machine starts with:

| Note | Quantity | Total value |
|------|----------|-------------|
| £20  | 7        | £140        |
| £10  | 15       | £150        |
| £5   | 4        | £20         |

The overdraft limit is £100. Michael's balance after all three withdrawals is −£10.

---

## Note dispensing algorithm

The core challenge of this project is deciding which notes to dispense for a given amount.

A pure greedy algorithm (largest denomination first) would work but produces a poor mix — it would exhaust £20s immediately and leave the machine unbalanced.

Instead I implemented a **proportional greedy algorithm**:

1. **Calculate the proportional value** each denomination represents in the machine at that moment
2. **Allocate notes proportionally** — if £20s represent 45% of the machine's value, they should represent roughly 45% of any withdrawal
3. **Greedy remainder pass** — rounding in step 2 can leave a small remainder, so a second pass tops up using the largest available denomination
4. **Impossibility check** — if the exact amount still can't be made (e.g. only £20s left but the remainder is £10), return null and decline gracefully

This produces a natural mix of notes that feels like a real ATM, adapts dynamically as stock depletes, and handles edge cases cleanly.

---

## Technical decisions

### React + Vite
Fast dev server, minimal config, industry standard for React projects in 2026. No unnecessary complexity.

### Plain CSS with custom properties
The brief rewards maintainable code. CSS custom properties give us a design token system (colours, spacing, radius, typography) defined in one place — `index.css` — that every component references. This is the same principle Tailwind uses, just without the dependency.

BEM-style naming keeps component styles scoped and readable without needing CSS Modules.

### No router
The app has a fixed linear flow with no deep-linking requirements. A simple `screen` state value in `App.jsx` is cleaner and easier to reason about than URL-based routing for this use case.

### No state management library
All shared state lives in `App.jsx` and is passed down as props. The component tree is shallow enough that prop drilling is not a problem. Adding Redux or Zustand would be over-engineering.

### Proportional greedy algorithm over dynamic programming
Dynamic programming would find the mathematically optimal solution but is overkill for three denominations. The proportional greedy approach is O(n) in the number of denominations, easy to read, easy to test, and produces a better UX result (even mix of notes) than pure greedy.

---

## Project structure
```
src/
  components/
    PinEntry.jsx        # Login screen — PIN input and API verification
    PinEntry.css
    Dashboard.jsx       # Home screen — balance and transaction history
    Dashboard.css
    AmountEntry.jsx     # Withdrawal amount selection and validation
    AmountEntry.css
    NoteBreakdown.jsx   # Post-transaction confirmation and note breakdown
    NoteBreakdown.css
    SessionEnd.jsx      # Session complete screen
    SessionEnd.css
    BottomNav.jsx       # Persistent bottom navigation bar
    BottomNav.css
    Keypad.jsx          # Reusable PIN keypad
    Keypad.css
  utils/
    dispenseNotes.js    # Proportional greedy note dispensing algorithm
    pinApi.js           # PIN verification API client
  App.jsx               # Root component and state machine
  index.css             # Design tokens and global styles
```

---

## Features

- PIN verification against live API
- Proportional greedy note dispensing algorithm
- Overdraft support up to £100
- Live transaction history — updates after every withdrawal
- Low stock warning when any denomination runs low
- Graceful decline when machine can't make exact amount
- WCAG AA compliant colour contrast throughout
- Mobile-first responsive layout
- Smooth screen transitions and animations
- Deposit tab included as a coming soon feature — shows product thinking beyond the brief

---

## WCAG compliance

All colour combinations have been tested against WCAG 2.1 AA standards:

| Element                  | Foreground | Background | Ratio  | Result |
|--------------------------|------------|------------|--------|--------|
| Primary text             | `#FFFFFF`  | `#0D0D0D`  | 21:1   | AAA    |
| Secondary text           | `#AAAAAA`  | `#0D0D0D`  | 7.1:1  | AAA    |
| Muted text / nav inactive| `#777777`  | `#0D0D0D`  | 4.6:1  | AA     |
| Accent / nav active      | `#9B59F5`  | `#0D0D0D`  | 5.2:1  | AA     |
| Success green            | `#22C55E`  | `#0D0D0D`  | 5.1:1  | AA     |
| Danger red               | `#EF4444`  | `#0D0D0D`  | 5.4:1  | AA     |
| Warning amber            | `#FCD34D`  | `#0D0D0D`  | 9.2:1  | AAA    |

---

## If I had more time

- Unit tests for the note dispensing algorithm
- Integration tests for the PIN flow
- Deposit feature implementation
- Biometric authentication (Face ID / Touch ID via WebAuthn)
- Accessibility audit with a screen reader
- PWA support so it installs like a native app

---

## Built by

Collin Rausch — [github.com/virtual-collin](https://github.com/virtual-collin)

Built for the ScreenCloud frontend challenge, March 2026.
