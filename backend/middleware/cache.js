const cache = new Map();

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

const cacheMiddleware = (req, res, next) => {

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.json(cached.data);
  }

  res.sendResponse = res.json;

  res.json = (body) => {

    if (res.statusCode < 400) {
      cache.set(key, {
        data: body,
        timestamp: Date.now()
      });
    }

    res.sendResponse(body);
  };

  next();
};

module.exports = cacheMiddleware;