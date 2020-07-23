import { merge } from 'webpack-merge';
import base from './webpack.base.config';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

// 本番用のWebpackの最適化設定
const prodOptimization: webpack.Options.Optimization = {
  minimizer: [
    new TerserPlugin({
      // コメントを全て削除する
      extractComments: 'all',
      terserOptions: {
        // 圧縮時にconsole.log()を全て削除する
        compress: { drop_console: true },
      },
    }),
    // 本番用ビルド時のCSS圧縮プラグイン
    new OptimizeCSSAssetsPlugin(),
  ],
};

// 本番用のWebpackの設定
const prodConfig: webpack.Configuration = merge(base, {
  mode: 'production',
  optimization: prodOptimization,
});

export default prodConfig;
