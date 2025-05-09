import { SpinIcon } from './SpinIcon'

type Props = {
  loading?: boolean
  label?: React.ReactNode
  children?: React.ReactNode
}

export function LoadingLabel({ loading, label, children }: Props) {
  if (loading) {
    return (
      <>
        <SpinIcon />
        <span role="status" aria-busy>
          {label || 'Loading…'}
        </span>
      </>
    )
  }

  return <>{children}</>
}
