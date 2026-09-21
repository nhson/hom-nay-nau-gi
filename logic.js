// Logic chọn/lọc món ăn thuần tuý — không đụng DOM, không đụng localStorage.
// Đây là seam duy nhất của app cho mục đích test (xem docs/spec-phase1-chay-buatomonuoc-vungmien.md).

const BUACOM_CATEGORIES = ['xao', 'canh', 'man'];

export function filterDishes(dishes, filters = {}) {
  const { mealType, category, chay } = filters;
  return dishes.filter((d) => {
    if (mealType && d.mealType !== mealType) return false;
    if (category && d.category !== category) return false;
    if (chay && !d.chay) return false;
    return true;
  });
}

export function pickRandom(pool, avoidIds = []) {
  if (!pool.length) return null;
  const avoid = new Set(avoidIds);
  const fresh = pool.filter((d) => !avoid.has(d.id));
  const candidates = fresh.length ? fresh : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function buildBuaComMenu(dishes, options = {}) {
  const { chay, avoidIdsByCategory = {} } = options;
  const menu = {};
  for (const category of BUACOM_CATEGORIES) {
    const pool = filterDishes(dishes, { mealType: 'buacom', category, chay });
    menu[category] = pickRandom(pool, avoidIdsByCategory[category] || []);
  }
  return menu;
}

export function pickMonNuoc(dishes, options = {}) {
  const { chay, avoidId } = options;
  const pool = filterDishes(dishes, { mealType: 'buatomonuoc', chay });
  return pickRandom(pool, avoidId ? [avoidId] : []);
}
