# Meal Flow

**Meal Flow** is a small personal PWA for keeping a simple eating rhythm during focused workdays.

The goal is not to build a heavy diet tracker. The goal is to reduce random snacking, keep meal timing visible, and make the next healthy action obvious.

---

## Product idea

Meal Flow is designed for people who spend a lot of time at the computer and easily lose track of time.

Instead of calorie counting, complex analytics, recipes, social features, or gamification, the app focuses on one clear question:

> What is the next planned eating moment, and how long until it starts?

The interface should feel calm, readable, and light: no heavy shadows, no aggressive gradients, no visual noise.

---

## Current functionality

### Main timer screen

The main screen shows:

- greeting
- short motivational subtitle
- next meal name
- next meal time
- countdown timer
- circular progress indicator
- primary action button
- snack guidance card

The app calculates the next scheduled event based on the current local time.

Scheduled events can be:

- meal
- custom snack time

The countdown updates every second.

When the last event of the day has passed, the app automatically switches to the first event of the next day.

---

### Next meal block

Example:

```txt
Next meal
Lunch
Today at 14:00
```

Expected behavior:

- If current time is 10:00 and lunch is at 14:00, it shows Lunch.
- If current time is 20:00 and breakfast is next day at 09:00, it shows Breakfast tomorrow.
- If custom snack mode is enabled and snack time is closer than the next meal, it shows Snack.

---

### Countdown timer

Displays time remaining in this format:

```txt
HH:MM:SS
```

The timer counts down to the next scheduled event.

It should be easy to read from a distance and should not require user interpretation.

---

### Circular progress indicator

The circular ring shows progress through the current eating interval.

Example:

```txt
Breakfast 09:00 → Lunch 14:00
```

If it is 11:30, the ring should show roughly 50% progress.

The ring is visual support only. The countdown remains the primary information.

---

### “I ate” button

Primary action button:

```txt
I ate
```

For snack events:

```txt
Snack done
```

Current behavior:

1. The current next meal/snack is marked visually as completed.
2. The app briefly shows a success message.
3. The app returns to the normal timer state.

Current implementation does **not** permanently store meal history yet.

Future behavior:

- store completion time
- build daily history
- show streaks or consistency stats
- optionally hide the completed meal until the next event

---

### “Skip meal” button

Secondary action:

```txt
Skip meal
```

Current behavior:

1. The app briefly shows that the current event was skipped.
2. The timer continues to calculate the next scheduled event.

Current implementation does **not** permanently store skipped meals yet.

Future behavior:

- save skipped status
- show skipped meals in history
- help detect problematic eating patterns

---

### Hydrate card

Small card in the top-right area:

```txt
Hydrate
0 / 6
```

Current behavior:

- click increases water count by 1
- after reaching 6, clicking again resets it to 0
- water count is stored in localStorage

Future behavior:

- reset automatically every day
- allow setting a custom daily target
- optionally send hydration reminders

---

### Snack guidance card

Example:

```txt
Vegetables are okay
Water, tea, cucumber, tomato or pepper.
```

The text changes based on snack mode:

| Snack mode | User guidance |
|---|---|
| No snacks | Water, tea or coffee are okay |
| Vegetables only | Water, tea, cucumber, tomato or pepper |
| Custom snack time | Wait for the scheduled snack time |
| Snack event is next | Snack window is coming |

The purpose is to remove decision fatigue.

The user should not have to think:

> Can I eat something now?

The app should answer that immediately.

---

## Settings panel

The right-side panel controls the eating rhythm.

On desktop it is always visible. On mobile it opens from the bottom navigation Settings button.

---

### Schedule list

Default meals:

```txt
Breakfast — 09:00
Lunch — 14:00
Dinner — 19:00
```

Each meal has:

- icon badge
- editable name
- editable time
- remove button

Expected behavior:

- changing meal name or time updates the timer immediately
- schedule changes are saved in localStorage

---

### Add meal

Button:

```txt
+ Add meal
```

Expected behavior:

1. A new meal is added.
2. Default name is `Meal`.
3. Default time is `12:00`.
4. The schedule is automatically sorted by time.
5. Timer recalculates the next event.

Future behavior:

- open a small modal or inline form instead of instantly adding a default meal

---

### Remove meal

Button:

```txt
×
```

Expected behavior:

- removes selected meal
- saves updated schedule
- recalculates timer
- keeps at least one meal in the schedule

---

### Snack mode

Available modes:

```txt
No snacks
Vegetables only
Custom snack time
```

#### No snacks

The app discourages all food between meals.

Guidance:

```txt
Water, tea or coffee are okay.
```

#### Vegetables only

The app allows low-calorie vegetable snacks.

Guidance:

