# Solar Monitor Auth Proxy

Panasonic社の[VBPM277](https://www2.panasonic.biz/jp/energy/solar_industrial/monitor/)や長州産業のCMCS-P04などの電力検出ユニットで使われている太陽光発電モニター内のWebアプリケーション「solar-monitor」用の認証プロキシです。

### 想定する使い方

solar-monitorはダイジェスト認証でログインする仕組みのため、そのままではリバースプロキシからのアクセスができません。この認証プロキシを中継させることでダイジェスト認証を代理し、リバースプロキシ経由でもsolar-monitorにアクセスできるようになります。

たとえばインターネットアクセス可能なリバースプロキシからもsolar-monitorへ接続できるので、自宅サーバとしての運用がやりやすくなります。

### 注意点

- 認証プロキシ経由のアクセスでは標準のダイジェスト認証がバイパスされます。特にインターネットアクセスを可能にする場合は認証プロキシより上流で認証をかけるようにしてください
- 前提として電力検出ユニットがLANに参加し、IPアドレスが固定されている必要があります
- solar-monitorのIPアドレスへ直接接続できるネットワークにプロキシを設置する必要があります

### 環境変数

- **PROXY_URL** - 接続先となるsolar monitorのURL
  - 例 `http://192.168.1.1` などのローカルIPアドレス。`http://solar-monitor.local`には未対応です
- **DIGEST_USER** - solar-monitorのログインユーザー名
- **DIGEST_PW** - solar-monitorのログインパスワード
