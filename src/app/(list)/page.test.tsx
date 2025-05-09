import { render, screen } from '@testing-library/react'
import { listServices } from '@/lib/railway'

import Page from './page'

vi.mock('@/lib/railway')
vi.mock('@/lib/env')
vi.mock('server-only')
vi.mock('next/navigation')

describe('without jobs', () => {
  beforeEach(() => {
    vi.mocked(listServices).mockResolvedValue([])
  })

  it('renders no list', async () => {
    render(await Page())
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('has a big link to create a new job', async () => {
    render(await Page())
    expect(screen.getByRole('link', { name: /Create a new job/ })).toBeDefined()
  })

  it('renders no button to add another job', async () => {
    render(await Page())
    expect(screen.queryByRole('link', { name: /Add another job/ })).toBeNull()
  })
})

describe('with jobs', () => {
  it('renders a list with the jobs', async () => {
    render(await Page())
    expect(screen.getByRole('list')).toBeDefined()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)

    expect(screen.getAllByRole('listitem')[0].innerHTML).toContain(
      'mock-service',
    )
    expect(screen.getAllByRole('listitem')[1].innerHTML).toContain(
      'mock-service-two',
    )
  })

  it('renders a button to add another job', async () => {
    render(await Page())
    expect(screen.getByRole('link', { name: /Add another job/ })).toBeDefined()
  })
})
