import axios from 'axios';
import useSWR from 'swr';
import { WaitingResponse } from '../../types/waiting';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSpinner } from '../../components/AppSpinner';

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url, { headers: { 'Content-Type': `application/json` } });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export function Turn() {
  const { waitingId } = useParams();
  const navigate = useNavigate();
  const [isMounted, setMounted] = useState(false);
  const { data, isLoading } = useSWR<WaitingResponse>(isMounted ? `/waiting/turn/${waitingId}` : null, fetcher);

  useEffect(() => {
    if (!waitingId || waitingId?.length !== 36) return navigate('/');
    setMounted(true);
  }, [waitingId, navigate]);

  if (isLoading) return <AppSpinner />;

  return (
    <div className="px-4 pt-5 my-5 text-center border-bottom">
      <h1 className="display-4 fw-bold">대기번호 : {data?.waitingNumber}번</h1>
      <div className="col-lg-6 mx-auto">
        <h2 className="lead mb-4">내 앞 대기팀 : {data?.waitingTurn}팀</h2>
      </div>
    </div>
  );
}
