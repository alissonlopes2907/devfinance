# Use uma imagem base do Nginx
FROM nginx:alpine

# Copie os arquivos do site para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80
