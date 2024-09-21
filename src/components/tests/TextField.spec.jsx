import { screen } from '@testing-library/react';
import React from 'react';
import { expect } from 'vitest';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

beforeEach(async () => {
  console.log(`root  = `, 'beforeEach');
  // await render(<TextField className={'my-class'} />);
});
// beforeAll(() => {
//   console.log(`root  = `, 'beforeAll');
// });
// afterAll(() => {
//   console.log(`root  = afterAll`);
// });
// afterEach(() => {
//   console.log(`root  = afterEach`);
// });
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
  beforeEach(() => {
    console.log(`describe  = `, 'beforeEach');
  });
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

  it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn(); //스파이 함수
    // 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지, 어떤 값을 반환하는지 등
    // 다양한 값을 저장하고 있다.
    // 보통 콜백함수나 이벤트 핸들러가 올바르게 호출되었는지 검증할 때 spy 사용한다.

    const { user } = await render(<TextField onChange={spy} />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    await user.type(textInput, 'test');
    // 텍스트 인풋에 test 라는 텍스트를 입력하는 것처럼 시뮬레이션 가능
    // type 함수는 내부적으로 킷다운 이벤트를 발생시킴.
    expect(spy).toHaveBeenCalledWith('test');
    //toHaveBeenCalledWith : 스파이 함수가 올바르게 호출되었는지 확인하는 매처
  });
  it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn(); //스파이 함수
    const { user } = await render(<TextField onEnter={spy} />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    await user.type(textInput, 'test{Enter}'); //중괄호 열고 Enter 를 누르면 엔터키 입력으로 작성한다.

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('포커스가 활성화되면 onFocus props으로 등록한 함수가 호출된다.', async () => {
    // 포커스 활성화 방법
    // 탭 키, 클릭, textInput.focus() 실행 : 이 중에서 선택해야 한다.
    const spy = vi.fn();
    const { user } = await render(<TextField onFocus={spy} />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    await user.click(textInput);
    expect(spy).toHaveBeenCalled(); //focus 함수는 아무런 인자를 갖지 않음.
  });
  it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
    const { user } = await render(<TextField />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    await user.click(textInput);
    expect(textInput).toHaveStyle({
      borderWidth: 2,
      borderColor: 'rgb(25, 118, 210)',
    });
  });
});
