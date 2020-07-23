import { merge } from 'webpack-merge';
import base, { outputPath } from './webpack.base.config';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Webpack-dev-Serverの設定
const devServer: WebpackDevServer.Configuration = {
  hot: true,
  open: true, // サーバー起動時にブラウザを開く
  publicPath: '/',
  contentBase: outputPath,
  watchContentBase: true,
  host: '0.0.0.0',
  port: 3030,
  compress: true, // GZIP圧縮
  historyApiFallback: true,
};

const devPlugins: webpack.Plugin[] = [new BundleAnalyzerPlugin()];

// 開発用のWebpackの設定
const devConfig: webpack.Configuration = merge(base, {
  mode: 'development',
  devtool: '#inline-source-map',
  devServer: devServer,
  plugins: devPlugins,
});

export default devConfig;
