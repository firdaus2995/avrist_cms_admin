export const copyArray = (array: any) => {
  return JSON.parse(JSON.stringify(array));
};

export const checkIsEmail = (value: any) => {
  const regex: any = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return value.match(regex);
};

export const formatFilename = (filename: string) => {
  const sanitizedFilename = filename.replace(/[^\w.-]/g, '');
  const lowercaseFilename = sanitizedFilename.toLowerCase();
  const formattedFilename = lowercaseFilename.replace(/\s+/g, '_');
  return formattedFilename;
};
