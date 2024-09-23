import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

describe('debounce', () => {
  // 타이머 모킹 -> 0.3초 흐른것으로 타이머 조작 -> spy 함수 호출 확인
  beforeEach(() => {
    // teardown 에서 특정 모듈에 대해 모킹한 경우, 테스트 종료 후에 teardown 에서 모킹 초기화를 해야한다.
    vi.useFakeTimers();
  });


  afterEach(() => {
    vi.useRealTimers();
  })

  it('특정 시간이 지난 후 함수가 호출된다.', () => {
    const spy = vi.fn();

    const debounceFn = debounce(spy, 300);
    debounceFn();

    // debounceFn 함수를 호출하고, 지정한 0.3초후 타이머가 지난 후 콜백으로 넘긴 스파이 함수가 호출되는지 검증.
    // 테스트에 실패하는 이유는?
    // 기본적으로 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행됨.
    // 비동기 함수가 실행되기 전에 단언이 실행되어 의도한대로 동작하지 않음.
    // 그렇기 때문에 테스트에서는 0.3 초만큼 딜레이를 해야만 검증가능하다.
    // => 타이머를 모킹하자.
    //* => useFakerTimers 함수를 호출하자.
    // 디바운드 함수의 모든 기능은 타이머에 의존하기에, vi.useFakeTimers 함수를 항상 호출하여 모킹 해야 한다.
    // discribe 블럭 내에 beforeitcsetup 함수를 지정하여 테스트 실행 전에 항상 타이머를 모킹하도록 설정 가능.

    //* 타이머의 시작을 조작하는 API advanceTimersByTime.
    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalled();
  });

  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.', () => {
    const spy = vi.fn();
    const debouncedFn = debounce(spy, 300);

    // 0.1초후 호출
    vi.advanceTimersByTime(100);
    debouncedFn();

    // 0.2초후 호출
    vi.advanceTimersByTime(200);
    debouncedFn();

    // 0.3초후 호출
    vi.advanceTimersByTime(300);
    debouncedFn();

    // 다섯번을 호출했지만 실제 spy 함수는 단 한번만 호출된다.
    // debounce 함수가 업데이트 되는 시간을 0.3 초로 지정했기 때문이다.
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
