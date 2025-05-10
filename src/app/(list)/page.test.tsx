import { render, screen } from '@testing-library/react'
import { listServices } from '@/lib/railway'

import Page from './page'

describe('without jobs', () => {
  beforeEach(() => {
    vi.mocked(listServices).mockResolvedValue([])
  })

  it('renders no list', async () => {
    render(await Page())
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('has a big link to create a new job', async () => {
    render(await Page())
    expect(
      screen.getByRole('link', { name: /Create a new job/ }),
    ).toHaveAttribute('href', '/new')
  })

  it('renders no button to add another job', async () => {
    render(await Page())
    expect(
      screen.queryByRole('link', { name: /Add another job/ }),
    ).not.toBeInTheDocument()
  })
})

describe('with jobs', () => {
  it('renders a list with the jobs', async () => {
    render(await Page())
    expect(screen.getByRole('list')).toBeDefined()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)

    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('mock-service')
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(
      'mock-service-two',
    )
  })

  it('renders a button to add another job', async () => {
    render(await Page())
    expect(
      screen.getByRole('link', { name: /Add another job/ }),
    ).toHaveAttribute('href', '/new')
  })
})
