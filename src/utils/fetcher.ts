import axios from 'axios';

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url, { headers: { 'Content-Type': `application/json` } });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};
