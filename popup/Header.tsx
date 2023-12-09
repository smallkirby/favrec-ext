import React from 'react';
import { FirebaseUser } from '../types/FirebaseUser';
import { auth } from '../background/lib/firebase/app';
import { Favorite } from '@mui/icons-material';

type Props = {
  user: FirebaseUser | null | undefined;
};

export const Header: React.FC<Props> = ({ user }: Props) => {
  const onLogoutClicked = async () => {
    await auth.signOut();
  };

  return (
    <div className="navbar bg-base-100 flex items-center border-b-[1px] border-gray-600 w-full">
      <div
        className="group flex cursor-pointer items-center border-none py-0 pl-1 mr-6
        font-cute text-pink-500 duration-300 hover:text-pink-800 dark:bg-slate-800"
      >
        <h1 className="mr-1 text-lg">FAVREC</h1>
        <Favorite
          sx={{ width: 20, height: 20 }}
          className="pb-[1px] group-hover:animate-ping"
        />
      </div>
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
