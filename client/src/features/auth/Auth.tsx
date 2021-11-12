import { useRef } from 'react';
import { __API_LOGIN_PATH__ } from '../../app/services/todos';
import { useTypedSelector } from '../../app/store';
import './Auth.css';
import { selectUser } from './authSlice';
import { LoggedInView } from './LoggedInView';
import { LoginView } from './LoginView';

export const Auth = () => {
  const user = useTypedSelector(selectUser);
  const windowObjectReference = useRef<Window | null>(null);

  const handleSignIn = () => {
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=500';
    const { current: ref } = windowObjectReference;
    if (ref === null || ref.closed) {
      /* if the pointer to the window object in memory does not exist
         or if such pointer exists but the window was closed */
      windowObjectReference.current = window.open(
        __API_LOGIN_PATH__,
        'Sign in with Google',
        strWindowFeatures
      );
    } else {
      /* else the window reference must exist and the window
         is not closed; therefore, we can bring it back on top of any other
         window with the focus() method. There would be no need to re-create
         the window or to reload the referenced resource. */
      ref.focus();
    }
  };

  if (!user) {
    return <LoginView onClick={handleSignIn} />;
  }

  return <LoggedInView user={user} />;
};
