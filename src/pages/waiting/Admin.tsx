import useSWR from 'swr';
import { WaitingResponse } from '../../types/waiting';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AppSpinner } from '../../components/AppSpinner';
import useSWRMutation from 'swr/mutation';
import { fetcher } from '../../utils/fetcher';

const deleteFetcher = async (url: string, { arg }: { arg: string }) => {
  try {
    const res = await axios.delete(url + arg, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

const noticeFetcher = async (url: string, { arg }: { arg: string }) => {
  try {
    const res = await axios.post(url + arg, {
      headers: { 'Content-Type': `application/json` },
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
};

export function Admin() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [isMounted, setMounted] = useState(false);
  const { trigger: noticeTrigger, isMutating: noticeMutating } = useSWRMutation(
    `/api/waiting/admin/notice/`,
    noticeFetcher,
  );
  const { trigger: deleteTrigger, isMutating: deleteMutating } = useSWRMutation(
    `/api/waiting/admin/delete/`,
    deleteFetcher,
  );
  const { data, isLoading } = useSWR<WaitingResponse[]>(isMounted ? `/api/waiting/admin/${memberId}` : null, fetcher);

  useEffect(() => {
    if (!memberId || memberId?.length !== 36) {
      toast.error('잘못된 접근입니다.');
      return navigate('/');
    }
    setMounted(true);
  }, [memberId, navigate]);

  const onClickDelete = async (e: BaseSyntheticEvent, waitingId: string) => {
    e.preventDefault();
    if (window.confirm('삭제하시겠습니까?')) {
      await deleteTrigger(waitingId);
      alert(`삭제가 완료되었습니다.`);
    }
  };

  const onClickNotice = async (e: BaseSyntheticEvent, waitingId: string) => {
    e.preventDefault();
    await noticeTrigger(waitingId);
    alert(`전송이 완료되었습니다.`);
  };

  if (isLoading) return <AppSpinner />;

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">대기번호</th>
            <th scope="col">어른</th>
            <th scope="col">아이</th>
            <th scope="col">메시지</th>
            <th scope="col">삭제</th>
          </tr>
        </thead>
        <tbody id="target-reload" className="table-group-divider">
          {data?.map((waiting) => (
            <tr key={waiting.id}>
              <th scope="row">{waiting.waitingNumber}</th>
              <td>{waiting.adult}</td>
              <td>{waiting.children}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={(e) => onClickNotice(e, waiting.id)}
                  disabled={noticeMutating}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-send"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                  </svg>
                  전송
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={(e) => onClickDelete(e, waiting.id)}
                  disabled={deleteMutating}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fillRule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
