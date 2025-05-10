import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { revalidatePath } from 'next/cache'

import { RunButton } from './RunButton'
import { deployService } from '@/lib/railway'

it('deploys the service on click and refreshes the page', async () => {
  const user = userEvent.setup()
  render(<RunButton serviceId="mocked-service-id" />)

  await user.click(screen.getByRole('button', { name: 'Run' }))

  await waitFor(() => {
    expect(deployService).toHaveBeenCalledWith('mocked-service-id')
  })
  expect(revalidatePath).toHaveBeenCalledWith('/')
})
