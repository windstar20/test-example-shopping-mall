import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
export const server = setupServer(...handlers);

//* 공통 설정 파일

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();

  // 모킹된 모의 객체 호출에 대한 히스토리를 초기화
  // 모킹된 모듈의 구현을 초기화하지는 않는다. -> 모킹된 상태로 유지됨
  // -> 모킹 모듈 기반으로 작성한 테스트가 올바르게 실행
  // 반면, 모킹 히스토리가 계속 쌓임(호출 횟수나 인자가 계속 변경) -> 다른 테스트에 영향을 줄 수 있음.
  // 그렇기 때문에 테스트 실행이 끝날때마다 clearAllMocks 함수를 호출하여 히스토리를 초기화하고 있다.
  vi.clearAllMocks();
});

afterAll(() => {
  // 모든 테스트가 종료된 후 모킹 모듈이 더 이상 의미가 없기 때문에 vi.resetAllMock 함수를 호출하여
  // spy 함수에 호출했으나 결과뿐만 아니라 mocking 모듈에 대한 모든 구현을 초기화한다.
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
