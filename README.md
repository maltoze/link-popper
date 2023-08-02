# Link Popper
<p>
  <a href="https://chrome.google.com/webstore/detail/link-popper/icejebfpfnhgpdlchhfjpdnddcdamoje" target="_blank">
    <img alt="Chrome" src="https://img.shields.io/chrome-web-store/v/icejebfpfnhgpdlchhfjpdnddcdamoje?logo=google-chrome&link=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Flink-popper%2Ficejebfpfnhgpdlchhfjpdnddcdamoje" />
  </a>
  <a href="https://addons.mozilla.org/firefox/addon/link-popper/" target="_blank">
    <img alt="Firefox" src="https://img.shields.io/amo/v/link-popper?logo=firefox&link=https%3A%2F%2Faddons.mozilla.org%2Ffirefox%2Faddon%2Flink-popper%2F" />
  </a>
</p>


支持在当前窗口中打开链接而无需跳转到新页面的浏览器插件。

![Frame 1](https://github.com/maltoze/link-popper/assets/18044730/43065d34-53e3-43db-a348-af93af990472)

## 开发

1. 克隆本仓库到本地:

   ```
   git clone https://github.com/maltoze/link-popper.git
   ```

2. 安装依赖:

   ```
   pnpm install
   ```

3. 运行开发环境:

   ```
   pnpm dev
   ```


4. 在浏览器中加载未打包的扩展程序：

   - Chrome：打开 `chrome://extensions/`，将开发者模式打开，点击 "加载已解压的扩展程序" 并选择项目的 `dist/` 文件夹
   - Firefox：打开 `about:debugging#/runtime/this-firefox`，点击"临时载入附加组件"，选择项目的 `dist/firefox/manifest.json` 文件 
