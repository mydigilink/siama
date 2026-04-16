import NodeCache from 'node-cache';

export const cache = new NodeCache({
  stdTTL: 60, // 1 min
  checkperiod: 120
});

// helper to clear all service cache
export const clearServiceCache = () => {
  const keys = cache.keys().filter(k => k.startsWith('services'));
  keys.forEach(k => cache.del(k));
};