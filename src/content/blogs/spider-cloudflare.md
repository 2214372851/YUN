---
title: "数据采集 CloudFlare 人机验证"
category: "数据采集"
excerpt: 数据采集中通过 CloudFlare 人机验证方案。
lastEdited: 2025年4月18日
tags: [数据采集,Python,CloudFlare]
imageUrl: https://minio-endpoint.yhnotes.com/imgs/CF_logo_stacked_whitetype.png
---

## 绕过 cloudflare 人机验证

> Cloudflare 的人机验证（通常指的是 CAPTCHA 或 JavaScript挑战）是为了帮助网站或服务区分真实用户和恶意机器人（例如爬虫、攻击者等）而设计的一种安全措施。Cloudflare
> 作为一个提供CDN和网络安全服务的公司，提供多种保护机制来防止DDoS攻击、恶意流量、滥用等。人机验证是其中的一部分。

::: tip
由于 cloudflare 会验证 TLS 连接所以建议使用 `curl_cffi`
模块来弥补 Python 底层 openSSL 模块的底层 TLS 连接被识别的问题。
:::

### 本次使用的技术

- `curl_cffi`
- `DrissionPage`

### 示例代码

```python
co = ChromiumOptions().set_browser_path('google-chrome')
co.new_env()
#co.headless() # 部分 cloudflare 无头模式无法绕过 // [!code error]
#co.set_proxy('http://192.168.7.16:7890') # 配置代理，不能忘记curl_cffi也需要代理 // [!code warning]
arguments = [
    "-no-first-run",
    "-force-color-profile=srgb",
    "-metrics-recording-only",
    "-password-store=basic",
    "-use-mock-keychain",
    "-export-tagged-pdf",
    "-no-default-browser-check",
    "-disable-background-mode",
    "-enable-features=NetworkService,NetworkServiceInProcess,LoadCryptoTokenExtension,PermuteTLSExtensions",
    "-disable-features=FlashDeprecationWarning,EnablePasswordsAccountStorage",
    "-deny-permission-prompts",
    "-disable-gpu",
    "-accept-lang=zh-CN", # 根据网站选择支持的地区 // [!code warning]
    "--guest"
]
for arg in arguments:
    co.set_argument(arg)
co.incognito()
co.set_argument("--no-sandbox") # Linux中不设置无法使用 // [!code error]
logger.info("打开浏览器")
browser = Chromium(co)
logger.info("打开浏览器成功")
tab.set.user_agent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36') # 需要关注不同系统的UA不同 // [!code error]
tab.set.window.max() # 实测可有可无
tab.listen.start("worldwide.espacenet.com")
tab.get("https://worldwide.espacenet.com/")
headers = None # 采用监听的方式获取真实headers
for packet in tab.listen.steps():
    headers = packet.request.headers
    logger.info(f"GET: headers --> {headers}")
    break
time.sleep(3)
while True:
    tab.wait(1)
    try:
        if tab.ele('请完成以下操作'):
            logger.info('不需要点击')
            # 模拟人为点击，等操作，根据自己的语言来调整对应的关键词和页面元素结构
            iframe = tab.ele(".main-content")
            iframe = (
                iframe.ele("#rvwE0", timeout=3)
                .ele("@tag()=div")
                .ele("@tag()=div")
                .shadow_root.get_frame("t:iframe")
            )
            iframe_input = iframe.ele("t:body").sr.ele(".cb-lb").ele("t:input")
            if '验证您是真人' in tab.html:
                tab.get_screenshot(path='tmp', name='in.jpg', full_page=True)
                iframe.actions.scroll(
                        delta_y=-100
                ).move(
                        123, 254, 1
                ).move_to(
                        ele_or_loc=iframe_input,
                        offset_x=random.randint(-100, 125),
                        offset_y=random.randint(-98, 140),
                        duration=5
                ).wait(0.1, 0.5).move_to(
                    ele_or_loc=iframe_input,
                    offset_x=random.randint(-5, 5),
                    offset_y=random.randint(-5, 5),
                    duration=2,
                ).wait(0.2, 0.5).click().wait(1, 3)
            with open('tmp/index.html', 'w', encoding='utf-8') as f:
                f.write(tab.html)
            if '验证您是真人' in tab.html:
                logger.info('让我证明我是人')
                tab.get_screenshot(path='tmp', name='in.jpg', full_page=True)
                iframe_input.click()
            if '需要几秒' in tab.html:
                logger.info('他说需要几秒钟')
                tab.get_screenshot(path='tmp', name='in.jpg', full_page=True)
                tab.wait(6)
                tab.get_screenshot(path='tmp', name='in.jpg', full_page=True)
        #logger.info(f"点击 iframe 成功")
        #tab.wait(2)
    except Exception as e:
        logger.error(f"未通过, 重试 {e}", exc_info=True)
    cookies = tab.cookies().as_dict()
    rep = requests.get(
        "https://worldwide.espacenet.com",
        cookies=cookies,
        headers=headers,
    )
    logger.warning(rep.status_code)
    if rep.status_code != 403:
        logger.info("next cookies")
        break
    else:
        if not tab.wait.ele_deleted("#splashScreenContainer", timeout=5):
            tab.refresh(True)
            logger.info("website loading refresh")
        logger.info(f"未通过, 重试")
    tab.get_screenshot(path='tmp', name='pic.jpg', full_page=True)
tab.wait(8)
logger.info(f"获取到的headers: {headers}")
tab.wait(5)
cookies = tab.cookies().as_dict()
logger.info(cookies)
logger.info(f"refresh_cookie 成功")
if not ("cf_clearance" in cookies and len(cookies["cf_clearance"]) > 100):
    logger.error(f"Cookie refresh failed: {cookies}")
    exit(1)
    
# 使用相同IP、Cookies 和 Headers 请求即可正常获取数据
self.cookies = cookies
self.headers["user-agent"] = headers["user-agent"]
browser.quit()
```

### 注意点

- Cookies 不是永久有效的，你需要按照自己的情况来刷新
- User-Agent 需要根据系统来调整，例如 Mac、Linux 与 Windows 都是不同的
- Cloudflare 识别 TLS 连接，需要使用 `curl_cffi` 模块来绕过
- 配合代理来使用最佳，但是浏览器不支持需要账号密码的代理，所以需要使用白名单功能的代理服务

### Docker 部署方案

> 实践时编写了支持的 [Dockerfile](https://github.com/2214372851/python-headless-browser)

#### 使用方法如下

1. 拉取仓库 `git clone https://github.com/2214372851/python-headless-browser.git`
2. 构建基础镜像 `docker build -t headless-browser .`
3. 修改自己的项目的 Dockerfile 例如：

```dockerfile
FROM python-headless-browser:latest

RUN mkdir /code && mkdir /data

VOLUME /data


COPY . /code

RUN pip install -r /code/requirements.txt

WORKDIR /code

# 无头模式使用如下，部分网站使用无头模式无法绕过
CMD ["python", "main.py"]

# 非无头模式使用如下
CMD xvfb-run -a python main.py
```

4. 构建镜像 `docker build -t my-project .`
5. 运行镜像 `docker run -d -v /data:/data my-project`