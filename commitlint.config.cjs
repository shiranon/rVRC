module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',       //ビルド関連の変更
        'feat',        //新機能
        'fix',         //バグ修正
        'docs',        //ドキュメントのみの変更
        'chore',       //ビルドプロセスやツール、ライブラリの変更
        'style',       //コードの意味に影響を与えない変更
        'refactor',    //リファクタリング
        'ci',          //CI関連の変更
        'test',        //テスト関連の変更
        'perf',        //パフォーマンス改善
        'revert',      //変更の取り消し
      ],
    ],
  },
};