(function (root) {
  function normalize(value) {
    return value.normalize('NFKC').toLowerCase()
      .replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)))
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();
  }

  function names(stop) {
    return [stop.en, stop.bn, ...stop.aliases].map(normalize);
  }

  function findStops(stops, input, language) {
    const query = normalize(input);
    return Object.values(stops).map((stop) => {
      const candidates = names(stop);
      const score = candidates.includes(query) ? 0
        : candidates.some((name) => name.startsWith(query)) ? 1
        : candidates.some((name) => name.includes(query)) ? 2 : 3;
      return { stop, score };
    }).filter(({ score }) => score < 3)
      .sort((a, b) => a.score - b.score || a.stop[language].localeCompare(b.stop[language], language))
      .map(({ stop }) => stop);
  }

  function resolveStop(stops, input) {
    const query = normalize(input);
    return Object.values(stops).find((stop) => names(stop).includes(query));
  }

  function createPlanner(routes) {
    const directions = routes.flatMap((route) => {
      const variants = route.directions || [route.stops, [...route.stops].reverse()];
      return variants.map((stops) => ({ route, stops }));
    });

    function leg(direction, start, end) {
      return {
        route: direction.route,
        toward: direction.stops.at(-1),
        stops: direction.stops.slice(start, end + 1),
      };
    }

    function plan(from, to) {
      if (from === to) return [];
      const options = [];
      for (const first of directions) {
        const start = first.stops.indexOf(from);
        if (start < 0) continue;
        const finish = first.stops.indexOf(to);
        if (finish > start) {
          options.push([leg(first, start, finish)]);
          continue;
        }
        for (const second of directions) {
          if (second.route.id === first.route.id) continue;
          const end = second.stops.indexOf(to);
          if (end < 1) continue;
          const secondStart = second.stops.indexOf(from);
          if (secondStart >= 0 && secondStart < end) continue;
          for (let i = start + 1; i < first.stops.length; i++) {
            const change = second.stops.indexOf(first.stops[i]);
            if (change < 0 || change >= end) continue;
            const legs = [leg(first, start, i), leg(second, change, end)];
            const firstStops = new Set(legs[0].stops.slice(0, -1));
            if (legs[1].stops.some((stop) => firstStops.has(stop))) continue;
            options.push(legs);
          }
        }
      }
      const segments = (legs) => legs.reduce((sum, item) => sum + item.stops.length - 1, 0);
      options.sort((a, b) => a.length - b.length || segments(a) - segments(b));
      const seen = new Set();
      return options.filter((legs) => {
        const key = legs.map(({ route, toward }) => `${route.id}:${toward}`).join('/');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return plan;
  }

  const planner = { findStops, resolveStop, createPlanner };
  if (typeof module === 'object' && module.exports) module.exports = planner;
  else root.TransitPlanner = planner;
})(globalThis);
