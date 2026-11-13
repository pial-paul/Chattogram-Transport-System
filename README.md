# Chattala Transit

A Bangla and English bus guide for Chattogram. Choose two landmarks to see where to board, which direction to take, where to get off, and where to change buses when a direct ride is unavailable.

## Run locally

Open `index.html` directly to use the planner. For a preview of the production files, run `npm start` from the project folder and visit <http://127.0.0.1:8784/>. The preview command uses Node.js and Python 3. Offline reload and trip links work on localhost or an HTTPS host. Offline reload requires a successful first visit. The app needs no account, API key, or package installation.

Run `npm test` to check stop aliases, route references, trip direction, and transfers.

## What changed

The original demo showed simulated buses, whole-route fares, and travel times. Its local search treated any two exact stop names on the same route as a match. This version uses sourced, ordered landmarks and returns up to five itineraries with at most one change. It ranks by fewer changes and then fewer listed landmark intervals, which are a rough proxy for route length. The diagram shows route connections and approximate relative positions. Each trip leg links to its route source. Riders can save up to six trips on their device and reopen them offline after the app has loaded successfully over HTTPS or localhost.

The seven-route starter dataset lives in `transit-data.js`. Route 3 uses landmarks documented in [September 2026 field reporting](https://storage.googleapis.com/qurium/ctgpratidin.com/%E0%A6%9A%E0%A6%9F%E0%A7%8D%E0%A6%9F%E0%A6%97%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A7%87-%E0%A6%AD%E0%A6%BE%E0%A7%9C%E0%A6%BE-%E0%A6%A8%E0%A6%BF%E0%A7%9F%E0%A7%87-%E0%A6%A6.html). Other entries use ordered landmarks from the [published bus guide](https://en.wikivoyage.org/wiki/Chittagong#By_bus), with corridor context from §8.5.1 of the [transport study](https://documents1.worldbank.org/curated/en/650711551757596693/pdf/Deliverable-2-Pre-Feasibility-BRT-final.pdf). Where those sources disagree about endpoints, the app uses the endpoints in the source for the ordered landmarks. Routes default to reverse-order service in the other direction pending field checks. An entry can specify ordered `directions` for known one-way patterns or different stops on the return trip.

Current operation, boarding sides, and stop-to-stop fares still need field verification. The app links to the government diesel fare notice and flags route uncertainty. Confirm the direction and fare with the conductor before boarding. Correction submissions open a prefilled GitHub issue for the rider to review and submit.

## Pilot plan

1. Ride Route 6 in both directions and test an Oxygen–Agrabad transfer. Record the bus sign, actual terminal, pickup side, landmark order, observation date, and charged fare for each leg.
2. Review the records with local riders and operators. Update route data with the observation date and evidence, and track disagreement between reports before changing the guide.
3. Publish a pilot link and ask riders whether the instructions got them onto the right bus and through their transfer. Track the share of successful trips and time to correct a report. Expand coverage as routes are checked. Add live arrivals when an operator can supply reliable vehicle data.

## Project history

The [original demo video](https://github.com/user-attachments/assets/a680f999-1f9f-4272-8a21-8b89d1a85c79) shows the earlier prototype. On the same website, supported origin and destination pairs from its bookmarks carry over into Saved trips.

Run `npm run build` to collect the six production files in `dist/`. Publish that folder on an HTTPS static host such as GitHub Pages. Increment the cache version in `sw.js` whenever the cached application or route data changes.
