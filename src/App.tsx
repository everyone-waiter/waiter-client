import { Waiting, Turn, Cancel } from './pages/waiting';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <BrowserRouter>
        <Routes>
          <Route path="/waiting/:memberId" element={<Waiting />} />
          <Route path="/waiting/turn/:waitingId" element={<Turn />} />
          <Route path="/waiting/:memberId/cancel/:waitingId" element={<Cancel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
