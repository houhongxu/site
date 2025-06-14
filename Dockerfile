# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 复制构建好的静态文件到 nginx 目录
COPY dist/ /usr/share/nginx/html/

# 复制自定义 nginx 配置（可选）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
