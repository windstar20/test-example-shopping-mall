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
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'my-class',
  );
});
