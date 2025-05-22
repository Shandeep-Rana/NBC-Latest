'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthGuard = ({ allowedRoles, children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user?.roleName?.[0];

    if (allowedRoles.includes(role)) {
      setAuthorized(true);
    } else {
      router.replace('/unauthorized');
    }
  }, [allowedRoles, router]);

  if (!authorized) return <div>Loading...</div>;

  return children;
};

export default AuthGuard;
