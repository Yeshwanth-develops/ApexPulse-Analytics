exports.success = (res, data) => {
  res.json({
    success: true,
    data
  });
};

exports.error = (res, message) => {
  res.status(500).json({
    success: false,
    message
  });
};