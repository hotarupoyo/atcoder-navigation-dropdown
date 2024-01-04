# atcoder-navigation-dropdown

AtCoder の問題ページのタブをドロップダウン化して、AtCoder や AtCoder Problems から取得した問題一覧など情報を表示する。

- トップタブ：最近訪れた 10 コンテストと開始時間が近い 11 コンテストを表示する 解いた問題数を表示して全完なら緑背景にする
- 問題タブ：問題一覧と最後の（可能なら AC の）提出を表示する Problems と同様に色背景にする
- 提出タブ：提出一覧ライクの表を表示する
- 提出一覧タブ：ホバーでドロップダウンが開くようにする
  - ※提出一覧タブに提出一覧を表示したいがすでにドロップダウンなので、代わりに提出一覧タブに表示した

AtCoder の自分の得点ページと自分の提出一覧ページと、AtCoder Problems の提出一覧ページから情報を取得している。
負荷回避のため、AtCoder からの取得間隔は 10 分で、AtCoder Problems から取得した提出一覧は IndexedDB にキャッシュしている。

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

使用した OSS のライセンスを表示します。

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

AtCoder Problems の API を取得する機能全体と特に提出一覧を取得してキャッシュする機能を使用した。

Source: <https://github.com/key-moon/atcoder-problems-api>
