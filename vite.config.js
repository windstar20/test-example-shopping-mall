import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ exclude: ['/virtual:/**', 'node_modules/**'] })],
  test: {
    globals: true, // vitest 제공하는 api 를 별도의 import 없이 사용 가능.
    environment: 'jsdom', //jsdom 환경
    setupFiles: './src/utils/test/setupTests.js', //테스트가 구동될 때 필요한 라이브러리를 추가하거나, 테스트 실행전후의 필요한 작업설정
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
