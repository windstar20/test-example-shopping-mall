const { create: actualCreate } = await vi.importActual('zustand');
import { act } from '@testing-library/react';

//d __mocks__ 하위에 위치한 파일 -> vitest나 jest 에서 특정 모듈을 자동 모킹할 때 사용된다.
//해당 폴더의 하위에 모킹하고 싶은 모듈을 생성한 뒤 vi.moc 함수를 호출하여
//원하는 모듈 이름을 지정하면 자동으로 모킹된다.

//예제에서는 테스트 환경에 글로벌 설정을 하는 setup 테스트 파일에 vi.moc zustand 를 호출하여
//zustand 모듈을 mocks 하위에 있는 zustand.js 모듈로 모킹했다.

// 앱에 선언된 모든 스토어에 대해 재설정 함수를 저장
const storeResetFns = new Set();

// 스토어를 생성할 때 초기 상태를 가져와 리셋 함수를 생성하고 set에 추가합니다.
export const create = createState => {
  const store = actualCreate(createState); // store 생성.
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// 테스트가 구동되기 전 모든 스토어를 리셋합니다.
// 테스트의 독립성 유지
beforeEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()));
});
