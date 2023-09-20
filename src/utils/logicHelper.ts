export const copyArray = (array: any) => {
  return JSON.parse(JSON.stringify(array));
};

export const checkIsEmail = (value: any) => {
  const regex: any = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return value.match(regex);
};

export const checkIsNotEmpty = (value: any) => {
  return !!value;
};

export const formatFilename = (filename: string) => {
  const sanitizedFilename = filename.replace(/[^\w.-]/g, '');
  const lowercaseFilename = sanitizedFilename.toLowerCase();
  const formattedFilename = lowercaseFilename.replace(/\s+/g, '_');
  return formattedFilename;
};

export const errorMessageTypeConverter = (errorMessage: any) => {
  const type: string = errorMessage.substring(0, errorMessage.indexOf(":"));
  if (type[type.length - 1] === " ") {
    return type.substring(0, (type.length - 1));
  } else {
    return type;
  };
};
