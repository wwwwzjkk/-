# 官网咨询表单接企微机器人

当前网站部署在 GitHub Pages，属于静态站。企微机器人 webhook 不能写在前端代码里，否则任何人都能从浏览器源码中看到并滥用。

## 推荐部署方式：Cloudflare Worker

1. 登录 Cloudflare，进入 Workers & Pages。
2. 新建 Worker，把 `cloudflare-worker-contact.js` 的内容复制进去。
3. 在 Worker 的 Settings -> Variables 里添加环境变量：
   - 变量名：`WECOM_WEBHOOK_URL`
   - 变量值：企微机器人 webhook
4. 部署 Worker，得到类似 `https://xxx.xxx.workers.dev` 的地址。
5. 打开 `script.js`，把第一行改成：

```js
const CONTACT_API_URL = "https://你的-worker地址";
```

6. 推送 GitHub Pages 后，在官网联系我们页面提交一次测试。

## 安全说明

- `script.js` 不保存企微 webhook，只保存 Worker 地址。
- Worker 只允许 `https://haoliunet.top` 和 `https://www.haoliunet.top` 发起提交。
- 表单提交字段：姓名、公司、电话、需求、提交页面。
