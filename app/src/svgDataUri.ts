// Builds a data: URI for an inline SVG placeholder, safe to use inside a CSS `url(...)` (which is not
// quoted by the framework's background-image helpers). `encodeURIComponent` leaves "(" and ")" (and a
// few other characters) unescaped, and any of those in the SVG — e.g. from an "rgba(...)" color — closes
// the CSS url() early, silently breaking the image. Escaping them here keeps the URI safe wherever it's used.
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg).replace(/\(/g, '%28').replace(/\)/g, '%29')}`
}
