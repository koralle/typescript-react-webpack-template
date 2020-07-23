import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import DotEnv from 'dotenv-webpack';
import Sass from 'sass';
import Fiber from 'fibers';

// ビルド後のJSファイルは./dist直下に配置する
// 開発用のWebpack-dev-serverでもこのPathを指定する必要がある
export const outputPath: string = path.resolve(__dirname, 'dist');

// ビルド対象のTSXファイルのエントリーポイント
const entryPointPath: string = path.resolve(__dirname, 'src/index.tsx');

// Html-Webpack-Pluginを通じて出力するindex.htmlのPath
const distEntryPoint: string = path.resolve(__dirname, 'public/index.html');

// エントリーポイントの設定
const entry: webpack.Entry = {
  entry: entryPointPath,
};

// 出力先の設定
const output: webpack.Output = {
  filename: 'js/bundle.js',
  path: outputPath,
};

// モジュール解決の設定
// ここで列挙した拡張子のファイルは、import文を記述するときに拡張子が省略できる。
// 下の例で言うと、./style.scssをimportするときに
// import './style'; とかくとNG
const resolve: webpack.Resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
};

// .ts, .tsxファイルをJSモジュールに変換するための設定
const typeScriptRule: webpack.RuleSetRule = {
  test: /\.(ts|tsx)?$/,
  use: [
    {
      loader: 'ts-loader',
    },
  ],
  exclude: /node_modules/,
};

// .css, .sass, .scssファイルを.cssファイルに変換する手順
const styleUse: webpack.RuleSetUse = [
  // このLoaderの代わりにstyle-loaderを指定すると、
  // .css, .sass, .scssファイルは最終的にJSモジュールに変換する。
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    // CSS内にurl("example.jpg")など画像への参照が含まれる場合
    // その画像もWebpackのバンドルの対象になる。
    // 画像ファイルをBase64エンコードする必要がなければfalseを指定すると良い。
    options: { url: false },
  },
  {
    loader: 'sass-loader',
    options: {
      implementation: Sass, // dart-sassを指している。
      sassOptions: {
        fiber: Fiber, // dart-sassを採用する場合は一緒に使うと良いらしい。
      },
    },
  },
];

// .css, .sass, .scssファイルを.cssファイルに変換する設定
// useは長いので切り分けた
const styleSheetRule: webpack.RuleSetRule = {
  test: /\.(sass|css|scss)$/,
  exclude: /node_modules/,
  use: styleUse,
};

// URLを通じて参照している静的ファイルをJSモジュールに変換する設定
const fileRule: webpack.RuleSetRule = {
  test: /\.(gif|png|jpg|jpeg|svg|ttf|eot|wof|woff|woff2)$/,

  loader: 'url-loader',

  options: {
    // 8KiB以下の画像ファイルはJSモジュールとしてバンドルする
    // それ以外の画像はそのまま画像ファイルとして出力する。
    limit: 8192,
    name: './statics/[name].[ext]',
  },
};

// Ruleをひとまとめに
const rules: webpack.RuleSetRule[] = [typeScriptRule, styleSheetRule, fileRule];

const module: webpack.Module = {
  rules: rules,
};

// プラグインの設定
const plugin: webpack.Plugin[] = [
  new HtmlWebpackPlugin({
    template: distEntryPoint,
    hash: true,
  }),

  // ビルド前に./distの直下を綺麗にする。
  new CleanWebpackPlugin(),

  // CSSは別ファイルとして出力する。
  new MiniCssExtractPlugin({
    filename: 'css/index.css',
  }),
  // .envに記載した環境変数を取り込む
  new DotEnv(),

  // 中間キャッシュを作ってビルド時間を短縮するプラグイン
  // 初回は中間キャッシュを作る
  // 2回目からビルド時間が短縮される
  new HardSourceWebpackPlugin(),
];

// 既定のWebpackの設定
const config: webpack.Configuration = {
  entry: entry,
  output: output,
  module: module,
  resolve: resolve,
  plugins: plugin,
};

export default config;
