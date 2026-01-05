import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RootContext from '../../context/RootContext';

export default function RequireAuth({ role }) {
  const { user } = useContext(RootContext);

  if (user?.roleName === role) return <Outlet />;

  return <Navigate to="/" />;
};
