import { screen, within } from '@testing-library/react';
import React from 'react';

import data from '@/__mocks__/response/products.json';
import ProductList from '@/pages/home/components/ProductList';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

const PRODUCT_PAGE_LIMIT = 5;

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      state: {
        prevPath: 'prevPath',
      },
    }),
  };
});

it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  // 컴포넌트 렌더링
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  //? product card data-testid 를 사용하여 모든 상품 카드 조회(실패)
  // 테스트 코드는 동기적으로 실행되어, 기본적으로 promise 를 반환하거나 비동기 동작 코드는 실행되지 않는다.
  // 상품 목록을 가져오는 API 호출 역시 서버에서 데이터를 가져오는 promise 를 반환.
  // 그렇기 때문에 테스트 코드는 promise 를 반환하는 API 응답이 완료될때까지 기다리지 않고 끝나버리기 때문.
  // const productCards = screen.getAllByTestId('product-card');
  // 1초 동안 50ms마다 요소가 있는지 조회. 설정시간 옵션으로 변경가능.
  const productCards = await screen.findAllByTestId('product-card');
  //5개의 프로덕트 카드가 나타나는지 단언
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  //? 가져온 productCard의 상품명, 카테고리, 가격과 장바구니 구매 버튼이 제대로 렌더링 되는지 확인
  //반복적인 데이터 포맷을 기준으로 검증 forEach
  productCards.forEach((el, index) => {
    const productCard = within(el);
    const product = data.products[index];
    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(
      productCard.getByText(formatPrice(product.price)),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '장바구니' }),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '구매' }),
    ).toBeInTheDocument();
  });
});

it('보여줄 상품 리스트가 더 있는 경우 [show more] 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  //Show more 버튼의 노출 여부는 API에서 상품 목록 데이터를 가져와 렌더링 된 후에 알 수 있다.
  //더이상 보여줄 상품 목록이 있는지 여부를 API의 응답 결과를 가지고 확인하기 때문.
  //findByQuery 를 사용하여 첫 페이지에 해당하는 상품목록이 렌더링 되는걸 기다린 후
  //show more 버튼이 나타나는지 확인해야 정확한 테스트가 됨
  await screen.findAllByTestId('product-card');
  // show more 버튼이 정상적으로 나타나는지 확인
  expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();

  const moreBtn = screen.getByRole('button', { name: 'Show more' });
  await user.click(moreBtn);

  //상품 카드 개수가 5개에서 10개로 바뀌었는지 단언
  const productCards = await screen.findAllByTestId('product-card');
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT * 2);
});

it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // 모킹 데이터 20개보다 많은 수 50으로 limit 고정
  await render(<ProductList limit={50} />);
  //findBy 쿼리를 사용하여 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야 함
  await screen.findAllByTestId('product-card');
  // queryByText 즉, query by query 를 사용해야 DOM 요소가 없을 때도 에러가 발생하지 않고 정상적으로 단언할 수 있다.
  expect(screen.queryByText('Show more')).not.toBeInTheDocument();
});

describe('로그인 상태일 경우', () => {
  beforeEach(() => {
    //테스트 실행 전에 로그인을 실행한 상태로 만들어줌. 가짜 정보로 항상 로그인.
    mockUseUserStore({ isLogin: true, user: { id: 10 } });
  });

  it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
    //프로덕트 리스트 컴포넌트에서는 실제 장바구니에 상품이 추가되었는지 알 수 없다.
    //그러므로 addCarItemAction 을 spy 함수로 대체하여 호출 여부를 검증.
    //통합 테스트에서 다른 페이지의 로직을 검증할 수 없으므로 모킹 작업이 필요할 때가 있다.
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    //addCartItemFn 이 원하는 인자와 한번 호출되었는지 단언
    expect(addCartItemFn).toHaveBeenNthCalledWith(
      1,
      data.products[productIndex],
      10,
      1,
    );
    //navigateFn spy 함수를 사용하여 장바구니 페이지로 이동하는지 단언
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
  });

  it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    const product = data.products[productIndex];
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
    expect(
      screen.getByText(`${product.title} 장바구니 추가 완료!`),
    ).toBeInTheDocument();
  });
});

describe('로그인이 되어 있지 않은 경우', () => {
  it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });

  it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });
});

it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  const [firstProduct] = await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  await user.click(firstProduct);

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/5');
});
