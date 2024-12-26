export const createResponse = (res: any, data: any) => {
  res.json({
    success: true,
    data,
  });
};

export const createErrorResponse = (
  res: any,
  message = 'Internal Server Error',
  errorCode = 1,
) => {
  res.status(500).json({
    success: false,
    message,
    errorCode,
  });
};
