import { renderHook, act } from '@testing-library/react';

import useConfirmModal from './useConfirmModal';
//* react hook 은 컴포넌트 내부에서 호출되어야 한다.
//* 하지만 react testing library 는 hook 을 쉽게 검증할 수 있도록, renderHook 이란 API 를 제공한다.

it('호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.', () => {
  // result: 훅을 호출하여 얻은 결과 값을 반환 -> result.current 값의 참조를 통해 최신 상태를 추적할 수 있다.
  // rerender: 훅을 원하는 인자와 함께 새로 호출하여 상태를 갱신한다.
  const { result, rerender } = renderHook(useConfirmModal);
  expect(result.current.isModalOpened).toBe(false);
});

it('호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.', () => {
  const { result } = renderHook(() => useConfirmModal(true));
  expect(result.current.isModalOpened).toBe(true);
});

it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {
  // act 함수는 상호 작용(렌더링, 이펙트 등..)을 함께 그룹화하고 실행해
  // 렌더링과 업데이트가 실제 앱이 동작하는 것과 유사한 방식으로 동작함.
  // 즉, act 를 사용하면 가상의 돔(jsdom)에 제대로 반영되었다는 가정하에 테스트가 가능해짐.
  // 컴포넌트를 렌더링한 뒤 업데이트 하는 코드의 결과를 검증하고 싶을때 사용.
  // 컴포넌트 렌더링 결과를 jsdom 에 반영하기 위해 act 함수를 반드시 호출해야 함.

  //? 그렇다면 지금까지의 테스트에서 act 를 사용하지 않았는데 통과했는가?
  // 리액트 테스팅 라이브러리의 렌더 함수와 유저 이벤트는 컴포넌트 렌더링, 이벤트 핸들러 처리를 할 때,
  // 내부적으로 act 함수를 호출하여 동작하기 때문이다.

  const { result, rerender } = renderHook(useConfirmModal);
  act(() => {
    result.current.toggleIsModalOpened();
  });
  expect(result.current.isModalOpened).toBe(true);
});
