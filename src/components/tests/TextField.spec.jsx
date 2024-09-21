import { screen } from '@testing-library/react';
import React from 'react';
import { expect } from 'vitest';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

it('className props으로 설정한 css class가 적용된다.', async () => {
  /* give, when, then 등의 다른 패턴도 있음.
   * [1] Arrange - 테스트를 위한 환경 만들기
   * -> className 을 지닌 컴포넌트 렌더링
   * [2] Act - 테스트할 동작 발생
   * -> 렌더링에 대한 검증이기 때문에 이 단계 생략
   * -> 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 해당됨.
   * [3] Assert - 올바른 동작이 실행되었는지 검증
   * -> 렌더링 후 DOM에 해당 class 가 존재하는지 검증
   */

  // render API를 호출 -> 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영
  // jsDOM: Node.js 에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
  await render(<TextField className={'my-class'} />);

  // vitest의 expect 함수를 사용하여 기대 결과 검증.

  // className 이란 내부 prop이나 state 값을 검증하는 것이 아니라,
  // 렌더링되는 DOM 구조가 올바르게 변경되었는지 확인해야 한다. 최종적으로 사용자가 보는 결과는 DOM이기 때문.
  // expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
  //   'my-class',
  // );

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
  screen.debug();

  expect(textInput).toHaveClass('my-class');
});
/*
// it -> test 함수의 alias 이다. 기능상의 차이는 없다.
// it(should ~~~~)
// test(if~~~~~)
// describe 함수는 테스트를 그룹화해서 새로운 블럭, 즉 컨텍스트를 만드는 역할을 한다. 원하는 테스트들을 묶어서 최상위가 아닌 독립된 컨텍스트를 만들어 그룹화 가능.
 */

describe('placeholder', () => {
  test('기본 placeholder "텍스트를 입력해 주세요"가 노출된다.', async () => {
    // it 함수 내부에는 기대 결과 코드를 작성한다.
    await render(<TextField />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    screen.debug();
    expect(textInput).toBeInTheDocument();
    //단언 = assertion : 테스트가 통과하기 위한 조건 서술. -> 검증 실행.
  });

  //TextField 의 Prop 검증
  it('placeholder props에 따라 placehoolder가 변경된다.', async () => {
    await render(<TextField placeholder={'상품명을 입력해 주세요.'} />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });
});
