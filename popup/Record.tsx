import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { recordFav } from './store';
import browser from 'webextension-polyfill';
import { message } from 'antd';

export const Record: React.FC = () => {
  const [state, setState] = React.useState<'normal' | 'loading'>('normal');
  const [messageApi, contextHolder] = message.useMessage();

  const onRecord = async () => {
    setState('loading');

    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tab = tabs[0];
    if (tab && tab.url) {
      const res = await recordFav(tab.url);
      if (res instanceof Error) {
        console.error(res);
        await messageApi.open({
          type: 'error',
          content: `Record Failed: ${res.message}`,
          duration: 3,
        });
      } else {
        console.log('[FAVREC] record success');
        await messageApi.open({
          type: 'success',
          content: 'Record Success',
          duration: 3,
        });
      }
    } else {
      console.error('[FAVREC] This tab cannot be recorded');
      await messageApi.open({
        type: 'error',
        content: 'This tab cannot be recorded',
        duration: 3,
      });
    }

    setState('normal');
  };

  return (
    <div className="flex justify-center p-2">
      {contextHolder}

      {state === 'loading' ? (
        <div className="p-4">
          <span className="loading loading-spinner text-secondary"></span>
        </div>
      ) : (
        <button className="btn btn-secondary" onClick={onRecord}>
          <AddCircleOutlineIcon />
          Record This Page
        </button>
      )}
    </div>
  );
};
