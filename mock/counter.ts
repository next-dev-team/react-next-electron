import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/counter': (_req, res) => {
    res.json({
      success: true,
      data: {},
      errorCode: 0,
    });
  },
});
