# Solar Monitor Auth Proxy

Panasonic社の[VBPM277](https://www2.panasonic.biz/jp/energy/solar_industrial/monitor/)や長州産業のCMCS-P04などの電力検出ユニットで使われている太陽光発電モニター内のWebアプリケーション「solar-monitor」用の認証プロキシです。 デフォルトのダイジェスト認証を省略したり、`frame-ancestors`の値を変更して`<iframe>`で埋め込めるようにします。

### 想定する使い方

認証をCloudflare Accessや上流のリバースプロキシで実装していてsolar-monitorデフォルトのダイジェスト認証が不要なときに使用します。

### 注意点

- 認証プロキシ経由のアクセスでは標準のダイジェスト認証がバイパスされます。必ず認証プロキシより上流で認証をかけるようにしてください
- 前提として電力検出ユニットがLANに参加し、IPアドレスが固定されている必要があります
- solar-monitorのIPアドレスへ直接接続できるネットワークにプロキシを設置する必要があります

### 環境変数

- **SOLAR_MONITOR_BASE_URL** - 接続先となるsolar monitorのURL
  - 例 `http://192.168.1.1` などのローカルIPアドレス。`http://solar-monitor.local`には未対応です
- **SOLAR_MONITOR_AUTH_USER** - solar-monitorのログインユーザー名
- **SOLAR_MONITOR_AUTH_PW** - solar-monitorのログインパスワード
- **SOLAR_MONITOR_FRAME_ANCESTORS** - CSPのframe-ancestorsの値。デフォルト値は`'none'`です
