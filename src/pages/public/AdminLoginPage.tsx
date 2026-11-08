import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Kerala PYQ Hub utilizes ONE COMMON LOGIN PAGE for all users (both students and the Super Admin).
 * Separate admin login pages are deprecated; any visits to /admin/login are redirected to /login.
 */
export const AdminLoginPage: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default AdminLoginPage;
