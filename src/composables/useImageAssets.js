/**
 * Vite-based image asset loader.
 *
 * Provides access to eagerly-loaded image assets organized by folder,
 * handling both full paths and filename lookups.
 *
 * @module useImageAssets
 */

const imageModules = {
  investigations: import.meta.glob('@/assets/images/investigations/*', { eager: true, query: '?url', import: 'default' }),
  thumbnails: import.meta.glob('@/assets/images/thumbnails/*.png', { eager: true, query: '?url', import: 'default' })
}

/**
 * Access image assets from a specific folder.
 *
 * @param {string} folder - Folder name ('investigations' or 'thumbnails')
 * @returns {Object} Image utilities
 * @returns {Function} returns.getImageUrl - Get URL for image by filename
 * @returns {Object} returns.images - Map of all images in folder
 *
 * @example
 * const { getImageUrl } = useImageAssets('thumbnails')
 * const url = getImageUrl('project-screenshot.png')
 */
export function useImageAssets(folder) {
  const images = imageModules[folder] || {}

  function getImageUrl(filename) {
    if (!filename) return null

    // Handle both full paths and just filenames
    const fullPath = filename.startsWith('/src/')
      ? filename
      : `/src/assets/images/${folder}/${filename}`

    return images[fullPath] || ''
  }

  return {
    getImageUrl,
    images
  }
}
