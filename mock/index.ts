import { defineMock } from '@umijs/max';
import axios from 'axios';
import { createErrorResponse, createResponse } from './utils';

export default defineMock({
  'GET /api/ping': (_req, res) => {
    axios('http://localhost:9999/ping')
      .then((response) => createResponse(res, response.data))
      .catch(() => createErrorResponse(res));
  },
});
