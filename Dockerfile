FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar netcat para que wait-for-it.sh funcione
RUN apt-get update && apt-get install -y netcat-openbsd

# Copiar todos los archivos del proyecto, incluyendo wait-for-it.sh
COPY . .

RUN chmod +x /app/wait-for-it.sh

CMD ["./wait-for-it.sh", "mariadb:3306", "--", "npm", "start"]

