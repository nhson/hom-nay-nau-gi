import { describe, it, expect } from 'vitest';
import { filterDishes, pickRandom, buildBuaComMenu, pickMonNuoc } from './logic.js';

function dish(overrides) {
  return {
    id: 'd1',
    mealType: 'buacom',
    category: 'xao',
    chay: false,
    region: null,
    name: 'Món test',
    time: 10,
    ingredients: ['a'],
    steps: ['bước 1'],
    ...overrides,
  };
}

describe('filterDishes', () => {
  it('lọc theo mealType', () => {
    const dishes = [
      dish({ id: 'a', mealType: 'buacom' }),
      dish({ id: 'b', mealType: 'buatomonuoc', category: null }),
    ];
    expect(filterDishes(dishes, { mealType: 'buatomonuoc' }).map(d => d.id)).toEqual(['b']);
  });

  it('lọc theo category', () => {
    const dishes = [
      dish({ id: 'a', category: 'xao' }),
      dish({ id: 'b', category: 'canh' }),
    ];
    expect(filterDishes(dishes, { category: 'canh' }).map(d => d.id)).toEqual(['b']);
  });

  it('lọc theo chay khi chay=true', () => {
    const dishes = [
      dish({ id: 'a', chay: true }),
      dish({ id: 'b', chay: false }),
    ];
    expect(filterDishes(dishes, { chay: true }).map(d => d.id)).toEqual(['a']);
  });

  it('không lọc chay khi chay không được truyền / false', () => {
    const dishes = [dish({ id: 'a', chay: true }), dish({ id: 'b', chay: false })];
    expect(filterDishes(dishes, {}).map(d => d.id)).toEqual(['a', 'b']);
    expect(filterDishes(dishes, { chay: false }).map(d => d.id)).toEqual(['a', 'b']);
  });

  it('kết hợp nhiều điều kiện lọc cùng lúc', () => {
    const dishes = [
      dish({ id: 'a', mealType: 'buatomonuoc', category: null, chay: true }),
      dish({ id: 'b', mealType: 'buatomonuoc', category: null, chay: false }),
      dish({ id: 'c', mealType: 'buacom', category: 'xao', chay: true }),
    ];
    expect(filterDishes(dishes, { mealType: 'buatomonuoc', chay: true }).map(d => d.id)).toEqual(['a']);
  });

  it('trả về mảng rỗng khi không có món nào khớp', () => {
    const dishes = [dish({ id: 'a', category: 'xao' })];
    expect(filterDishes(dishes, { category: 'canh' })).toEqual([]);
  });
});

describe('pickRandom', () => {
  it('trả về null khi pool rỗng', () => {
    expect(pickRandom([], [])).toBeNull();
  });

  it('loại các món trong avoidIds khỏi ứng viên', () => {
    const pool = [dish({ id: 'a' }), dish({ id: 'b' }), dish({ id: 'c' })];
    for (let i = 0; i < 20; i++) {
      const picked = pickRandom(pool, ['a', 'b']);
      expect(picked.id).toBe('c');
    }
  });

  it('fallback về toàn bộ pool khi avoidIds loại hết ứng viên', () => {
    const pool = [dish({ id: 'a' }), dish({ id: 'b' })];
    const picked = pickRandom(pool, ['a', 'b']);
    expect(['a', 'b']).toContain(picked.id);
  });

  it('chỉ có 1 món trong pool thì luôn trả về đúng món đó (không avoid)', () => {
    const pool = [dish({ id: 'a' })];
    expect(pickRandom(pool, []).id).toBe('a');
  });
});

describe('buildBuaComMenu', () => {
  it('luôn trả đúng 3 khoá xao/canh/man', () => {
    const dishes = [
      dish({ id: 'x1', category: 'xao' }),
      dish({ id: 'c1', category: 'canh' }),
      dish({ id: 'm1', category: 'man' }),
    ];
    const menu = buildBuaComMenu(dishes, {});
    expect(Object.keys(menu).sort()).toEqual(['canh', 'man', 'xao']);
    expect(menu.xao.id).toBe('x1');
    expect(menu.canh.id).toBe('c1');
    expect(menu.man.id).toBe('m1');
  });

  it('trả null cho nhóm không có món nào khớp bộ lọc', () => {
    const dishes = [
      dish({ id: 'x1', category: 'xao', chay: false }),
      dish({ id: 'c1', category: 'canh', chay: true }),
      dish({ id: 'm1', category: 'man', chay: false }),
    ];
    const menu = buildBuaComMenu(dishes, { chay: true });
    expect(menu.xao).toBeNull();
    expect(menu.canh.id).toBe('c1');
    expect(menu.man).toBeNull();
  });

  it('áp dụng avoidIdsByCategory riêng cho từng nhóm', () => {
    const dishes = [
      dish({ id: 'x1', category: 'xao' }),
      dish({ id: 'x2', category: 'xao' }),
      dish({ id: 'c1', category: 'canh' }),
      dish({ id: 'm1', category: 'man' }),
    ];
    const menu = buildBuaComMenu(dishes, { avoidIdsByCategory: { xao: ['x1'] } });
    expect(menu.xao.id).toBe('x2');
  });

  it('bỏ qua món có mealType buatomonuoc', () => {
    const dishes = [
      dish({ id: 'x1', category: 'xao', mealType: 'buacom' }),
      dish({ id: 'pho1', category: null, mealType: 'buatomonuoc' }),
      dish({ id: 'c1', category: 'canh', mealType: 'buacom' }),
      dish({ id: 'm1', category: 'man', mealType: 'buacom' }),
    ];
    const menu = buildBuaComMenu(dishes, {});
    expect(menu.xao.id).toBe('x1');
  });
});

describe('pickMonNuoc', () => {
  it('trả về null khi không có món buatomonuoc nào', () => {
    const dishes = [dish({ id: 'x1', mealType: 'buacom' })];
    expect(pickMonNuoc(dishes, {})).toBeNull();
  });

  it('chỉ chọn trong món mealType buatomonuoc', () => {
    const dishes = [
      dish({ id: 'x1', mealType: 'buacom' }),
      dish({ id: 'pho1', mealType: 'buatomonuoc', category: null }),
    ];
    expect(pickMonNuoc(dishes, {}).id).toBe('pho1');
  });

  it('áp dụng bộ lọc chay', () => {
    const dishes = [
      dish({ id: 'pho1', mealType: 'buatomonuoc', category: null, chay: false }),
      dish({ id: 'bunchay1', mealType: 'buatomonuoc', category: null, chay: true }),
    ];
    expect(pickMonNuoc(dishes, { chay: true }).id).toBe('bunchay1');
  });

  it('avoidId loại đúng món vừa chọn', () => {
    const dishes = [
      dish({ id: 'pho1', mealType: 'buatomonuoc', category: null }),
      dish({ id: 'bun1', mealType: 'buatomonuoc', category: null }),
    ];
    for (let i = 0; i < 20; i++) {
      expect(pickMonNuoc(dishes, { avoidId: 'pho1' }).id).toBe('bun1');
    }
  });
});
