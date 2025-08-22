// Универсальные хелперы для извлечения deviceID и валидации UUID

export function isValidUUID(input) {
  if (!input || typeof input !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input.trim());
}

export function extractDeviceId(input) {
  if (!input) return null;
  const raw = String(input).trim().replace(/^@+/, '');

  const tryMatch = (str) => {
    const m = String(str).match(/(?:^|[?&#])(?:_?deviceID)=([^?#&\s]+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  };

  const getParamCaseInsensitive = (params, targetName) => {
    const target = String(targetName).toLowerCase();
    for (const [key, value] of params.entries()) {
      if (String(key).toLowerCase() === target) return value;
    }
    return null;
  };

  // Если сразу UUID — возвращаем как есть
  if (isValidUUID(raw)) return raw;

  try {
    const url = new URL(raw);
    const params = url.searchParams;

    // Прямые параметры
    const direct =
      getParamCaseInsensitive(params, '_deviceID') ||
      getParamCaseInsensitive(params, 'deviceID') ||
      getParamCaseInsensitive(params, 'device');
    if (direct && isValidUUID(decodeURIComponent(direct))) return decodeURIComponent(direct);

    // Вложенный payload в startapp/start
    const startPayload = getParamCaseInsensitive(params, 'startapp') || getParamCaseInsensitive(params, 'start');
    if (startPayload) {
      const decoded = decodeURIComponent(startPayload);

      // JSON-пейлоад
      if (decoded.startsWith('{') && decoded.endsWith('}')) {
        try {
          const obj = JSON.parse(decoded);
          const val = obj._deviceID || obj.deviceID || obj.device || obj.id;
          if (typeof val === 'string' && isValidUUID(val)) return val;
        } catch (_) {}
      }

      // URL-параметры строкой
      const nestedParams = new URLSearchParams(decoded);
      const nested =
        getParamCaseInsensitive(nestedParams, '_deviceID') ||
        getParamCaseInsensitive(nestedParams, 'deviceID') ||
        getParamCaseInsensitive(nestedParams, 'device');
      if (nested && isValidUUID(decodeURIComponent(nested))) return decodeURIComponent(nested);

      // Регулярка по строке
      const fromNestedRegex = tryMatch(decoded);
      if (fromNestedRegex && isValidUUID(fromNestedRegex)) return fromNestedRegex;
    }

    // Регулярка по всей ссылке
    const fromHref = tryMatch(raw);
    if (fromHref && isValidUUID(fromHref)) return fromHref;
  } catch (_) {
    // Не URL — пробуем регуляркой по тексту
    const fromText = tryMatch(raw);
    if (fromText && isValidUUID(fromText)) return fromText;
  }

  // Вернем как есть — возможно это уже корректный ID или внешний формат.
  return raw;
}


