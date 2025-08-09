import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from '../../app/constants/publicRoutes';

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
