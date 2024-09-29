import { screen } from '@testing-library/react';
import { vi } from 'node_modules/vitest/dist/index';
import React from 'react';

import ProductFilter from '@/pages/home/components/ProductFilter';
import { mockUseFilterStore } from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

//spy 함수 mocking: filter store 에서 가져온 setminprice, setMaxPrice 액션 호출 여부 판단 위해
const setMinPriceFn = vi.fn();
const setMaxPriceFn = vi.fn();
const setTitleFn = vi.fn();

beforeEach(() => {
  mockUseFilterStore({
    setMinPriceFn: setMinPriceFn,
    setMaxPriceFn: setMaxPriceFn,
    setTitleFn: setTitleFn,
  });
});

it('카테고리 목록을 가져온 후 카테고리 필드의 정보들이 올바르게 렌더링된다.', async () => {
  await render(<ProductFilter />);
  // expect(screen.getByLabelText('category1')).toBeInTheDocument();
  // 카테고리 데이터는 API를 통해 비동기 프로미스로 데이터를 가져온다.
  expect(await screen.findByLabelText('category1')).toBeInTheDocument();
  expect(await screen.findByLabelText('category2')).toBeInTheDocument();
  expect(await screen.findByLabelText('category3')).toBeInTheDocument();
});

it('상품명을 수정하는 경우 setTitle 액션이 호출된다.', async () => {
  const { user } = await render(<ProductFilter />);
  const textInput = screen.getByLabelText('상품명');
  //test 라는 문자열을 입력하도록 시뮬레이션
  await user.type(textInput, 'test');
  expect(setTitleFn).toHaveBeenCalledWith('test');
});

it('카테고리를 클릭 할 경우의 클릭한 카테고리가 체크된다.', async () => {
  // 라디오 클릭 -> setCategoryId -> categoryId state 변경 -> 선택된 라디오 값 변경
  const { user } = await render(<ProductFilter />);
  const category3 = await screen.findByLabelText('category3');
  await user.click(category3);
  expect(category3).toBeChecked();
});

it('최소 가격 또는 최대 가격을 수정하면 setMinPrice과 setMaxPrice 액션이 호출된다.', async () => {
  const { user } = await render(<ProductFilter />);
  const minPriceTextInput = screen.getByPlaceholderText('최소 금액');
  await user.type(minPriceTextInput, '1');

  expect(setMinPriceFn).toHaveBeenCalledWith('1');

  const maxPriceTextInput = screen.getByPlaceholderText('최대 금액');
  await user.type(maxPriceTextInput, '2');

  expect(setMaxPriceFn).toHaveBeenCalledWith('2');
});
