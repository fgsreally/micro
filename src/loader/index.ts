import { IInternalAppInfo } from "../types";
import { importEntry } from "import-html-entry";
import { ProxySandbox } from "./sandbox";

export const loadHTML = async (app: IInternalAppInfo) => {
  const { container, entry } = app;
  const dom = document.querySelector(container);
 
  const {
    template,
    getExternalScripts,
    getExternalStyleSheets,
  } = await importEntry(entry);

  console.log(template);
  if (!dom) {
    throw new Error("容器不存在");
  }
//  dom.innerHTML =template;
console.log(dom);
  
  await getExternalStyleSheets();
  const jsCode = await getExternalScripts();

  jsCode.forEach((script) => {
    const lifeCycle = runJS(script, app);
    if (lifeCycle) {
      app.bootstrap = lifeCycle.bootstrap;
      app.mount = lifeCycle.mount;
      app.unmount = lifeCycle.unmount;
    }
  });

  return app;
};

const runJS = (value: string, app: IInternalAppInfo) => {
  if (!app.proxy) {
    app.proxy = new ProxySandbox();
    // @ts-ignore
    window.__CURRENT_PROXY__ = app.proxy.proxy;
  }
  value = value.replace(
    /__webpack_require__.p = "\/"/,
    `__webpack_require__.p = "${app.entry}/";console.log(__webpack_require__.p)`
  );
  console.log(value);
  app.proxy.active();
  const code = `
    return (window => {
      ${value}
      return window['${app.name}']
    })(window.__CURRENT_PROXY__)
  `;
  return new Function(code)();
};
