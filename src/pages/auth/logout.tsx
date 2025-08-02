import type { AppDispatch } from 'src/redux/types';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { CONFIG } from 'src/config-global';
import { logout } from 'src/redux/auth/auth.actions';


// ----------------------------------------------------------------------

export default function Page() {

  const dispatch: AppDispatch = useDispatch();

  
    useEffect(() => {
      const logoutRequest = async () => {
        await dispatch(logout());
        window.location.href = '/sign-in';
      };
  
      logoutRequest();
    }, [dispatch]);
  
  return (
    <>
      <title>{`Logout - ${CONFIG.appName}`}</title>

      <div />
    </>
  );
}
