import { getAvailableRepositories } from './ConfigHelper.mjs';

/**
 * 利用可能なリポジトリオプションをGitHub Actionsの選択肢形式で出力する
 */
export function getRepositoryOptions() {
    const repositories = getAvailableRepositories();
    return repositories;
}
