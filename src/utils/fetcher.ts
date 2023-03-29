import axios from 'axios';

export const getFetcher = async (url: string) => {
  try {
    const res = await axios.get(url, { headers: { 'Content-Type': `application/json` } });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export const postFetcher = async (url: string, { arg }: { arg: any }) => {
  const bodyData = JSON.stringify(arg);

  try {
    const res = await axios.post(url, bodyData, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export const postArgsFetcher = async (url: string, { arg }: { arg: string }) => {
  try {
    const res = await axios.post(url + arg, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export const deleteFetcher = async (url: string) => {
  try {
    const res = await axios.delete(url, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export const deleteArgsFetcher = async (url: string, { arg }: { arg: string }) => {
  try {
    const res = await axios.delete(url + arg, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};
