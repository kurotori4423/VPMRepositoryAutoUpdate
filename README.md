# VPM Repository Auto-Update

ReinaS-64892氏のリポジトリからフォークして作成した、VRChatのパッケージ管理システム（VPM）用の自動更新システムです。
GitHub Actionsを使用して、指定されたリポジトリのリリースから自動的にvpm.jsonを更新します。

## 特徴

- 🔧 **汎用的な設定**: 設定ファイルによる柔軟なリポジトリ管理
- 🚀 **自動化**: GitHubリリースの検出と自動更新
- 🌐 **Repository Dispatch**: 外部からのAPI呼び出しに対応
- 📦 **複数パッケージ対応**: 複数のパッケージを一つのVPMリポジトリで管理
- ✨ **自動パッケージ登録**: 新しいパッケージを事前設定なしで自動追加
- 🏗️ **ゼロ設定開始**: 空のvpm.jsonから開始可能
- 🔗 **ディスパッチワークフロー**: パッケージリリース時の自動連携テンプレート提供

## セットアップ

### 1. リポジトリをフォーク/クローン

- 右上の "Fork" ボタンをクリック
- フォークしたリポジトリをローカルにクローン：
  ```bash
  git clone https://github.com/YOUR_USERNAME/FORKED_REPO_NAME.git
  cd FORKED_REPO_NAME
  ```

### 2. 設定ファイルの編集

`.github/config/repositories.yml`を編集：

```yaml
default_owner: "your-github-username"

repositories:
  - name: "your-package-1"
    owner: "package-owner"  # 異なる場合のみ指定
  - name: "your-package-2"

vpm_settings:
  repo_url: "https://your-username.github.io/your-repo-name/vpm.json"
  name: "Your VPM Repository"
  description: "あなたのVRChat用パッケージリポジトリ"
```

### 3. GitHub Pagesの有効化

1. リポジトリの Settings → Pages
2. Source を "GitHub Actions" に設定
3. vpm.jsonが`https://your-username.github.io/your-repo-name/vpm.json`でアクセス可能になります

### 4. 設定をコミット・プッシュ

```bash
git add .github/config/repositories.yml
git commit -m "Update repository configuration"
git push origin main
```

### 5. ワークフローオプションの自動更新

設定ファイルをコミット・プッシュすると、`UpdateRepositoryOptions.yml`が自動実行され、`AddNewVersion.yml`のリポジトリ選択肢が自動更新されます。

- **初期状態**: `AddNewVersion.yml`に`placeholder-package`が設定されています
- **自動更新後**: 実際のパッケージ名に更新されます
- **確認方法**: GitHub Actionsタブで実行状況を確認

これだけで準備完了！新しいパッケージは自動的に追加されます。

### 6. パッケージリポジトリでのディスパッチワークフロー設定（オプション）

パッケージのリリース時に自動的にVPMリポジトリに追加したい場合は、以下のテンプレートリポジトリからディスパッチワークフローを設定できます：

**VPMUnityPackageWorkflow**: https://github.com/kurotori4423/VPMUnityPackageWorkflow

このテンプレートを使用すると、パッケージをリリースした際に自動的にこのVPMリポジトリに通知が送信され、パッケージが追加されます。

## 使用方法

### 新しいパッケージの追加手順

#### 1. 設定ファイルに追加（推奨）

`.github/config/repositories.yml`を編集：

```yaml
repositories:
  - name: "existing-package-1"
  - name: "existing-package-2"
  - name: "new-package"  # 新しく追加
```

コミット・プッシュすると、`AddNewVersion.yml`のオプションが自動更新されます。

#### 2. 手動実行

1. GitHub Actionsタブに移動
2. "add-new-version"ワークフローを選択
3. "Run workflow"をクリック
4. 更新されたリポジトリ選択肢からパッケージを選択
5. タグを入力して実行

### API経由での実行

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches \
  -d '{
    "event_type": "add_new_version",
    "client_payload": {
      "repository": "PACKAGE_NAME",
      "tag": "v1.0.0"
    }
  }'
```

### 自動連携（ディスパッチワークフロー）

パッケージのリポジトリに以下のテンプレートワークフローを設定することで、リリース時に自動的にVPMリポジトリに追加できます：

**VPMUnityPackageWorkflow**: https://github.com/kurotori4423/VPMUnityPackageWorkflow

このテンプレートを使用すると：
- パッケージをリリースした際に自動でRepository Dispatchが送信される
- 手動でVPMリポジトリを更新する必要がなくなる
- リリースワークフローに組み込んで完全自動化が可能

### VPMクライアントでの使用

VRChatプロジェクトで以下のURLをVPMリポジトリとして追加：

```
https://your-username.github.io/your-repo-name/vpm.json
```

## ワークフローの説明

- **AddNewVersion.yml**: メインのパッケージ追加ワークフロー
- **AddNewVersionFromReposDispatch.yml**: Repository Dispatch イベント用
- **UpdateRepositoryOptions.yml**: 設定ファイル変更時の自動ワークフロー更新

### UpdateRepositoryOptions.ymlの動作

このワークフローは以下のタイミングで自動実行されます：

1. **手動実行**: GitHub ActionsタブからWorkflowを手動実行
2. **自動実行**: `.github/config/repositories.yml`をコミット・プッシュした時

**実行内容：**
- 設定ファイルからリポジトリリストを読み込み
- `AddNewVersion.yml`の`options`セクションを自動更新
- 変更があれば自動コミット・プッシュ

**例：**
```yaml
# repositories.yml に以下を設定
repositories:
  - name: "MyPackage1" 
  - name: "MyPackage2"
```

↓ 自動更新後

```yaml
# AddNewVersion.yml の options が以下に更新される
options:
  - MyPackage1
  - MyPackage2
```

## カスタマイズ

詳細な設定方法については [CONFIG_README.md](.github/CONFIG_README.md) を参照してください。

## 要件

- パッケージのGitHubリリースに以下のアセットが含まれていること：
  - `package.json`: Unity Package Manager用の設定ファイル
  - `[package-name]-[version].zip`: パッケージファイル

## 注意事項とトラブルシューティング

- **初期状態**: `AddNewVersion.yml`には`placeholder-package`が設定されています
- **自動更新**: 設定ファイルを編集すると、実際のパッケージ名に自動更新されます
- **権限**: GitHub Actionsがワークフローファイルを更新できるよう、適切な権限設定が必要です
- **Pages設定**: GitHub Pagesが有効になっていないとvpm.jsonにアクセスできません
