export const redirect = vi.fn()

export const useRouter = vi.fn(() => ({
  refresh: vi.fn(),
}))
