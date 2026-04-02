// components/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAppContext();

  // 1. Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // 2. Logged in but not Admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // 3. Is Admin
  return children;
};

export default AdminRoute;