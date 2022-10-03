import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { ROUTES } from '../utils/routes';
import Answers from './Answers';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigate = useNavigate();

  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('/', () => navigate(ROUTES.clues.search), predicate);

  return (
    <Routes>
      <Route path="search" element={<Search />} />
      <Route path="search/:answer" element={<Answers />} />
      <Route path="display/:answer" element={<Clues />} />
      <Route path="*" element={<Navigate to="search" />} />
    </Routes>
  );
};

export default CluesGenerator;
