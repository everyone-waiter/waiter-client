import useSWR from 'swr';
import { toast } from 'react-toastify';
import useSWRMutation from 'swr/mutation';
import { Button, Form } from 'react-bootstrap';
import { WaitingResponse } from '../../types/waiting';
import { AppSpinner } from '../../components/AppSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { deleteFetcher, getFetcher } from '../../utils/fetcher';

export function Cancel() {
  const { memberId, waitingId } = useParams();
  const navigate = useNavigate();
  const [isMounted, setMounted] = useState(false);
  const [validUserInput, setValidUserInput] = useState(true);
  const { trigger, isMutating } = useSWRMutation(
    `/api/waiting/cancel/${waitingId}`,
    deleteFetcher,
  );
  const { data, isLoading } = useSWR<WaitingResponse>(
    isMounted ? `/api/waiting/cancel/${waitingId}` : null,
    getFetcher,
  );

  useEffect(() => {
    if (!waitingId || waitingId?.length !== 36) {
      toast.error('잘못된 접근입니다.');
      return navigate('/');
    }

    setMounted(true);
  }, [waitingId, navigate, memberId]);

  const onChange = (e: BaseSyntheticEvent) => {
    setValidUserInput(Number(e.target.value) !== data?.waitingNumber);
  };

  const onClick = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    await trigger();
    alert(`대기 취소가 완료되었습니다.`);
    window.location.href = `kakaotalk://inappbrowser/close`;
  };

  if (isLoading) return <AppSpinner />;

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <div className="px-4 pt-5 my-5 text-center border-bottom">
        {data?.waitingTurn !== -1 ? (
          <>
            <h1 className="display-4 fw-bold">대기를 취소하시려구요?</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">
                대기를 취소하시면 다시 대기 등록을 하셔야 합니다.
              </p>
              <p className="lead mb-4">
                대기를 취소하시려면 {data?.waitingNumber}을 입력해주세요.
              </p>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="number"
                  name="waitingNumber"
                  id="cancelWaitingNumber"
                  placeholder="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={onChange}
                />
                <Form.Label htmlFor="cancelWaitingNumber">대기 번호</Form.Label>
              </Form.Floating>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="px-4 me-sm-3"
                  onClick={onClick}
                  disabled={isMutating || validUserInput}
                >
                  {isMutating ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    '취소하기'
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <h1 className="display-4 fw-bold">이미 취소된 대기번호 입니다.</h1>
        )}
      </div>
    </div>
  );
}
