const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // 개발 모드로 설정되어 최적화 없음
  entry: './src/index.js', // 단일 엔트리 포인트
  output: {
    filename: 'bundle.js', // 모든 코드가 하나의 파일로 번들링
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // CSS를 JS에 인라인으로 포함
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
  },
  // Tree shaking 비활성화
  optimization: {
    usedExports: false,
    sideEffects: true, // 모든 파일을 side effect가 있다고 가정
  },
  // 코드 압축 비활성화
  // 중복 제거 최적화 없음
  // 코드 스플리팅 없음
};

// 예상 번들 크기: ~800KB (압축 전)
// 주요 문제점:
// 1. development 모드로 인한 압축 없음
// 2. 단일 번들로 인한 초기 로딩 시간 증가  
// 3. Tree shaking 비활성화로 불필요한 코드 포함
// 4. CSS가 JS에 인라인되어 번들 크기 증가
// 5. vendor 라이브러리와 애플리케이션 코드가 같은 번들에 포함