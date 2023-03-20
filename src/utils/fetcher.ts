import axios from 'axios';
import { ScopedMutator } from 'swr/_internal';

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url, { headers: { 'Content-Type': `application/json` } });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export const onMessage = (socketMessage: MessageEvent, mutate: ScopedMutator<any>, key: string) => {
  if (socketMessage.data !== 'refresh') return;
  (async () => {
    await mutate(key);
  })();
};
