type RulesConfig = {
  [key: string]: { exclude: string[] };
};
export const rules: RulesConfig = { 'v2ex.com': { exclude: ['/recent'] } };
