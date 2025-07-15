import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * 設定ファイルから指定されたリポジトリのオーナーを取得する
 * @param {string} repositoryName - リポジトリ名
 * @returns {string} オーナー名
 */
export function getRepositoryOwner(repositoryName) {
    try {
        const configPath = path.join(process.env.GITHUB_WORKSPACE, '.github', 'config', 'repositories.yml');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        
        // 指定されたリポジトリを検索
        const repo = config.repositories.find(r => r.name === repositoryName);
        
        if (repo && repo.owner) {
            return repo.owner;
        }
        
        // 見つからない場合はデフォルトオーナーを返す
        return config.default_owner || process.env.DEFAULT_REPO_OWNER || 'kurotori4423';
        
    } catch (error) {
        console.error('設定ファイルの読み込みに失敗しました:', error);
        // フォールバック: 環境変数またはデフォルト値
        return process.env.DEFAULT_REPO_OWNER || 'kurotori4423';
    }
}

/**
 * VPM設定を取得する
 * @returns {object} VPM設定オブジェクト
 */
export function getVpmSettings() {
    try {
        const configPath = path.join(process.env.GITHUB_WORKSPACE, '.github', 'config', 'repositories.yml');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        
        return config.vpm_settings || {
            repo_url: 'https://vpm.kurotori4423.github.io/vpm.json',
            name: 'Kurotori4423 VPM Repository',
            description: 'VRChat用パッケージリポジトリ'
        };
        
    } catch (error) {
        console.error('VPM設定の読み込みに失敗しました:', error);
        return {
            repo_url: 'https://vpm.kurotori4423.github.io/vpm.json',
            name: 'Kurotori4423 VPM Repository', 
            description: 'VRChat用パッケージリポジトリ'
        };
    }
}

/**
 * 利用可能なリポジトリリストを取得する
 * @returns {Array} リポジトリ名の配列
 */
export function getAvailableRepositories() {
    try {
        const configPath = path.join(process.env.GITHUB_WORKSPACE, '.github', 'config', 'repositories.yml');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        
        return config.repositories.map(repo => repo.name);
        
    } catch (error) {
        console.error('リポジトリリストの読み込みに失敗しました:', error);
        return ['TexTransTool', 'TexTransCore']; // フォールバック
    }
}

/**
 * VPMリポジトリの基本構造を初期化する
 * @param {object} existingVpmJson - 既存のVPMリポジトリJSON
 * @returns {object} 初期化されたVPMリポジトリJSON
 */
export function initializeVpmRepo(existingVpmJson = {}) {
    const vpmSettings = getVpmSettings();
    
    return {
        name: existingVpmJson.name || vpmSettings.name,
        description: existingVpmJson.description || vpmSettings.description,
        url: existingVpmJson.url || vpmSettings.repo_url,
        id: existingVpmJson.id || generateRepoId(vpmSettings.repo_url),
        author: existingVpmJson.author || {
            name: vpmSettings.author_name || "Repository Owner",
            url: vpmSettings.author_url || ""
        },
        packages: existingVpmJson.packages || {}
    };
}

/**
 * URLからリポジトリIDを生成する
 * @param {string} repoUrl - リポジトリURL
 * @returns {string} リポジトリID
 */
function generateRepoId(repoUrl) {
    try {
        const url = new URL(repoUrl);
        const domain = url.hostname.replace('www.', '');
        const path = url.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '.');
        return `${domain}${path ? '.' + path : ''}`;
    } catch (error) {
        console.warn('リポジトリIDの生成に失敗しました:', error);
        return 'com.example.vpm-repo';
    }
}

/**
 * パッケージの基本メタデータを補完する
 * @param {object} packageJson - パッケージのJSON
 * @param {string} repositoryName - リポジトリ名
 * @returns {object} 補完されたパッケージJSON
 */
export function enrichPackageMetadata(packageJson, repositoryName) {
    const vpmSettings = getVpmSettings();
    
    // 基本情報の補完
    if (!packageJson.repo) {
        packageJson.repo = vpmSettings.repo_url;
    }
    
    // GitHubリンクの生成（authorが設定されていない場合）
    if (!packageJson.author || !packageJson.author.url) {
        const owner = getRepositoryOwner(repositoryName);
        packageJson.author = packageJson.author || {};
        if (!packageJson.author.url) {
            packageJson.author.url = `https://github.com/${owner}`;
        }
    }
    
    return packageJson;
}
