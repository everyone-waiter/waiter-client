import { Waiting, Turn, Cancel, Admin } from './pages/waiting';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { MenuForm } from './pages/menus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/waiting/:memberId" element={<Waiting />} />
        <Route path="/waiting/turn/:waitingId" element={<Turn />} />
        <Route path="/waiting/cancel/:waitingId" element={<Cancel />} />
        <Route path="/waiting/admin/:memberId" element={<Admin />} />
        <Route path="/menus/:memberId" element={<MenuForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
