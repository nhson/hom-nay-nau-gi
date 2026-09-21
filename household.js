// Seam dùng chung cho cả trình duyệt và API serverless — không đụng DOM, không đụng
// network/storage thật. Xem docs/spec-phase2-household-backend.md.

export const CODE_LENGTH = 16;
// Bỏ các ký tự dễ nhầm lẫn khi đọc/gõ tay (0/O, 1/l/I...).
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const CODE_PATTERN = new RegExp('^[' + CODE_ALPHABET + ']{' + CODE_LENGTH + '}$');

export const MAX_PAYLOAD_BYTES = 500 * 1024; // 500KB — đủ rộng cho vài trăm món + lịch sử, chặn lạm dụng

export function generateHouseholdCode() {
  var bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  var out = '';
  for (var i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export function isValidHouseholdCode(code) {
  return typeof code === 'string' && CODE_PATTERN.test(code);
}

export function serializeHouseholdData(state) {
  return {
    version: 1,
    updatedAt: Date.now(),
    dishes: state.dishes,
    history: state.history,
    favorites: state.favorites,
    todayMenu: state.todayMenu,
    shopChecked: state.shopChecked,
    chayFilter: !!state.chayFilter,
  };
}

function safeArray(v) {
  return Array.isArray(v) ? v : null;
}
function safeArrayDefaultEmpty(v) {
  return Array.isArray(v) ? v : [];
}
function safePlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
}

export function parseHouseholdData(raw) {
  var data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = null;
    }
  }
  var safe = safePlainObject(data) || {};
  return {
    dishes: safeArray(safe.dishes),
    history: safeArrayDefaultEmpty(safe.history),
    favorites: safeArrayDefaultEmpty(safe.favorites),
    todayMenu: safePlainObject(safe.todayMenu),
    shopChecked: safePlainObject(safe.shopChecked) || {},
    chayFilter: !!safe.chayFilter,
  };
}

export function isPayloadWithinLimit(jsonString) {
  return typeof jsonString === 'string' && jsonString.length <= MAX_PAYLOAD_BYTES;
}
