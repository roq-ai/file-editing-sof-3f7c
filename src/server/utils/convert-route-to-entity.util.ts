const mapping: Record<string, string> = {
  companies: 'company',
  files: 'file',
  permissions: 'permission',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
