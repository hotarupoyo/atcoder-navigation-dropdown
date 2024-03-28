# atcoder-navigation-dropdown

AtCoderの問題ページのタブをドロップダウン化して、AtCoderやAtCoder Problemsから取得した問題一覧など情報を表示する。

- トップタブ：最近訪れたコンテストと開始時間が近いコンテストを表示する
- 問題タブ：問題一覧と最後の（可能ならACの）提出を表示する
- 提出タブ：提出一覧ライクの表を表示する
- 提出一覧タブ：ホバーでドロップダウンが開くようにする
  - ※提出一覧タブに提出一覧を表示したい。しかしすでにドロップダウンなので、代わりに提出一覧タブへ表示した

AtCoderの自分の得点ページと自分の提出一覧ページと、AtCoder Problemsの提出一覧ページから情報を取得している。
負荷回避のため、AtCoderからの取得間隔は10分で、AtCoder Problemsから取得した提出一覧はIndexedDBにキャッシュしている。

## 真似した拡張機能・ユーザースクリプト

コンセプトは**atcoder-tasks-page-colorize-during-contests**, **atcoder-problem-navigator**, **Comfortable Atcoder**を真似ています。

- [iilj/atcoder\-tasks\-page\-colorize\-during\-contests: atcoder\-tasks\-page\-colorizer と同様の色付けを，コンテスト中にも行えるようにします．](https://github.com/iilj/atcoder-tasks-page-colorize-during-contests)
- [atcoder\-problem\-navigator](https://greasyfork.org/ja/scripts/383360-atcoder-problem-navigator)
- [Comfortable Atcoder](https://chromewebstore.google.com/detail/comfortable-atcoder/ipmmkccdccnephfilbjdnmnfcbopbpaj)

## GitHub リポジトリ

<https://github.com/hotarupoyo/atcoder-navigation-dropdown>

## GreasyFork からインストール

<https://greasyfork.org/ja/scripts/483835-atcoder-navigation-dropdown>

## ライセンス表示

使用したOSSのライセンスを表示します。

### kenkoooo/AtCoderProblems

`atcoder-problems-frontend/src/style/_custom.scss`のみ流用した。

Source: <https://github.com/kenkoooo/AtCoderProblems>

> MIT License
>
> Copyright (c) 2019 kenkoooo
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

### key-moon/atcoder-problems-api

AtCoder ProblemsのAPIを取得する機能全体と特に提出一覧を取得してキャッシュする機能を使用した。

Source: <https://github.com/key-moon/atcoder-problems-api>
