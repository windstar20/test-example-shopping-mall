import product from '@/__mocks__/response/product.json';
import ProductCard from '@/pages/home/components/ProductCard';

//*CSF 메타데이터 export default 로 작성함
export default {
  title: '홈/상품 카드', //스토리북 네비게이션 UI에 어떻게 노출될 지 계층을 나타냄. 고유해야 한다. 슬래쉬로 계층 표현 가능.
  component: ProductCard, //렌더링 할 컴포넌트.
  //argTypes: 사용자가 스토리의 컨트롤 스탭에서 값을 변경하며 상태를 확인할 수 있는 데이터
  argTypes: {
    product: {
      control: 'object',
      description: '상품의 정보',
    },
  },
};

//*CSF 각각의 스토리 = named export
//name:  이 field 를 작성하지 않으면, 변수명으로 정의됨.
//args: argTypes와 연관됨. 스토리의 다양한 형태의 값을 동적으로 변경하고 싶을 때 사용.
export const Default = {
  name: '기본',
  args: {
    product,
  },
};

export const LongTitle = {
  args: {
    product: {
      ...product,
      title:
        'Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example',
    },
  },
  name: '타이틀이 긴 경우',
};

export const LongCategoryName = {
  args: {
    product: {
      ...product,
      category: {
        name: 'Long Category Long Category Long Category Long Category',
      },
    },
  },
  name: '카테고리가 긴 경우',
};
