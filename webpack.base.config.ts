import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import DotEnv from 'dotenv-webpack';

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
  filename: 'bundle.js',
  path: outputPath,
};

// モジュール解決の設定
const resolve: webpack.Resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
};

// TypeScriptの変換の設定
const typeScriptRule: webpack.RuleSetRule = {
  test: /\.(ts|tsx)?$/,
  use: [
    {
      loader: 'ts-loader',
    },
  ],
  exclude: /node_modules/,
};

// CSSの設定
const styleSheetRule: webpack.RuleSetRule = {
  test: /\.(sass|css|scss)$/,
  exclude: /node_modules/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: { url: true },
    },
    'sass-loader',
  ],
};

// ファイルの変換の設定
const fileRule: webpack.RuleSetRule = {
  test: /\.(gif|png|jpg|jpeg|svg|ttf|eot|wof|woff|woff2)$/,

  loader: 'url-loader',

  options: {
    // 20KiB以下の画像ファイルはJSにバンドルする
    limit: 20480,
    name: './images/[name].[ext]',
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
    filename: 'index.css',
  }),
  // .envに記載した環境変数を取り込む
  new DotEnv(),
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
