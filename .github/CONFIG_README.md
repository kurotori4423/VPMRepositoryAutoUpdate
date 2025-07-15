# VPM Repository Configuration

このファイルでVPMリポジトリの自動更新システムの設定を管理します。

## 🚀 新機能: 自動パッケージ登録

**パッケージが事前に登録されていなくても自動で追加されます！**

- 空の`vpm.json`から開始可能
- 新しいパッケージを自動検出・追加
- VPMリポジトリの基本情報を自動生成

## 設定ファイル

### `.github/config/repositories.yml`

このファイルで管理対象のリポジトリとその設定を定義します。

```yaml
# デフォルトのリポジトリオーナー
default_owner: "your-username"

# 管理対象のリポジトリリスト
repositories:
  - name: "your-package-1"
    owner: "optional-different-owner"  # 省略可能、異なるオーナーの場合のみ指定
  - name: "your-package-2"
    # ownerが省略された場合はdefault_ownerが使用される

# VPMリポジトリの設定
vpm_settings:
  repo_url: "https://your-username.github.io/vpm.json"
  name: "Your VPM Repository"
  description: "VRChat用パッケージリポジトリ"
  author_name: "your-username"
  author_url: "https://github.com/your-username"
```

## 🏁 クイックスタート

### 1. 最小限のセットアップ

リポジトリに以下のファイルを作成するだけで開始できます：

```json
// vpm.json（最小限）
{
  "packages": {}
}
```

### 2. 設定の更新

`.github/config/repositories.yml`を編集：
- `default_owner`をあなたのGitHubユーザー名に変更
- `vpm_settings`をあなたの情報に更新

### 3. 自動パッケージ追加

新しいパッケージを追加する際：
1. リポジトリリストに新しいパッケージ名を追加
2. ワークフローを実行
3. **パッケージが自動的にvpm.jsonに追加されます！**

## 使用方法

### 1. 設定の更新

`.github/config/repositories.yml`を編集して：
- `default_owner`をあなたのGitHubユーザー名に変更
- `repositories`に管理したいパッケージを追加
- `vpm_settings.repo_url`をあなたのVPMリポジトリURLに変更

### 2. 新しいバージョンの追加

#### 手動実行
1. GitHub Actionsの「add-new-version」ワークフローに移動
2. 「Run workflow」をクリック
3. リポジトリとタグを選択して実行

#### Repository Dispatch経由
外部から以下のAPIコールで実行可能：

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches \
  -d '{"event_type":"add_new_version","client_payload":{"repository":"PACKAGE_NAME","tag":"v1.0.0"}}'
```

### 3. 環境変数の設定

必要に応じて以下の環境変数を設定できます：

- `DEFAULT_REPO_OWNER`: デフォルトのリポジトリオーナー

## ファイル構成

- `AddNewVersion.yml`: メインのワークフロー
- `AddNewVersionFromReposDispatch.yml`: Repository Dispatch用
- `UpdateRepositoryOptions.yml`: リポジトリオプションの更新用
- `JsScripts/`: 処理用のJavaScriptファイル群
  - `ConfigHelper.mjs`: 設定ファイル読み込み
  - `GetZipURL.mjs`: ZIPファイルURL取得
  - `GetPackageDotJson.mjs`: package.json取得
  - `ReplacePackageURL.mjs`: パッケージURL置換
  - `AddToVPMRepo.mjs`: VPMリポジトリへの追加

## カスタマイズ

### 新しいリポジトリの追加

`.github/config/repositories.yml`の`repositories`配列に新しいエントリを追加：

```yaml
repositories:
  - name: "new-package-name"
    owner: "package-owner"  # 必要に応じて
```

### VPM設定の変更

`.github/config/repositories.yml`の`vpm_settings`を編集：

```yaml
vpm_settings:
  repo_url: "https://your-domain.com/vpm.json"
  name: "Custom Repository Name"
  description: "カスタム説明"
```
