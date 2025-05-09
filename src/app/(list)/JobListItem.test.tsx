import { render, screen } from '@testing-library/react'

import { JobListItem } from './JobListItem'

vi.mock('@/lib/railway')
vi.mock('@/lib/env')
vi.mock('server-only')

const job = {
  name: 'mock-job',
  command: 'mock cmd',
  id: 'mock-id',
  status: 'idle' as const,
  lastRunAt: new Date('2025-05-01T14:00:00.000Z'),
}

describe('an idle job', () => {
  const idleJob = { ...job, status: 'idle' as const }

  it('has a button to run the job', () => {
    render(<JobListItem job={idleJob} />)
    expect(screen.getByRole('button', { name: 'Run' })).toBeDefined()
  })
})

describe('a running job', () => {
  const runningJob = { ...job, status: 'running' as const }

  it('has no button to run the job', () => {
    render(<JobListItem job={runningJob} />)
    expect(screen.queryByRole('button', { name: 'Run' })).toBeNull()
  })

  it('shows the running status', () => {
    render(<JobListItem job={runningJob} />)
    expect(screen.getByRole('button', { name: /Running job/ })).toBeDefined()
  })
})

describe('with a last run date', () => {
  const ranJob = { ...job, lastRunAt: new Date('2025-05-01T14:00:00.000Z') }

  it('shows the last run date formatted', () => {
    render(<JobListItem job={ranJob} />)
    expect(screen.getByText('5/1/25, 4:00 PM')).toBeDefined()
  })
})

describe('without a last run date', () => {
  const neverJob = { ...job, lastRunAt: null }

  it('shows that it never ran', () => {
    render(<JobListItem job={neverJob} />)
    expect(screen.getByText('Never ran')).toBeDefined()
  })
})
