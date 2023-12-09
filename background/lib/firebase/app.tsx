import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  connectAuthEmulator,
  getAuth,
} from 'firebase/auth';
import browser from 'webextension-polyfill';
import { signInWithCredential } from 'firebase/auth';

// NOTE: This is not secret.
const firebaseConfig = {
  apiKey: 'AIzaSyBj485Pk2FrtmBvNR9TcsAYKxPk52dMN_w',
  authDomain: 'favrec-4d401.firebaseapp.com',
  projectId: 'favrec-4d401',
  appId: '1:1051204428026:web:8e0752568b56d961fd6943',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

type MessageType = {
  type: 'signin' | 'signout' | 'signin-state' | 'store-token';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

const onSigninRequest = async (msg: MessageType) => {
  if (msg.type === 'signin-state') {
    console.info('[FAVREC] signin-state', auth.currentUser);
    const user = auth.currentUser;
    if (user) {
      return Promise.resolve({
        type: 'signin',
        data: {
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          providerId: user.providerId,
        },
      });
    } else {
      return Promise.resolve({ type: 'signout', data: null });
    }
  } else if (msg.type === 'store-token') {
    if (auth.currentUser) {
      console.info('[FAVREC] user is already signed in');
      return;
    }
    const cred = GithubAuthProvider.credential(msg.data as string);
    await signInWithCredential(auth, cred).catch((err) => {
      console.error(err);
    });
  } else {
    console.error(
      `[FAVREC] onSigninRequest: unknown message type: ${msg.type}`
    );
  }
};

const initFirebase = () => {
  auth.onAuthStateChanged((user) => {
    console.info('[FAVREC] onAuthStateChanged', user);
  });

  browser.runtime.onMessage.addListener(onSigninRequest);
};

export { initFirebase, auth };
