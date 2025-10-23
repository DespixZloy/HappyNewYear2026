export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 0) return '';

  if (cleaned[0] === '7' || cleaned[0] === '8') {
    const digits = cleaned.substring(1);

    if (digits.length <= 3) {
      return `+7 (${digits}`;
    } else if (digits.length <= 6) {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }
  } else {
    if (cleaned.length <= 3) {
      return `+7 (${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 8) {
      return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
      return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
    }
  }
};

export const getCleanedPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned[0] === '8') {
    return '7' + cleaned.substring(1);
  }
  if (cleaned[0] !== '7' && cleaned.length === 10) {
    return '7' + cleaned;
  }
  return cleaned;
};
