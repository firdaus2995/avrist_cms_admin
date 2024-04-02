export const copyArray = (array: any) => {
  return JSON.parse(JSON.stringify(array));
};

export const checkIsEmail = (value: any) => {
  const regex: any =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(value);
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

export const errorMessageTypeConverter = (errorMessage: any, messageConverter?: boolean) => {
  const knownError: string[] = [
    'ConflictException',
    'DataHasBeenExistException',
    'DataIsUsedException',
    'UnableToChangeOwnUserStatusException',
    'UnauthorizedException',
  ];
  const splittedErrorMessage: string[] = errorMessage.split(':');

  const type: string = splittedErrorMessage[0];
  const convertedType: string =
    type[type.length - 1] === ' ' ? type.substring(0, type.length - 1) : type;

  if (knownError.find((element: string) => element === convertedType)) {
    if (messageConverter) {
      const message: string = splittedErrorMessage[1];
      const convertedMessage: string =
        message[0] === ' ' ? message.substring(1, message.length) : message;
      return `${convertedType}.${convertedMessage}`;
    } else {
      return `${convertedType}`;
    }
  } else {
    return 'UnexpectedErrorException';
  }
};

export const safeParseJSON = (jsonString: any) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return [];
  }
};

export const getImageData = (value: any) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const parsedValue = safeParseJSON(value);
  try {
    if (parsedValue) {
      return `${baseUrl}/files/get/${parsedValue[0]?.imageUrl}`;
    } else {
      return `${baseUrl}/files/get/${value}`;
    }
  } catch {
    return '';
  }
};
