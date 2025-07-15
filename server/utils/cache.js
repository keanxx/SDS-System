const cache = {};

function getCache(key) {
  return cache[key] || null;
}

function setCache(key, value, ttl = 300000) { // 5 minutes default TTL
  cache[key] = value;
  setTimeout(() => delete cache[key], ttl);
}

module.exports = { getCache, setCache };