```txt
Water, tea, cucumber, tomato or pepper.
```

#### Custom snack time

The app adds one planned snack event to the daily schedule.

Example:

```txt
Snack — 16:30
```

If snack time is closer than the next meal, the timer counts down to snack.

---

### Custom snack time field

Visible only when snack mode is:

```txt
Custom snack time
```

Expected behavior:

- changing the snack time saves it to localStorage
- daily schedule is updated
- timer is recalculated

---

### Reminders toggle

Toggle:

```txt
Reminders
Browser notifications before meals
```

Current behavior:

- asks browser notification permission if needed
- saves preference

Actual scheduled notifications are **not fully implemented yet**.

Future behavior:

- notify before meals
- allow choosing reminder offset: 5, 10, or 15 minutes before
- work better through service worker notifications

---

### Sound toggle

Toggle:

```txt
Sound
Soft sound on notifications
```

Current behavior:

- saves preference

Actual sound playback is **not fully implemented yet**.

Future behavior:

- play a soft notification sound
- respect user preference
- avoid annoying repeated sounds

---

## Navigation

### Desktop

Left sidebar currently contains:

```txt
Timer
History
Nutrition
Profile
Settings
```

Only Timer and Settings-related behavior are active now.

Other items are visual placeholders for future sections.

### Mobile

On mobile, the sidebar becomes a bottom navigation bar.

The Settings button opens/closes the settings panel.

Expected behavior:

- tap Settings → open settings panel
- press Escape on desktop → close settings panel
- future improvement: tap outside panel → close settings panel

---

## Data storage

The app currently uses:

```txt
localStorage
```

Stored data includes:

- meal schedule
- snack mode
- custom snack time
- water count
- reminders preference
- sound preference

No server is used. No account is required. No user data leaves the device.

---

## PWA support

The app includes:

- `manifest.json`
- app icons
- `service-worker.js`
- offline cache

This allows the app to be installed on a phone home screen.

Android:

```txt
Chrome → Install app
```

iPhone:

```txt
Safari → Share → Add to Home Screen
```

---

## UX principles

### 1. One main action per screen

The main action is:

```txt
I ate
```

Everything else should be secondary.

### 2. Calm visual style

Avoid:

- heavy shadows
- aggressive gradients
- acidic colors
- too many cards
- unnecessary animations
- complex dashboards

Use:

- soft background
- clear typography
- rounded but not childish shapes
- enough whitespace
- low-contrast borders
- calm green accent

### 3. Readability first

The app should be usable by anyone, including an elderly person.

This means:

- large timer
- clear labels
- simple wording
- obvious buttons
- no hidden critical actions

### 4. No diet pressure

The app should not shame the user.

Avoid messages like:

```txt
You failed
Bad choice
You broke your diet
```

Use calm language:

```txt
Return to focus.
Stay with the plan.
Next meal is coming.
```

---

## What is already done

- Modern app-like visual redesign
- Desktop layout
- Mobile layout
- Main countdown logic
- Meal schedule editing
- Add/remove meals
- Snack mode selection
- Custom snack time
- Hydration counter
- PWA manifest
- App icons
- Service worker
- localStorage persistence

---

## What still needs to be done

### High priority

- Improve mobile settings panel close behavior
- Add daily reset for water count
- Add real meal history
- Store `I ate` and `Skip meal` actions
- Show today’s completed/skipped meals
- Improve PWA caching strategy after updates

### Medium priority

- Add reminder notifications
- Add reminder offset setting
- Add soft sound notification
- Add vibration on mobile
- Add “reset schedule” button
- Add better custom meal creation flow
- Add empty/error states

### Low priority

- History screen
- Nutrition screen
- Profile screen
- Weekly rhythm analytics
- Streaks
- Light/dark theme switch
- Export/import settings
- Multiple routines, for example weekday/weekend

---

## Suggested next development steps

### Step 1 — Add persistent daily history

Data structure example:

```js
{
  "2026-05-08": [
    {
      "type": "meal",
      "name": "Breakfast",
      "plannedTime": "09:00",
      "action": "completed",
      "actualTime": "09:12"
    }
  ]
}
```

### Step 2 — Add daily reset logic

Reset daily:

- water count
- temporary completed state
- daily snack/meal log state

### Step 3 — Implement notifications

Basic notification logic:

- calculate next meal
- notify 10 minutes before
- do not spam
- respect browser permissions

### Step 4 — Make mobile UX smoother

Needed improvements:

- close settings by tapping outside
- add visible close button in settings panel
- improve bottom nav active state
- prevent background scrolling when settings is open

---

## Repository structure

```txt
meal-flow/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Commit suggestion

```bash
git add README.md
git commit -m "Add product README for Meal Flow"
git push
```
