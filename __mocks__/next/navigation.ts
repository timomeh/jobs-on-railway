export const redirect = vi.fn(() => {
  throw new Error('NEXT_REDIRECT')
})

export const useRouter = vi.fn(() => ({
  refresh: vi.fn(),
}))
