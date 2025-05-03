import { DeploymentStatus } from '@/data/list-runbooks'
import { RunButton } from './RunButton'

type Props = {
  name: string
  command: string
  serviceId: string
  status?: DeploymentStatus
}

export function RunbookItem({ name, command, status, serviceId }: Props) {
  return (
    <li>
      {name} – {command} – {status || 'never executed'}
      <RunButton serviceId={serviceId} />
    </li>
  )
}
