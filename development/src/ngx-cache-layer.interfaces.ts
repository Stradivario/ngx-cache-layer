export interface CacheLayerItem<T> {
  key: string;
  data: T;
}

export class CacheServiceConfigInterface {
  deleteOnExpire = 'aggressive';
  cacheFlushInterval: number = 60 * 60 * 1000;
  maxAge: number = 15 * 60 * 1000;
  localStorage: boolean;
}

export interface CacheLayerInterface {
  name: string;
  config?: CacheServiceConfigInterface;
  items?: any;
  customConfigSet?: boolean;
}
