## 起動方法

1. **このリポジトリをローカルにクローンする**
    ```bash
    git clone https://github.com/kanaru1201/react-flask-memo-app.git
    cd react-flask-memo-app
    ```

2. **Docker Composeで全サービスをビルド＆起動する**
    ```bash
    docker-compose up -d --build
    ```

3. **Webメモアプリにアクセスする**
    - ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください

---

### 注意事項

- [Docker](https://www.docker.com/) および [Docker Compose](https://docs.docker.com/compose/) がインストールされている必要があります。
- フロントエンド（Reactアプリ）は http://localhost:3000 でアクセスできます。
- バックエンド（Flask API）はDockerコンテナ内で動作します。
