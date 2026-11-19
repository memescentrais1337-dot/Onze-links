/**
 * Resolve caminhos da pasta /public de forma compatível tanto com a raiz (/)
 * quanto com prefixos de subrota (ex.: /onze e /onze/).
 */
const KNOWN_SUBPATH_PREFIXES = ['/onze'];

export function getAppBasePath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  const { pathname } = window.location;
  for (const prefix of KNOWN_SUBPATH_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return `${prefix}/`;
    }
  }

  return '/';
}

export function resolvePublicPath(path: string): string {
  if (!path) return path;

  // Preservar URLs externas, data URIs e blob URIs sem modificação
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const cleanPath = path.replace(/^(\.\/|\/)+/, '');
  return `${getAppBasePath()}${cleanPath}`;
}
