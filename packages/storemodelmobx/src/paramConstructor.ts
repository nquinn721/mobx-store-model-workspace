export interface SearchParams {
  [key: string]: any;
}

export const ParamConstructor: SearchParams = {
  join(str: any) {
    if (typeof str === 'object') return `join=${str.join('&join=')}`;
    return `join=${str}`;
  },

  limit(str: any) {
    return `limit=${str}`;
  },

  sort(str: any) {
    return `sort=${str}`;
  },
  filter(str: any) {
    return `filter=${JSON.stringify(str).replace(/"/g, '')}`;
  },
  s(str: any) {
    return `s=${JSON.stringify(str)}`;
  },
};
