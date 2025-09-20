import { setKeyStore } from './nearConfig';

export function loadScript(url: string): Promise<any> {
  return new Promise((resolve) => {
    if ((<any>window)['nearApi']) resolve('');

    const script = document.createElement('script');
    script.onload = () => {
      const nearApi = (<any>window)['nearApi'];
      const myKeyStore = new nearApi['keyStores'].BrowserLocalStorageKeyStore();
      setKeyStore(myKeyStore);
      resolve('');
    };
    script.src = url;
    document.head.appendChild(script);
  });
}
