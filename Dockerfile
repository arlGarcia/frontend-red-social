# Etapa de construcción
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine
# Copiar configuración custom de nginx para soportar SPA (Single Page Applications) routing
# Usamos reescritura en el default.conf de nginx o simplemente un archivo conf si lo creamos,
# Para mayor simplicidad y evitar errores inyectamos la configuración de SPA base directo.
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
# Configuración básica para React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
