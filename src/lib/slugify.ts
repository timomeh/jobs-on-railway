import sindreSlugify from '@sindresorhus/slugify'

/** Turn any string into a slug. Smol lib facade around sindre's slugify */
export function slugify(str: string) {
  return sindreSlugify(str)
}
