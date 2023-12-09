import React from 'react';

export const LoginInstruction: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold">You must sign in.</h2>
      <div className="p-1 py-2">
        <ul className="list-disc list-inside">
          <li>
            Sign in to{' '}
            <a
              href="https://fav.smallkirby.com"
              className="underline text-blue-600"
            >
              fav.smallkirby.com
            </a>
          </li>
          <li>
            Go to{' '}
            <a
              href="https://fav.smallkirby.com/ext"
              className="underline text-blue-600"
            >
              fav.smallkirby.com/ext
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
