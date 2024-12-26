export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function cleanTitle(title: string) {
  return (title || '')
    .replace(/\.[^.]*$/, '') // Remove common extensions
    .replace(/_/g, ' ') // Replace underscores with space
    .split(/[.\\-]/) // Split the title into parts, handling different separators
    .filter(
      (part) =>
        part &&
        !/^\d+$/.test(part) && // Remove numeric-only parts
        !part.endsWith('_') && // Remove _ suffix
        !/\./.test(part), // Remove ext
    )
    .map(capitalize) // Capitalize each part
    .join(' '); // Join the remaining ones
}
