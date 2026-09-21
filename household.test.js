import { describe, it, expect } from 'vitest';
import {
  generateHouseholdCode,
  isValidHouseholdCode,
  serializeHouseholdData,
  parseHouseholdData,
  isPayloadWithinLimit,
  MAX_PAYLOAD_BYTES,
} from './household.js';

describe('generateHouseholdCode', () => {
  it('sinh mã có độ dài cố định, chỉ gồm ký tự chữ/số dễ đọc', () => {
    const code = generateHouseholdCode();
    expect(code).toMatch(/^[A-Za-z0-9]{16}$/);
  });

  it('mỗi lần sinh cho mã khác nhau (xác suất trùng gần như bằng 0)', () => {
    const codes = new Set();
    for (let i = 0; i < 200; i++) codes.add(generateHouseholdCode());
    expect(codes.size).toBe(200);
  });
});

describe('isValidHouseholdCode', () => {
  it('chấp nhận mã do generateHouseholdCode sinh ra', () => {
    expect(isValidHouseholdCode(generateHouseholdCode())).toBe(true);
  });

  it('từ chối mã sai độ dài', () => {
    expect(isValidHouseholdCode('abc')).toBe(false);
    expect(isValidHouseholdCode('a'.repeat(100))).toBe(false);
  });

  it('từ chối mã chứa ký tự không hợp lệ (khoảng trắng, ký tự đặc biệt)', () => {
    expect(isValidHouseholdCode('abcd efgh ijkl mnop')).toBe(false);
    expect(isValidHouseholdCode('../../etc/passwd12')).toBe(false);
  });

  it('từ chối giá trị không phải chuỗi', () => {
    expect(isValidHouseholdCode(null)).toBe(false);
    expect(isValidHouseholdCode(undefined)).toBe(false);
    expect(isValidHouseholdCode(12345)).toBe(false);
    expect(isValidHouseholdCode({})).toBe(false);
  });
});

describe('serializeHouseholdData / parseHouseholdData', () => {
  const sampleState = {
    dishes: [{ id: 'x1', name: 'Rau muống xào tỏi' }],
    history: [{ date: '2026-09-21', dishIds: ['x1'] }],
    favorites: [{ id: 'f1', name: 'Mâm cơm thứ Hai' }],
    todayMenu: { dishIds: ['x1'], date: '2026-09-21', mealType: 'buacom' },
    shopChecked: { 'rau muống': true },
    chayFilter: true,
  };

  it('serialize rồi parse lại cho đúng dữ liệu ban đầu', () => {
    const payload = serializeHouseholdData(sampleState);
    const parsed = parseHouseholdData(payload);
    expect(parsed.dishes).toEqual(sampleState.dishes);
    expect(parsed.history).toEqual(sampleState.history);
    expect(parsed.favorites).toEqual(sampleState.favorites);
    expect(parsed.todayMenu).toEqual(sampleState.todayMenu);
    expect(parsed.shopChecked).toEqual(sampleState.shopChecked);
    expect(parsed.chayFilter).toBe(true);
  });

  it('payload có version và updatedAt', () => {
    const payload = serializeHouseholdData(sampleState);
    expect(payload.version).toBe(1);
    expect(typeof payload.updatedAt).toBe('number');
  });

  it('parse dữ liệu rỗng/null trả về giá trị mặc định an toàn, không throw', () => {
    const parsed = parseHouseholdData(null);
    expect(parsed.dishes).toBeNull();
    expect(parsed.history).toEqual([]);
    expect(parsed.favorites).toEqual([]);
    expect(parsed.todayMenu).toBeNull();
    expect(parsed.shopChecked).toEqual({});
    expect(parsed.chayFilter).toBe(false);
  });

  it('parse dữ liệu hỏng (sai kiểu field) trả về giá trị mặc định an toàn thay vì giữ nguyên rác', () => {
    const parsed = parseHouseholdData({ dishes: 'not-an-array', history: 123, shopChecked: [] });
    expect(parsed.dishes).toBeNull();
    expect(parsed.history).toEqual([]);
    expect(parsed.shopChecked).toEqual({});
  });

  it('parse chấp nhận cả chuỗi JSON lẫn object đã parse sẵn', () => {
    const payload = serializeHouseholdData(sampleState);
    const parsedFromString = parseHouseholdData(JSON.stringify(payload));
    const parsedFromObject = parseHouseholdData(payload);
    expect(parsedFromString).toEqual(parsedFromObject);
  });

  it('parse chuỗi JSON không hợp lệ (lỗi cú pháp) trả về mặc định an toàn, không throw', () => {
    expect(() => parseHouseholdData('{not valid json')).not.toThrow();
    const parsed = parseHouseholdData('{not valid json');
    expect(parsed.dishes).toBeNull();
  });
});

describe('isPayloadWithinLimit', () => {
  it('chấp nhận payload nhỏ', () => {
    expect(isPayloadWithinLimit(JSON.stringify({ a: 1 }))).toBe(true);
  });

  it('từ chối payload vượt giới hạn kích thước', () => {
    const huge = JSON.stringify({ blob: 'x'.repeat(MAX_PAYLOAD_BYTES + 1) });
    expect(isPayloadWithinLimit(huge)).toBe(false);
  });
});
