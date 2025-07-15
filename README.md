# VPM Repository Auto-Update System

VRChatのパッケージ管理システム（VPM）用の自動更新システムです。GitHub Actionsを使用して、指定されたリポジトリのリリースから自動的にvpm.jsonを更新します。

## 特徴

- 🔧 **汎用的な設定**: 設定ファイルによる柔軟なリポジトリ管理
- 🚀 **自動化**: GitHubリリースの検出と自動更新
- 🌐 **Repository Dispatch**: 外部からのAPI呼び出しに対応
- 📦 **複数パッケージ対応**: 複数のパッケージを一つのVPMリポジトリで管理
- ✨ **自動パッケージ登録**: 新しいパッケージを事前設定なしで自動追加
- 🏗️ **ゼロ設定開始**: 空のvpm.jsonから開始可能

## セットアップ

### 1. このリポジトリをフォーク/クローン

### 2. 設定ファイルの編集

`.github/config/repositories.yml`を編集：

```yaml
default_owner: "your-github-username"

repositories:
  - name: "your-package-1"
    owner: "package-owner"  # 異なる場合のみ指定
  - name: "your-package-2"

vpm_settings:
  repo_url: "https://your-username.github.io/vpm.json"
  name: "Your VPM Repository"
  description: "あなたのVRChat用パッケージリポジトリ"
```

### 3. GitHub Pagesの有効化

1. リポジトリの Settings → Pages
2. Source を "GitHub Actions" に設定
3. vpm.jsonが`https://your-username.github.io/your-repo-name/vpm.json`でアクセス可能になります

### 4. 初期のvpm.jsonの作成

最小限のvpm.jsonファイルを作成：

```json
{
  "packages": {}
}
```

**または**提供されているテンプレートをコピー：

```bash
cp vpm.template.json vpm.json
```

これだけで準備完了！新しいパッケージは自動的に追加されます。

## 使用方法

### 手動実行

1. GitHub Actionsタブに移動
2. "add-new-version"ワークフローを選択
3. "Run workflow"をクリック
4. リポジトリ名とタグを入力して実行

### API経由での実行

```bash
curl -X POST \\
  -H "Accept: application/vnd.github.v3+json" \\
  -H "Authorization: token YOUR_GITHUB_TOKEN" \\
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches \\
  -d '{
    "event_type": "add_new_version",
    "client_payload": {
      "repository": "PACKAGE_NAME",
      "tag": "v1.0.0"
    }
  }'
```

### VPMクライアントでの使用

VRChatプロジェクトで以下のURLをVPMリポジトリとして追加：

```
https://your-username.github.io/your-repo-name/vpm.json
```

## ワークフローの説明

- **AddNewVersion.yml**: メインのパッケージ追加ワークフロー
- **AddNewVersionFromReposDispatch.yml**: Repository Dispatch イベント用
- **UpdateRepositoryOptions.yml**: 設定更新用（将来の拡張）

## カスタマイズ

詳細な設定方法については [CONFIG_README.md](.github/CONFIG_README.md) を参照してください。

## 要件

- パッケージのGitHubリリースに以下のアセットが含まれていること：
  - `package.json`: Unity Package Manager用の設定ファイル
  - `[package-name]-[version].zip`: パッケージファイル

## ライセンス

MIT License

## 貢献

Issue や Pull Request を歓迎します！
