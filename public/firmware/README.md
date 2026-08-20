# 固件文件目录

把固件文件（.bin / .img / .fw / .zip 等）直接放到这个目录下，VitePress 会原样发布到网站。

## 使用方法

1. 将固件文件复制到本目录，例如 `NS106PA_v1.0.5.bin`
2. 在 `03-高级功能/固件升级.md` 的下载表格中添加一行
3. 下载链接写 `/firmware/文件名`，例如 `/firmware/NS106PA_v1.0.5.bin`

## 文件大小限制

- GitHub 仓库：单个文件最大 100 MB（超过 50 MB 会警告）
- Cloudflare Pages：免费版无单文件大小硬限制，但总部署文件数不超过 20,000

如果固件文件超过 100 MB，建议用 GitHub Releases 或 Cloudflare R2 托管。
