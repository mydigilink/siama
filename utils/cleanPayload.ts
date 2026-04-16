// utils/cleanPayload.ts
export const cleanPayload = (data: any) => {
  const cleaned: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === "" || value === null || value === undefined) return;
    if (Array.isArray(value) && value.length === 0) return;

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) return;

    cleaned[key] = value;
  });

  return cleaned;
};