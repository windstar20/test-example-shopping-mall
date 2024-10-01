/** @type { import('@storybook/react').Preview } */
import { withRouter } from 'storybook-addon-react-router-v6';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import { handlers } from '../src/__mocks__/handlers';
import withRHF from './withRHF';

import 'swiper/css';
import 'swiper/css/navigation';

const queryClient = new QueryClient();
initialize({
  onUnhandledRequest: 'bypass',
});

const preview = {
  parameters: {

    actions: { argTypesRegex: '^on[A-Z].*' }, //actions: 이벤트 핸들러 실행 시 받은 데이터를 스토리에 표시하는 역할
    controls: { //controls: 스토리북 arguments를 동적으로 바꿔가며 인터랙션 하도록 돕는 기능
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    //msw에서 사용할 핸들러를 작성
    msw: {
      handlers,
    },
  },
  //decorators : 스토리를 렌더링할 때 특정 컴포넌트로 감싸거나, sibling 컴포넌트를 추가하는 설정할 때 사용.
  //특정 React context, root component 로 감싸서 렌더링할 때 유용.
  decorators: [
    withRouter,
    //msw 스토리에서 네트워크 요청을 보낼 때 MSW가 API를 가로채 작성한 응답을 기반으로 렌더링시킴.
    mswDecorator,
    withRHF(false),
    Story => (
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
