# 🌟 Link Popper

Link Popper 是一个方便的浏览器插件，用于在某些网站上提供在当前窗口打开链接的功能，无需跳转至新页面。

## 功能

Link Popper 目前可以在以下网站上使用：

- [v2ex](https://v2ex.com)
- [4d4y](https://4d4y.com)

在这些网站上，用户可以使用 Link Popper 在当前窗口中打开链接，而不必跳转至新页面

## 安装

- Chrome 插件（审核中)
- Firefox 插件（审核中)

## 开发

如果你想为 Link Popper 做出贡献，可以按照以下步骤进行:

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

5. 修改代码并测试。

6. 提交代码并创建拉取请求。

## Credits
- [chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension)