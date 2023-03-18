import { Spinner } from 'react-bootstrap';

export function AppSpinner() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ lineHeight: '100vh', verticalAlign: 'middle' }}
    >
      <Spinner animation="border" variant="text-secondary" />;
    </div>
  );
}
