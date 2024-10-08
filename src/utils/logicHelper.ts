import { v4 as uuidv4 } from 'uuid';

export const upperCase = /[A-Z]/;
export const lowerCase = /[a-z]/;
export const space = /[ ]/;
export const number = /[0-9]/;
export const specialChar = /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#"']/;

export const copyArray = (array: any) => {
  return JSON.parse(JSON.stringify(array));
};

export const isNumber = (value: string): boolean => {
  return (
    number.test(value) &&
    !upperCase.test(value) &&
    !lowerCase.test(value) &&
    !specialChar.test(value) &&
    !space.test(value)
  );
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
  const filteredFilename = formattedFilename.replaceAll('_', '');
  return filteredFilename;
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

export const transformText = (text: string) => {
  const words = text.split('_');

  const capitalizedWords = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  const result = capitalizedWords.join(' ').replace('Url', 'URL');

  return result;
};

export const generateOrderData = (inputData: any[]) => {
  // Filter hanya LOOPING yang memiliki duplicateId
  const loopingDataWithDuplicate = inputData.filter(
    (item: { fieldType: string; duplicateId: any }) =>
      item.fieldType === 'LOOPING' && item.duplicateId,
  );

  // Inisialisasi orderData
  const orderData: Array<{ id: any; order: any }> = [];

  // Membuat map untuk melacak urutan berdasarkan duplicateId
  const orderMap = new Map();

  // Mengisi orderMap dengan urutan berdasarkan duplicateId
  loopingDataWithDuplicate.forEach((loopingItem: { duplicateId: any; id: any }) => {
    const duplicateId = loopingItem.duplicateId;
    if (duplicateId !== null) {
      if (!orderMap.has(duplicateId)) {
        orderMap.set(duplicateId, 2); // Mengatur urutan awal
      }
      const order = orderMap.get(duplicateId);
      orderData.push({
        id: loopingItem.id,
        order,
      });
      // Increment urutan untuk duplicateId selanjutnya
      orderMap.set(duplicateId, (order as number) + 1);
    }
  });

  // Menambahkan orderData untuk LOOPING yang tidak memiliki duplicateId (order 1)
  const loopingDataWithoutDuplicate = inputData.filter(
    (item: { fieldType: string; duplicateId: any }) =>
      item.fieldType === 'LOOPING' && !item.duplicateId,
  );
  loopingDataWithoutDuplicate.forEach((loopingItem: { id: any }) => {
    orderData.push({
      id: loopingItem.id,
      order: 1, // Urutan 1
    });
  });

  // Mengembalikan orderData yang telah diurutkan
  return orderData.sort((a, b) => a.order - b.order);
};

export const convertContentData = (data: any[]) => {
  const combinedData: any[] = [];

  data.forEach((item: { duplicateId: any; contentData: any[]; fieldType: string }) => {
    if (item.duplicateId) {
      const existingItem = combinedData.find(combinedItem => combinedItem.id === item.duplicateId);

      if (existingItem) {
        item.contentData.forEach(
          (contentItem: { fieldType: any; value: any[]; duplicateId?: number }) => {
            const existingContentItem = existingItem.contentData.find(
              (existingContent: { id: any }) => existingContent.id === contentItem.duplicateId,
            );

            if (existingContentItem) {
              if (!Array.isArray(existingContentItem.value)) {
                existingContentItem.value = [existingContentItem.value];
              }
              existingContentItem.value.push(contentItem.value);
            }
          },
        );
      } else {
        const newItem = { ...item };
        newItem.contentData = newItem.contentData.map((contentItem: { value: any }) => ({
          ...contentItem,
          value: Array.isArray(contentItem.value) ? [...contentItem.value] : [contentItem.value],
        }));
        combinedData.push(newItem);
      }
    } else {
      if (item.fieldType === 'LOOPING') {
        item.contentData.map((detail: { value: any[] }) => {
          detail.value = [detail.value];
          return detail;
        });
      }
      combinedData.push(item);
    }
  });

  return combinedData;
};

const convertFileUploaderValue = (data: any[]) => {
  if (Array.isArray(data)) {
    data.forEach((img: any, idx: number) => {
      const jsonValue = JSON.parse(img);
      if (!jsonValue.length) {
        data[idx] = JSON.stringify([
          {
            imageUrl: 'no-image',
            altText: 'no-image',
          },
        ]);
      }
    });
  }
  return data;
};

export const stringifyContentData = (data: any) => {
  return data.map((field: any) => {
    if (field.fieldType === 'DOCUMENT') {
      const _value = JSON.parse(field.value);
      if (!_value.length) {
        _value.push('-');
        field.value = JSON.stringify(_value);
      }
    } else if (field.fieldType === 'LOOPING' && field.contentData) {
      field.contentData.map((item: { fieldType: any; value: any }) => {
        if (item?.value && Array.isArray(item?.value)) {
          if (item.fieldType === 'IMAGE' || item.fieldType === 'DOCUMENT') {
            item.value = convertFileUploaderValue(item.value);
          }
          item.value = JSON.stringify(item.value);
        }
        return item;
      });
    }
    if (field && field.value === '') {
      field.value = '-';
    }
    return field;
  });
};

export function addNewDataInLoopingField(data: any[], loopingId: number | string) {
  let newLoopingField: any;
  let newAttributeList: any[] = [];

  const existingLoopingIndex: number = data.findIndex(
    (attribute: { id: string }) => attribute.id === loopingId,
  );

  if (existingLoopingIndex !== -1) {
    newLoopingField = {
      ...data[existingLoopingIndex],
      id: uuidv4(),
      duplicateId: data[existingLoopingIndex].duplicateId || loopingId,
      name: `${data[existingLoopingIndex].name}`,
      attributeList: data[existingLoopingIndex].attributeList.map((attribute: any) => ({
        ...attribute,
        id: uuidv4(),
        parentId: loopingId,
        duplicateId: attribute?.duplicateId ?? attribute.id, // used at convertData function to merge values into array
        value: '', // Initialize value to empty
      })),
    };

    newAttributeList = [...data];
    newAttributeList.splice(existingLoopingIndex + 1, 0, newLoopingField);
  }

  return [existingLoopingIndex, newLoopingField, newAttributeList];
}
