<div align="center">
  <img src="./app/images/rvrc-logo.svg" alt="rVRC" />
  <h3><a href="https://r-vrc.net/">rVRC</a></h3>
  <p>rVRCはVRChat用アイテムのスキ数を集計してランキング化しているサービスです。</p>

  <img src="https://img.shields.io/badge/Remix-black?logo=remix" alt="Remix" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-black?logo=cloudflarepages" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-black?logo=cloudflare" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/Supabase-black?logo=supabase" alt="Supabase" />
  <a href="https://x.com/rvrc_v"><img src="https://img.shields.io/badge/rVRC-black?logo=x" alt="rVRC" /></a>
</div>

## 概要

rVRCは[BOOTH](https://booth.pm/ja)で販売されている3Dアイテムの人気ランキング表示、  
検索・絞り込み機能を強化したサービスです。  
Discordでログインをすれば気に入ったアイテムをフォルダ分けする事が出来ます。
<br>
<br>

## 開発背景
　現在、VRChatなどのVRSNS向け3Dモデルの販売は、主にBOOTHが担っており、多くのクリエイターが自身の作品を販売する場として利用しています。しかし、BOOTHはあくまでクリエイター向けのネットショップ開設サービスであるため、3Dモデルに特化した検索やナビゲーションが不足していると感じることが多くあります。特に、膨大な作品の中から目的に合ったモデルを探す際、絞り込みやソート機能が十分に提供されていないため、ユーザーのニーズに応えきれていない現状があります。
<br><br>
　このような課題を解消するために、より使いやすい3Dモデル専用のプラットフォームを提供することを目指し、このサービスを開発しました。このサービスでは、ランキング表示機能をはじめ、様々な条件での絞り込みやソート機能を実装し、ユーザーが目的のモデルに迅速にたどり着けるよう工夫しています。<br><br>
　本サービスの開発を通じて、3Dモデルの利用者やクリエイターがもっと気軽に、効率的に自分の求めるモデルと出会える環境を提供し、3Dモデル市場全体の活性化に寄与したいと考えています。
<br>
<br>

## 機能

<table>
  <tbody>
    <tr>
      <td width="50%">
        <a href="https://r-vrc.net/ranking" target="_blank" rel="noopener noreferrer">👑ランキング</a>
      </td>
      <td width="50%">
        <a href="https://r-vrc.net/trend" target="_blank" rel="noopener noreferrer">🔥トレンド</a>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <p>前日比で増加したスキ数が多い順でアイテムを表示しています。過去のランキングを見る事も出来ます。</p>
        <img src="https://i.gyazo.com/29fd3574ba21cb2c595b29c7426964eb.gif">
      </td>
      <td>
        <p>7日以内にBOOTHで公開されたアイテムをスキ数順で表示しています。</p>
        <img src="https://i.gyazo.com/9d28360cd244db65145decfd98fa8e3f.gif">
      </td>
    </tr>
    <tr>
      <td width="50%">
        <a href="https://r-vrc.net/folder" target="_blank" rel="noopener noreferrer">📁フォルダ</a>
      </td>
      <td width="50%">
        <a href="https://r-vrc.net/search" target="_blank" rel="noopener noreferrer">🔍️検索</a>
      </td>
    </tr>
    <tr>
      <td>
        <p>ユーザーが公開設定したフォルダを表示しています。</p>
        <img src="https://i.gyazo.com/33945e8221a1ef69ddd2c99147c245e3.gif">
      </td>
      <td>
        <p>スキ数や公開日でフィルタリングしたり、様々な条件でソートが出来ます。</p>
        <img src="https://i.gyazo.com/1ffd71b7e6fa8bddbd2a6ef10e0e4ab1.gif">
      </td>
    </tr>
  </tbody>
</table>
<br>

## 使用技術

- フレームワーク: [Remix](https://remix.run/)
- デプロイ: [Cloudflare Pages](https://www.cloudflare.com/developer-platform/pages/)
- ストレージ: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
- データベース: [Supabase](https://supabase.com/)
- スタイリング: [TailwindCSS](https://tailwindcss.com/)
- 開発環境 [Docker](https://www.docker.com/)
<br>

## インフラ構成図
<img src="https://i.gyazo.com/024bf61b3c2e849af629901c91802747.png">
<br>

## ER図
<img src="https://www.mermaidchart.com/raw/07177631-a5eb-4ee4-bacb-8e1d87d92ae2?theme=light&version=v0.1&format=svg">
<br>

## 画面遷移図
[figma](https://www.figma.com/design/Xx1tCNx0belvOAJ2cOM4pq/rVRC)

## 作者
<a href="https://x.com/shirano_no" target="_blank" rel="noopener noreferrer">Xアカウント</a>
