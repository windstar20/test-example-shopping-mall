import { rest } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

export const handlers = [
  ...[
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),
  //? 테스트 환경에서 어떻게 mocking data 가 연동되는가?
  //* 먼저 테스트 환경에서 상품 목록 조회 API 요청이 실행되면 MSW 에서 요청을 가로챈다.
  //* product.json 에 정의한 상품 목록 데이터를 페이징 단위로 잘라 실제 API 응답처럼 가공하여 반환함.
  rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
    //* 상품 목록 데이터는 서버에서 페이징 단위로 데이터를 잘라 반환해 준다.
    //* API 요청 URL의 offset query parameter 를 사용하여 모킹 데이터를 원하는 구간의 데이터로 잘라 MSW 에서 반환해 준다.
    const data = response[apiRoutes.products];
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));
    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    //* 최종적으로 정상 결과임을 명시하기 위해 HTTP status 를 200으로 설정
    //* products : 페이징으로 잘라진 상품 목록 데이터
    //* lastPage : 마지막 페이지 여부
    //* mock data : products.json 에 정의되어 있음
    return res(
      ctx.status(200),
      ctx.json({ products, lastPage: data.products.length <= offset + limit }),
    );
  }),
  rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.users}`, (req, res, ctx) => {
    if (req.body.name === 'FAIL') {
      return res(ctx.status(500));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.login}`, (req, res, ctx) => {
    if (req.body.email === 'FAIL@gmail.com') {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'access_token',
      }),
    );
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.log}`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
