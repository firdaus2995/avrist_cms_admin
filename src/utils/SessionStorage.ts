export const storeDataStorage = (key: string, value: any) => {
  const jsonValue = JSON.stringify(value);
  sessionStorage.setItem(key, jsonValue);
};

export const getDataStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (value) return JSON.parse(value);
};
