FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

# コンテナ起動時にnpm startで/appディレクトリのpackage.jsonのscripts.startを実行する．
CMD ["npm", "start"]