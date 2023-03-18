import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSpinner } from '../../components/AppSpinner';

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e: any) {
    const error = new Error(e.response.message);
    error.code = e.response.status;
    throw error;
  }
};

export function Waiting() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isMounted, setMounted] = useState(false);
  const { data, isLoading } = useSWR(isMounted ? `/waiting/${memberId}` : null, fetcher);

  useEffect(() => {
    if (!memberId || memberId?.length !== 36) return navigate('/');
    setMounted(true);
  }, [memberId, navigate]);

  if (isLoading) return <AppSpinner />;

  console.log(data);

  return (
    <Row lg={5} className="align-items-center py-5">
      <Col lg={7} className="text-center text-lg-start">
        <h1 className="display-4 fw-bold lh-1 mb-3">현재 웨이팅 중인 팀 수</h1>
        <p className="col-lg-10 fs-4">잔여 좌석이 없습니다. 입장 대기 등록을 해 주세요.</p>
      </Col>
      <Col md={10} lg={5} className="mx-auto">
        <Form className="p-4 p-md-5 border rounded-3 bg-light" method="post">
          <p className="col-lg-10 fs-4">인원 수와 휴대폰 번호를 입력 해 주세요.</p>
          <Form.Floating className="mb-3">
            <Form.Control id="adult" type="number" placeholder="0" inputMode="numeric" pattern="[0-9]*" />
            <Form.Label htmlFor="adult">성인</Form.Label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control id="children" type="number" placeholder="0" inputMode="numeric" pattern="[0-9]*" />
            <Form.Label htmlFor="children">아동</Form.Label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control id="phoneNumber" type="tel" placeholder="01012345678" inputMode="numeric" pattern="[0-9]*" />
            <Form.Label htmlFor="phoneNumber">휴대폰 번호</Form.Label>
          </Form.Floating>
          <Button variant="primary" size="lg" className="w-100" type="submit">
            등록하기
          </Button>
          <small className="text-muted">카카오 알림톡으로 안내 해 드리고 있어요.</small>
          <hr className="my-4" />
          <small className="text-muted">좌석 현황 및 인원에 따라 입장 순서에 변동이 생길 수 있어요.</small>
        </Form>
      </Col>
    </Row>
  );
}
