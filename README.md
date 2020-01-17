# freee-api-sample
## 準備
```
npm install
```
## freee認証情報設定
.env
```
CLIENT_ID=freeeアプリのclient_id
CLIENT_SECRET=freeeアプリのclient_secret
REDIRECT_URI=freeeアプリのredirect_url(ローカル起動するなら"http://127.0.0.1:3000/"を設定する必要あり)

```
## 起動
```
node index.js
```
## 開始
http://127.0.0.1:3000/