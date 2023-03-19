import { Waiting, Turn } from './pages/waiting';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <BrowserRouter>
        <Routes>
          <Route path="/waiting/:memberId" element={<Waiting />} />
          <Route path="/waiting/turn/:waitingId" element={<Turn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
