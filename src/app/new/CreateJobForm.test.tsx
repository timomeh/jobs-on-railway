import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { redirect } from 'next/navigation'

import { createJob } from '@/data/jobs'
import { CreateJobForm } from './CreateJobForm'

vi.mock('@/data/jobs', () => ({
  createJob: vi.fn(async () => ({ ok: true })),
}))

it('renders a form with inputs', async () => {
  render(<CreateJobForm />)

  expect(screen.getByRole('form')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /Job Name/ })).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /Command/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument()
})

it('requires all inputs', async () => {
  const user = userEvent.setup()
  render(<CreateJobForm />)

  await user.click(screen.getByRole('button', { name: /Create/ }))

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /Job Name/ }),
    ).toHaveAccessibleDescription('Required')
    expect(
      screen.getByRole('textbox', { name: /Command/ }),
    ).toHaveAccessibleDescription('Required')
  })
})

describe('successfully submitting the form', () => {
  beforeEach(async () => {
    const user = userEvent.setup()
    render(<CreateJobForm />)

    await user.type(
      screen.getByRole('textbox', { name: /Job Name/ }),
      'Example Job Name',
    )
    await user.type(
      screen.getByRole('textbox', { name: /Command/ }),
      'example command',
    )
    await user.click(screen.getByRole('button', { name: /Create/ }))
  })

  it('creates a job', async () => {
    await waitFor(() => {
      expect(createJob).toHaveBeenCalledWith(
        'example-job-name',
        'example command',
      )
    })
  })

  it('redirects back to the job list', async () => {
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/')
    })
  })
})

describe('with an error', () => {
  beforeEach(async () => {
    vi.mocked(createJob).mockResolvedValue({ ok: false, error: 'not_updated' })
    const user = userEvent.setup()
    render(<CreateJobForm />)

    await user.type(
      screen.getByRole('textbox', { name: /Job Name/ }),
      'Example Job Name',
    )
    await user.type(
      screen.getByRole('textbox', { name: /Command/ }),
      'example command',
    )
    await user.click(screen.getByRole('button', { name: /Create/ }))
  })

  it('shows an error message', async () => {
    await screen.findByRole('alert')

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Couldn’t create the job/,
    )
  })

  it('keeps the submitted values in the inputs', async () => {
    await screen.findByRole('alert')

    expect(screen.getByRole('textbox', { name: /Job Name/ })).toHaveValue(
      'Example Job Name',
    )
    expect(screen.getByRole('textbox', { name: /Command/ })).toHaveValue(
      'example command',
    )
  })
})
