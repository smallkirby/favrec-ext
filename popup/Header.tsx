import React from 'react';
import { FirebaseUser } from '../types/FirebaseUser';
import { auth } from '../background/lib/firebase/app';

type Props = {
  user: FirebaseUser | null | undefined;
};

export const Header: React.FC<Props> = ({ user }: Props) => {
  const onLogoutClicked = async () => {
    await auth.signOut();
  };

  return (
    <div className="navbar bg-base-100 flex items-center border-b-[1px] border-gray-600 w-full">
      <div className="flex-1 justify-end">
        {user ? (
          <a
            className="btn btn-outline btn-error btn-xs text-md"
            onClick={onLogoutClicked}
          >
            Logout
          </a>
        ) : (
          <a
            className="btn btn-outline btn-primary  btn-xs text-md"
            onClick={onLogoutClicked}
          >
            Need Login
          </a>
        )}
      </div>
      <div className="avatar ml-2">
        {user ? (
          <div className="w-8 rounded-full">
            <img src={user.photoUrl ?? ''} />
          </div>
        ) : (
          <div className="w-8 rounded-full">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
          </div>
        )}
      </div>
    </div>
  );
};
