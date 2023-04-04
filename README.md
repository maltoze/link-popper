# 🌟 Link Popper

Link Popper 是一个方便的浏览器插件，可以在当前窗口中打开链接而无需跳转到新页面。

## 预览
![preview-gif](https://user-images.githubusercontent.com/18044730/223592042-6539ece3-09e5-4d7d-a673-74f2073bd1ff.gif)

## 安装

- [Chrome](https://chrome.google.com/webstore/detail/link-popper/icejebfpfnhgpdlchhfjpdnddcdamoje)
- [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/link-popper/)

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

   - Chrome：打开 `chrome://extensions/`，将开发者模式打开，点击 "加载已解压的扩展程序" 并选择项目的 `build/chromium` 文件夹
   - Firefox：打开 `about:debugging#/runtime/this-firefox`，点击"临时载入附加组件"，选择项目的 `build/firefox/manifest.json` 文件 

## Credits
- [chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension)
