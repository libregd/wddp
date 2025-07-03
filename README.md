# 背景
考虑到国内各种文字创作网站，没事就跑路收费，以及国内作者很难解决网络访问的问题去AO3这一类网站发布自己的文学艺术创作。

就想到利用cloudflare的免费pages来制作站点，因为这是个托管网站，无限访问+静态资源额度完全足够一般的作者使用。

如果你写的内容比较高风险，请在内网交流平台（小红书，weibo，微信等）发布网站/网站内容截图 的时候，不用透露是自己的创作。

完全可以 fake like ：亲友们，发现一个太太做了我最爱的cp，这么冷的饭饭，做得这么细腻这么美味我真的哭死.....必须给你们看看了！

aka 自己做自己的第一个粉丝

# 技术
代码全程使用deepseek完成，不用别的主要是说明免费的没什么门槛的AI已经足够支持有心跃跃欲试的人涉足代码。

针对这个项目的第一版，做了[免费做个人网站！全球可访问](https://www.bilibili.com/video/BV1SC3czwEm2/)视频教程。

1. 记得下载 [vscode](https://code.visualstudio.com/)
2. 记得安装vscode的插件 [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

# 更新要点记录

## 2025年7月3日
1. 将全部的《Purpose Driven Church by Rick Warren》txt处理完毕，主要是发现了更好的切分pdf的办法，一下子效率从 0.5h/1个章节 → 0.5h / 所有内容。
2. 将`app.js`中的这部分
```python
    // 按空行分割文本并创建段落
    txt.split(/\n\s*\n/) 
```
做了如下修改，目的是将1行切分为p段落，而不是强制要求txt文本的行与行之间必须要空一个行。
```python
    // 按空行分割文本并创建段落
    txt.split(/\s*\n/) 
```
