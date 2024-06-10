# Etapa 1: Construcción de la aplicación Angular
FROM node:20 AS build

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación Angular
RUN npm run build

# Etapa 2: Servir la aplicación usando Nginx
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa 1
COPY --from=build /app/dist/processing-chat-app /usr/share/nginx/html

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80 para el servidor web
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
