# Feedback — a friend, 2026-08-14

Source: screenshot of a chat conversation. Kept outside this (public) repo — in
`Design Experiments/Portfolio-Feedback/2026-08-14-friend-feedback-1.png` — since it's a third
party's private chat messages, not something to publish. This file has the transcribed text
only, with the person's name left out for the same reason.

## Raw feedback (transcribed)

1. "First I love the site has maintained your identity. Claude code hasn't overly changed it. It's still authentically you."
2. "Next, I would suggest you to add more portfolios (I believe you worked on Gadaha too) even though it's not a launched app, having those assets up can influence someone to pick interest in you to design their tech product design system. You worked on Ingwe before that. Add it too. Key Advice: DON'T BE SHY TO SHOW YOUR WORK."
3. "On the foreign artwork + portfolio I love that you added the audio mack link to listen to his music/the specific track. If it's possible I would suggest you to add a small/little backstory to how you arrived at the design or your thought process in designing it — this stands out to most people who are hiring or looking for designers."
4. "The contact page still shows your located at the Nile House (lol). I don't know if it's intentional but if it isn't then please update it. The sunrise time + true north and the current time etc."
5. "On the handWing portfolio/case study I noticed the videos swipe or rather automatically move on their own even when I am still playing them and listening to them. I don't know if it's intentional but it would be nice to give the user some control over that auto-scroll/swipe behavior."

## Status against current site (checked 2026-08-14)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Identity maintained | ✅ N/A (compliment) | No action needed. |
| 2 | Add Gadaha / Ingwe as portfolio pieces | ❌ Not done | No mention of either in `Portfolio.html` or `DESIGN.md`. No assets for these currently in `Images/`. Needs source assets + description from Tafadzwa before they can be added (see content-honesty rule — don't fabricate). |
| 3 | Add backstory/thought-process to FRGHN Music (foreign artwork) | ❌ Not done | `FRGHN-Music.html` has only a one-line description and a `[Add project goals]` placeholder — no design-process narrative. Needs real input from Tafadzwa on how the two cover concepts came about. |
| 4 | Contact page still says "Nile House" | ❌ Not done | Confirmed still present verbatim: `Contact.html:91` — `Cairo 1, Nile House, <br>`. Sunrise/true-north/current-time widgets are already live and working; only the address line is stale. |
| 5 | HandWing slider auto-advances over a playing video | ✅ Fixed 2026-08-14 | `Slider.js` now tracks `play`/`pause`/`ended` on every `<video>` in the slider and stops the auto-advance timer while any video is playing, independent of mouse hover. Verified locally: 0 auto-advance attempts while a video's `play` event is active, resumes within one interval after `pause`; existing hover-pause behavior unaffected (regression-checked). |

## Open items for Tafadzwa
- Confirm whether Gadaha/Ingwe should be added, and provide real project assets/description if so.
- Provide the actual thought-process/backstory for the FRGHN Music (Madube) cover concepts.
- Confirm the real current location to replace "Nile House" on the Contact page.
