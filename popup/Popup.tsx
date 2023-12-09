import React from 'react';
import browser from 'webextension-polyfill';
import './index.css';

export const Popup: React.FC = () => {
  const handleClick = async (): Promise<void> => {
    await browser.tabs.create({ url: 'https://example.com/' });
  };

  // a button to open example.com
  return (
    <button onClick={handleClick} className="bg-red-500">
      Button
    </button>
  );
};
