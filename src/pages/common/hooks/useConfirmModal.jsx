import { useState } from 'react';

//* 테스트 확인 위한 세 가지.
// 1. 호출 시 initialValue 인자를 지정하지 않은 경우 isModalOpened 상태가 false 로 설정된다.
// 2. 호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.
// 3. toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle 된다.
const useConfirmModal = (initialValue = false) => {
  const [isModalOpened, setIsModalOpened] = useState(initialValue);

  const toggleIsModalOpened = () => {
    setIsModalOpened(!isModalOpened);
  };

  return {
    toggleIsModalOpened,
    isModalOpened,
  };
};

export default useConfirmModal;
