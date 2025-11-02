import { validatePodolskAddress, formatAddressForDisplay } from './addressValidator.ts';

Deno.test("validatePodolskAddress - should return true for valid Podolsk address", () => {
  const validAddress = {
    value: 'г Подольск, ул Ленина',
    unrestricted_value: 'г Подольск, ул Ленина',
    data: {
      city: 'Подольск',
      street: 'ул Ленина',
      geo_lat: '55.4239',
      geo_lon: '37.5545'
    }
  };

  if (!validatePodolskAddress(validAddress)) {
    throw new Error("Should validate Podolsk address");
  }
});

Deno.test("validatePodolskAddress - should return false for non-Podolsk address", () => {
  const invalidAddress = {
    value: 'г Москва, ул Ленина',
    unrestricted_value: 'г Москва, ул Ленина',
    data: {
      city: 'Москва',
      street: 'ул Ленина'
    }
  };

  if (validatePodolskAddress(invalidAddress)) {
    throw new Error("Should not validate non-Podolsk address");
  }
});

Deno.test("validatePodolskAddress - should return false for null address", () => {
  if (validatePodolskAddress(null)) {
    throw new Error("Should not validate null address");
  }
});

Deno.test("formatAddressForDisplay - should return address value", () => {
  const address = {
    value: 'г Подольск, ул Ленина',
    unrestricted_value: 'г Подольск, ул Ленина',
    data: { city: 'Подольск' }
  };

  const result = formatAddressForDisplay(address);
  if (result !== 'г Подольск, ул Ленина') {
    throw new Error(`Expected 'г Подольск, ул Ленина', got '${result}'`);
  }
});
