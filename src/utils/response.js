export const jsonResponse = (res, message, data) => {
  return res.json({
    status: "success",
    message,
    data,
  });
};
