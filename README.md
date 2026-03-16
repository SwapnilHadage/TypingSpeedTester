<div align="center">
  <img src="assets/logo.svg" width="100" alt="KIVO Logo">
  <h1 align="center">KIVO Typing Speed Test</h1>
</div>
<p align="center">
A browser-based typing speed test built with HTML, CSS, and JavaScript.
</p>

---

## Quick start

1. Clone or download the project folder.
2. Open `index.html` in a modern browser (no server required).
3. Select difficulty and duration, then click the typing area and start typing.

---

## What this app contains

- Difficulty modes: `Easy`, `Moderate`, `Hard`. Each mode selects a random sentence from `data.js`.
- Time modes: `30s`, `60s`, `120s`, and **Free Style** (no countdown; timer shows elapsed seconds and the test ends when the full sentence is typed).
- Real-time per-character correctness highlighting (green for correct, red for incorrect).
- A custom blinking cursor positioned relative to the current character.
- Automatic scroll to keep the active line visible.
- Results panel that shows **Speed (WPM)** and **Accuracy (%)** when the test ends.

---

## Files

```
project/
│ 
├── index.html        # App HTML structure and controls
├── style.css         # Application styling and responsive rules           
├── scripts/
│    ├── data.js      # `randomSentences` export used as sentence data
│    └── logic.js     # Main app logic (ES module) 
└── assets/
     └── logo.svg
```

> `data.js` exports a named object `randomSentences` with keys `easy`, `moderate`, and `hard`.

---

## Relevant DOM IDs / Classes (for quick customization)

- `.typeArea` — main visible typing container (sentence rendered as `<span>`s inside `<div>` rows).
- `#hidden-input` — invisible `<textarea>` used to receive keyboard input.
- `#mode` — `<select>` to choose difficulty (`easy`, `moderate`, `hard`).
- Buttons with classes/ids:
  - `#b1` — 30s button (default selected)
  - `#b2` — 60s button
  - `#b3` — 120s button
  - `#b4` — Free Style button
  - `#reset` — Reset button
- `.btns` — all time-select buttons collection
- `.result` — result panel container
- `#speed` — element that receives Speed (WPM) text
- `#acc` — element that receives Accuracy text

---

## Core behavior / flow

1. On load (or when `setInitialState()` runs), a random sentence is selected from `data.js` based on the chosen difficulty mode and rendered into `.typeArea` as a sequence of `<span>` elements. Spaces are rendered as `\u00A0` (non-breaking space).
2. The user focuses the typing area by clicking it (or programmatically via `.focus()` on the hidden textarea).
3. On the **first keystroke**, the timer starts.
   - For timed modes (30/60/120), the app counts down and ends when time reaches zero or when the full sentence is typed.
   - For Free Style, the app shows elapsed time and ends only when the full sentence is typed.
4. Each typed character is compared to the corresponding character in the sentence. The matching `<span>` gets `.correct` or `.incorrect` class applied.
5. A custom cursor `<span class="cursor">` is moved to visually indicate the current character position.
6. When the test ends, the app disables input and shows the `.result` panel with calculated WPM and accuracy values.

---

## Calculations

- **Word counting**: incremented when the user types a character that corresponds to a space in the sentence. The code also increments words once more if the sentence ends with a space and the entire sentence was typed.

- **WPM (words per minute)**: `WPM = (words * 60) / time_in_seconds`.

- **Accuracy (%)**: `Accuracy = (correct_characters * 100) / total_characters_in_sentence`.

These formulas are implemented exactly as above in the `logic.js` result routine.

---

## Notes and known limitations (accurate)

- **Backspace handling**: The current implementation marks characters `.correct` or `.incorrect` when typed but does not remove those classes or decrement `correctLetterCount` when the user presses backspace. In short, backspace correction is not fully reflected in the accuracy calculation.

- **Accuracy numerator/denominator**: Accuracy uses the total sentence length (`sentence.length`) as the denominator even when time runs out before the sentence is fully typed. This means if the test ends early, typed characters are measured against the full sentence length.

- **Word counting edge cases**: Words are counted when a space in the target sentence is crossed while typing. If the final character of the sentence is a space and the user completes the sentence, an additional word increment occurs.

- **Input visibility**: The text the user types is captured in the hidden textarea (`#hidden-input`) and not displayed directly; visual feedback is driven entirely by the rendered `<span>` elements.

- **Single-user**: This app is a local, single-player front-end only. There is no persistence (no leaderboard, no backend) in the current code.

---

## Accessibility & UX considerations

- The focus is intentionally moved to the hidden textarea. If you modify the CSS for `#hidden-input`, ensure it remains focusable and able to receive keyboard events.
- The custom cursor is absolutely positioned and animated. For improved accessibility, consider providing a visible caret and ARIA announcements for screen reader users.
- Accessibility measures are addded using **aria** attributes
---

## How to modify sentences

Edit `data.js`. Replace or extend the arrays in `randomSentences.easy`, `randomSentences.moderate`, and `randomSentences.hard`. Each array item is a string used as a single typing prompt.

---

## Possible improvements (non-exhaustive)

- Implement correct handling for backspace and recompute accuracy on edits.
- Track per-character timing to compute more nuanced metrics (e.g., per-character latency, error heatmap).
- Add persistence / leaderboard via a lightweight backend or localStorage.
- Add configuration for different WPM calculation methods (e.g., using characters instead of word counts).
- Add keyboard layout detection or guidance for non-US layouts.

---

## License

This repository is provided for educational and practice purposes. No license is specified.
