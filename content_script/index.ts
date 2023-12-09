import browser from 'webextension-polyfill';

const watchToken = () => {
  const loginTokenElm = document.getElementById('favrec-login-token');
  if (loginTokenElm === null) {
    console.error('[FAVREC] Login token element not found');
    return;
  }

  // watch listener for change of content
  const observer = new MutationObserver(async () => {
    const loginToken = loginTokenElm.textContent;
    if (loginToken && loginToken.length > 0) {
      await browser.runtime.sendMessage({
        type: 'store-token',
        data: loginToken,
      });
    }
  });
  observer.observe(loginTokenElm, { childList: true });
};

watchToken();
