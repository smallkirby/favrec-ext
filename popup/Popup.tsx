import React, { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import './index.css';
import { FirebaseUser } from '../types/FirebaseUser';
import { LoginInstruction } from './LoginINstruction';
import { Header } from './Header';
import { auth } from '../background/lib/firebase/app';

export const Popup: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);

  useEffect(() => {
    browser.runtime
      .sendMessage({ type: 'signin-state' })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setUser(res?.data as FirebaseUser | null);
      })
      .catch((err) => {
        console.error('[FAVREC] ', err);
      });

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          providerId: user.providerId,
        });
      } else {
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="min-h-[18rem] min-w-[20rem] rounded-lg">
      <Header user={user} />
      <div className="p-2">
        {!user ? <LoginInstruction /> : <div>You are {user?.displayName}</div>}
      </div>
    </div>
  );
};
