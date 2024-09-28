import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://user-images.githubusercontent.com/35371660/230712070-afa23da8-1bda-4cc4-9a59-50a263ee629f.png',
          'https://user-images.githubusercontent.com/35371660/230711992-01a1a621-cb3d-44a7-b499-20e8d0e1a4bc.png',
          'https://user-images.githubusercontent.com/35371660/230712056-2c468ef4-45c9-4bad-b379-a9a19d9b79a9.png',
        ],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 442,
        description:
          'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
        images: [
          'https://user-images.githubusercontent.com/35371660/230762100-b119d836-3c5b-4980-9846-b7d32ea4a08f.png',
          'https://user-images.githubusercontent.com/35371660/230762118-46d965ab-7ea8-4e8a-9c0f-3ed90f96e1cd.png',
          'https://user-images.githubusercontent.com/35371660/230762139-002578da-092d-4f34-8cae-2cf3b0dfabe9.png',
        ],
        count: 4,
      },
    },
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);

  //상품데이터는 테이블 형태이므로 각 테이블에 해당하는 요소를 조회해야함.
  //이때 테이블의 행은 row 라는 role 로 조회할 수 있다.
  const [firstItem, secondItem] = screen.getAllByRole('row');
  //이제 각 테이블 행별로 설정한 상품 mock 데이터가 잘 렌더링 되는지만 확인하면 테스트 완료됨.
  //firstItem 을 대상으로 상품명이나 가격 정보가 잘 나오는지 확인해야 한다.
  //조회한 요소를 기준으로 react testing library query 를 사용하고 싶다면 widthin 함수를 사용함.
  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();
  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4');
  expect(within(secondItem).getByText('$1,768.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  // 컴포넌트 렌더링
  const { user } = render(<ProductInfoTable />);
  //모든 상품 로우 요소 조회 => 첫 번째, 두번째 아이템
  const [firstItem] = screen.getAllByRole('row');
  //'textbox' 역할을 가진 요소 조회
  const input = within(firstItem).getByRole('textbox');
  //수량 변경 시뮬레이션

  await user.clear(input);
  await user.type(input, '5');

  // 2427 + 809 * 2 = 4045
  expect(screen.getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  //alert 함수를 대체할 spy 함수를 만든다.
  const alertSpy = vi.fn();
  //alert spy 를 호출하려면 window.alert 을 호출해야 한다.
  // window.alert -> alertSpy 로 대체
  vi.stubGlobal('alert', alertSpy);

  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');
  await user.clear('input');
  await user.type(input, '1000');
  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);

  const [, secondItem] = user.getAllByRole('row');
  const deleteButton = within(secondItem).getByRole('button');

  //삭제 버튼을 클릭하기 전에 두 번째 아이템이 존재하는지 단언.
  expect(screen.getByText('Awesome Concrete Shirt')).toBeInTheDocument();
  await user.click(deleteButton);

  //삭제되었는지 확인.
  // queryBy~~ : 요소의 존재 유무 판단. getByText와 다르게 요소가 존재하지 않아도 에러를 던지지 않음.
  expect(screen.queryByText('Awesome Concrete Shirt')).not.toBeInTheDocument();
});
