import { getCredential } from '@/utils/Credential';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const getImageOld = async (img: any) => {
  try {
    const token = getCredential().accessToken;
    const response = await fetch(`${baseUrl}/files/get/${img}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      if (blob.size > 0) {
        const objectUrl = URL.createObjectURL(blob);
        return objectUrl;
      }
    } else {
      console.error('Image fetch failed with status code: ', response.status);
    }
  } catch (err) {
    console.error('Error fetching image:', err);
  }

  return '';
};

export const getImage = async (img: any, single = false) => {
  try {
    const token = getCredential().accessToken;
    const response = await fetch(`${baseUrl}/files/get/${img}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const contentLengthHeader = response.headers.get('content-length');
      const fileSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      const imageName: string = img
        .replace('images/', '')
        .replace('.jpg', '')
        .replace('.jpeg', '')
        .replace('.png', '')
        .replace('.pdf', '');

      if (fileSize > 0) {
        const objectUrl = URL.createObjectURL(blob);
        if (single) {
          return objectUrl;
        }
        return { objectUrl, fileSize, imageName };
      }
    }
  } catch (err) {
    console.error(err);
  }

  return '';
};

export const getImageEditable = async (img: any, single = false) => {
  try {
    const token = getCredential().accessToken;
    const response = await fetch(`${baseUrl}/files/get/${img}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const contentLengthHeader = response.headers.get('content-length');
      const fileSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      const imageName: string = img
        .replace('images/', '')
        .replace('.jpg', '')
        .replace('.jpeg', '')
        .replace('.png', '')
        .replace('.pdf', '');

      if (fileSize > 0) {
        const objectUrl = URL.createObjectURL(blob);
        if (single) {
          return objectUrl;
        }
        return { name: imageName, response: img, value: blob };
      }
    }
  } catch (err) {
    console.error(err);
  }

  return '';
};

export const getImageAxios = async (img: any) => {
  try {
    const token = getCredential().refreshToken;
    const imageUrl = `${baseUrl}/files/get/${img}`;

    const response: any = await axios.get(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fileSize = response?.headers?.['content-length'];
    const imageName: string = img
      .replace('images/', '')
      .replace('.jpg', '')
      .replace('.jpeg', '')
      .replace('.png', '')
      .replace('.pdf', '');

    return {
      url: imageUrl,
      fileSize,
      imageName,
    };
  } catch (err) {
    console.error(err);
  }

  return false;
};
