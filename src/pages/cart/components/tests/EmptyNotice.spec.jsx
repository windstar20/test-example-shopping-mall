import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

// useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되었는가. - 스파이 함수.
// useNavigate 자체를 spy 함수로 모킹하여 React router dom 모듈의 기존 구현을 대체함.
const navigateFn = vi.fn();

//* vi.mock API
//? 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행.
//? 실행할 때 임포트 된 모듈을 가져오기 전에 실행된다.
vi.mock('react-router-dom', async () => {
  // 한편 우리가 모킹하고 싶은 것은 react 라우터의 모든 구현이 아니라 useNavigate hook만 모킹하는 것이다.
  // 이와 같이 일부 모듈만 모킹하고, 나머지는 기존의 기능을 사용하는 경우, vi.importActual 함수를 사용하여 진행할 수 있다.

  const original = await vi.importActual('react-router-dom');
  return { ...original, useNavigate: () => navigateFn };
});
it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate 함수가 호출된다', async () => {
  const { user } = await render(<EmptyNotice />);
  await user.click(screen.getByText('홈으로 가기'));
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});
