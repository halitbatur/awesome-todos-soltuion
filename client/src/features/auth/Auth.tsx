import { useState, useEffect } from 'react';
import NewWindow from 'react-new-window';
import { __API_LOGIN_PATH__ } from '../../app/services/todos';
import { useAppDispatch, useTypedSelector } from '../../app/store';
import './Auth.css';
import { login, logout, selectIsLogginIn, selectUser, User } from './authSlice';
import { LoggedInView } from './LoggedInView';
import { LoginView } from './LoginView';

export const Auth = () => {
  const usePopup = false;
  const user = useTypedSelector<User | null>(selectUser);
  const isLogginIn = useTypedSelector(selectIsLogginIn);
  const dispatch = useAppDispatch();
  const [showPopup, setShowPopup] = useState(false);

  const handleSignin = () => {
    if (usePopup) {
      setShowPopup(true);
    } else {
      window.location.assign(__API_LOGIN_PATH__);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!user) {
      dispatch(login());
    }
  }, [user, dispatch]);

  const opts = {
    features: {
      toolbar: false,
      menubar: false,
      width: 500,
      height: 700,
    },
    url: __API_LOGIN_PATH__,
    name: 'Sign in with Google',
    copyStyles: false,
    onUnload: () => {
      setShowPopup(false);
      dispatch(login());
    },
  };

  if (!user) {
    return (
      <>
        <LoginView onClick={handleSignin} disabled={isLogginIn} />
        {showPopup && <NewWindow {...opts} />}
      </>
    );
  }

  return <LoggedInView onLogout={handleLogout} user={user} />;
};

// const handleSignIn = () => {
//   const strWindowFeatures =
//     'toolbar=no, menubar=no, width=600, height=700, top=100, left=500';
//   const { current: ref } = windowObjectReference;
//   if (ref === null || ref.closed) {
//     /* if the pointer to the window object in memory does not exist
//        or if such pointer exists but the window was closed */
//     const wnd = window.open(
//       __API_LOGIN_PATH__,
//       'Sign in with Google',
//       strWindowFeatures
//     );

//     wnd?.addEventListener('beforeunload', (e) => {
//       console.log('closed', e);
//       dispatch(login());
//     });

//     windowObjectReference.current = wnd;
//   } else {
//     /* else the window reference must exist and the window
//        is not closed; therefore, we can bring it back on top of any other
//        window with the focus() method. There would be no need to re-create
//        the window or to reload the referenced resource. */
//     ref.focus();
//   }
// };
