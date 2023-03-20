import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSpinner } from '../../components/AppSpinner';
import { WaitingCountResponse, WaitingRequest } from '../../types/waiting';
import { toast } from 'react-toastify';
import { fetcher, onMessage } from '../../utils/fetcher';

const sendPost = async (url: string, { arg }: { arg: WaitingRequest }) => {
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

const formData: WaitingRequest = {
  adult: 0,
  children: 0,
  phoneNumber: '',
};

export function Waiting() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isMounted, setMounted] = useState(false);
  const [openSocket, setOpenSocket] = useState(false);
  const [reqData, setReqData] = useState(formData);
  const [validError, setValidError] = useState({
    adult: '',
    children: '',
    phoneNumber: '',
    state: false,
  });
  const { data, isLoading } = useSWR<WaitingCountResponse>(isMounted ? `/api/waiting/${memberId}` : null, fetcher);
  const { trigger, isMutating } = useSWRMutation(`/api/waiting/${memberId}`, sendPost);
  const { mutate } = useSWRConfig();
  let ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!memberId || memberId?.length !== 36) {
      toast.error('잘못된 접근입니다.');
      return navigate('/');
    }

    if (!ws.current) {
      ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL + `/${memberId}/websocket`);
      ws.current.onopen = () => {
        setOpenSocket(true);
      };
      ws.current.onmessage = (ev) => onMessage(ev, mutate, `/api/waiting/${memberId}`);
    }

    setMounted(true);
  }, [memberId, navigate, mutate]);

  const onChange = (e: BaseSyntheticEvent) => {
    setReqData((cur) => ({ ...cur, [e.target.name]: e.target.value }));
    setValidError((cur) => ({ ...cur, [e.target.name]: valid(e.target.name, e.target.value) }));
  };

  const valid = (type: string, value: string | number): string => {
    if (type !== 'phoneNumber') {
      return value >= 0 ? '' : '인원은 0명 이상이어야 합니다.';
    }

    const regexp = /(01[016789]{1})[0-9]{4}[0-9]{4}$/;
    const isPhoneNumber = regexp.test(value as string);
    setValidError((cur) => ({ ...cur, state: isPhoneNumber }));
    return isPhoneNumber ? '' : '휴대폰 번호 형식이 옳바르지 않습니다.';
  };

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    await trigger(reqData);
    await mutate(`/waiting/${memberId}`);
    if (openSocket) {
      ws.current?.send('refresh');
    }
    setReqData(formData);
    alert(`대기열 등록이 완료되었습니다.\n카카오톡을 확인 해 주세요.`);
  };

  if (isLoading) return <AppSpinner />;

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <Row lg={5} className="align-items-center py-5">
        <Col lg={7} className="text-center text-lg-start">
          <h1 className="display-4 fw-bold lh-1 mb-3">현재 {data?.count}팀이 대기 중</h1>
          <p className="col-lg-10 fs-4">
            {data?.count
              ? '잔여 좌석이 없습니다. 입장 대기 등록을 해 주세요.'
              : '현재 대기중인 팀이 없습니다. 직원이 안내를 도와드릴거에요.'}
          </p>
        </Col>
        <Col md={10} lg={5} className="mx-auto">
          <Form className="p-4 p-md-5 border rounded-3 bg-light" onSubmit={onSubmit}>
            <p className="col-lg-10 fs-4">인원 수와 휴대폰 번호를 입력 해 주세요.</p>
            <Form.Floating className="mb-3">
              <Form.Control
                id="adult"
                name="adult"
                type="number"
                placeholder="0"
                inputMode="numeric"
                pattern="[0-9]*"
                value={reqData.adult || ''}
                onChange={onChange}
                required
                disabled={isMutating}
              />
              <Form.Label htmlFor="adult">성인</Form.Label>
              <p>{validError.adult || null}</p>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="children"
                name="children"
                type="number"
                placeholder="0"
                inputMode="numeric"
                pattern="[0-9]*"
                value={reqData.children || ''}
                onChange={onChange}
                disabled={isMutating}
              />
              <Form.Label htmlFor="children">아동</Form.Label>
              <p>{validError.children || null}</p>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="01012345678"
                inputMode="numeric"
                pattern="[0-9]*"
                value={reqData.phoneNumber}
                onChange={onChange}
                required
                disabled={isMutating}
              />
              <Form.Label htmlFor="phoneNumber">휴대폰 번호</Form.Label>
              <p>{validError.phoneNumber || null}</p>
            </Form.Floating>
            <Button
              variant="primary"
              size="lg"
              className="w-100"
              type="submit"
              disabled={isMutating || !validError.state}
            >
              {isMutating ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                '등록하기'
              )}
            </Button>
            <small className="text-muted">카카오 알림톡으로 안내 해 드리고 있어요.</small>
            <hr className="my-4" />
            <small className="text-muted">좌석 현황 및 인원에 따라 입장 순서에 변동이 생길 수 있어요.</small>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
