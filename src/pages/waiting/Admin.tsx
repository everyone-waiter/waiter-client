import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import useSWRMutation from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';
import { WaitingResponse } from '../../types/waiting';
import { AppSpinner } from '../../components/AppSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { deleteArgsFetcher, getFetcher, postArgsFetcher } from '../../utils/fetcher';

let timeInterval: any;

export function Admin() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [isMounted, setMounted] = useState(false);
  const { trigger: noticeTrigger, isMutating: noticeMutating } = useSWRMutation(
    `/api/waiting/admin/notice/`,
    postArgsFetcher,
  );
  const { trigger: deleteTrigger, isMutating: deleteMutating } = useSWRMutation(
    `/api/waiting/admin/delete/`,
    deleteArgsFetcher,
  );
  const { data, isLoading } = useSWR<WaitingResponse[]>(
    isMounted ? `/api/waiting/admin/${memberId}` : null,
    getFetcher,
  );
  const { mutate } = useSWRConfig();

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
      clearInterval(timeInterval);
      alert(`삭제가 완료되었습니다.`);
      await mutate(`/api/waiting/admin/${memberId}`);
    }
  };

  const onClickNotice = async (e: BaseSyntheticEvent, waitingId: string) => {
    e.preventDefault();
    if (window.confirm('전송하시겠습니까?')) {
      await noticeTrigger(waitingId);
      alert(`전송이 완료되었습니다.`);
    }

    const timer = document.getElementById(`send-timer-${waitingId}`);
    if (timer !== null) {
      let time = 300;
      timeInterval = setInterval(() => {
        timer.innerText = time.toString();
        time--;
      }, 1000);
    }

    const btn = document.getElementById(`send-${waitingId}`);
    if (btn === null) return;
    btn.innerHTML = `<svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-send"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                    </svg>
                    &nbsp;재전송`;
  };

  if (isLoading) return <AppSpinner />;

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">대기번호</th>
            <th scope="col">어른</th>
            <th scope="col">아이</th>
            <th scope="col">시간</th>
            <th scope="col">번호</th>
          </tr>
        </thead>
        <tbody id="target-reload" className="table-group-divider">
          {data?.map((waiting) => (
            <React.Fragment key={waiting.id}>
              <tr>
                <th scope="row">{waiting.waitingNumber}</th>
                <td>{waiting.adult}</td>
                <td>{waiting.children}</td>
                <td>{moment(waiting.createdAt).tz('Asia/Seoul').format('HH:mm:ss')}</td>
                <td>{waiting.phoneNumber}</td>
              </tr>
              <tr>
                <td id={`send-timer-${waiting.id}`}></td>
                <td colSpan={3}>
                  <button
                    id={`send-${waiting.id}`}
                    className="btn btn-primary btn-md"
                    type="button"
                    onClick={(e) => onClickNotice(e, waiting.id)}
                    disabled={noticeMutating || deleteMutating}
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
                    &nbsp;전송
                  </button>
                </td>
                <td colSpan={2}>
                  <button
                    className="btn btn-danger btn-md"
                    type="button"
                    onClick={(e) => onClickDelete(e, waiting.id)}
                    disabled={noticeMutating || deleteMutating}
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
                    &nbsp;삭제
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}
