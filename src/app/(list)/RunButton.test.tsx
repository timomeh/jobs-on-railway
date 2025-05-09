import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { revalidatePath } from 'next/cache'

import { RunButton } from './RunButton'
import { deployService } from '@/lib/railway'

vi.mock('@/lib/railway')
vi.mock('@/lib/env')
vi.mock('next/cache')
vi.mock('server-only')

it('deploys the service on click and refreshes the page', async () => {
  render(<RunButton serviceId="mocked-service-id" />)
  fireEvent.click(screen.getByRole('button', { name: 'Run' }))

  await waitFor(() => {
    expect(deployService).toHaveBeenCalledWith('mocked-service-id')
  })

  expect(revalidatePath).toHaveBeenCalledWith('/')
})
