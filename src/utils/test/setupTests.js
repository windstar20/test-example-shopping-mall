import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
//* msw의 setupServer 를 사용하여 리퀘스트 핸들러들을 설정하고 msw 서버를 구동할 준비.

//초기에 구동을 위해 설정한 msw 서버 인스턴스와 동일한 인스턴스를 사용해야
//기존에 모킹된 API의 응답을 변경할 수 있음
export const server = setupServer(...handlers);

//* msw 설정 적용
//* 테스트 환경에 API 호출은 msw의 핸들러에 설정한 응답으로 모킹
//* 장점
// msw 를 사용하면 실제 API를 호출하지 않고 빠르고 효율적으로 응답 데이터를 변경하며, 테스트를 실행할 수 있음
// API 서버에 의존하지 않으므로 외부 요인의 영향 없이 일관적인 환경에서 테스트 실행 가능
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});

vi.mock('zustand');

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
