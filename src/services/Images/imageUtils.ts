import { getCredential } from '@/utils/Credential';

const baseUrl = import.meta.env.VITE_API_URL;

export const getImage = async (img: any) => {
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
    }
  } catch (err) {
    console.error(err);
  }

  return '';
};
