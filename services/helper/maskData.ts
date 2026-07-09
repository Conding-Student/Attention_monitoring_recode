// src/utils/maskData.ts

type MaskOptions = {
  startVisible?: number;
  endVisible?: number;
  maskChar?: string;
};

export function maskData(value: string, options: MaskOptions = {}): string {
  if (!value) return "";

  const { startVisible = 2, endVisible = 0, maskChar = "*" } = options;

  const length = value.length;

  if (length <= startVisible + endVisible) {
    return maskChar.repeat(length);
  }

  const start = value.slice(0, startVisible);
  const end = endVisible ? value.slice(-endVisible) : "";

  const maskedLength = length - startVisible - endVisible;

  return start + maskChar.repeat(maskedLength) + end;
}

/* ---------------------------
   PRESET HELPERS
----------------------------*/

export function maskEmail(value: string): string {
  if (!value || !value.includes("@")) return maskData(value);

  const [name, domain] = value.split("@");

  return `${maskData(name, { startVisible: 2 })}@${domain}`;
}

export function maskPhone(value: string): string {
  return maskData(value, { startVisible: 2, endVisible: 2 });
}

export function maskName(value: string): string {
  return maskData(value, { startVisible: 1 });
}
