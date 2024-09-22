import { screen } from '@testing-library/react';
import React from 'react';

import ErrorPage from '@/pages/error/components/ErrorPage';
import render from '@/utils/test/render';

const navigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return { ...original, useNavigate: () => navigateFn };
});

it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  const { user } = await render(<ErrorPage />);
  const button = await screen.getByRole('button', { name: '뒤로 이동' }); // 뒤로 이동이란 텍스트를 가진 요소 지정.
  await user.click(button);

  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});
