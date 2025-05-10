import { JSX } from 'react'
import { CircleAlertIcon } from 'lucide-react'

type GroupProps = {
  children: React.ReactNode
  error?: boolean
}

function Group({ children, error }: GroupProps) {
  return (
    <div aria-invalid={error} className="group/input w-full">
      {children}
    </div>
  )
}

type LabelProps = JSX.IntrinsicElements['label'] & {
  required?: boolean
}

function Label(props: LabelProps) {
  const { children, required, ...rest } = props

  return (
    <label {...rest} className="mb-2 block text-sm font-semibold text-white/80">
      {children}
      {required && <span className="text-red-400">&nbsp;*</span>}
    </label>
  )
}

type HintProps = {
  id: string
  children?: React.ReactNode
}

function Hint({ id, children }: HintProps) {
  return (
    <p id={`${id}-description`} className="mt-2 text-sm text-white/60">
      {children}
    </p>
  )
}

type ErrorProps = {
  id: string
  children?: React.ReactNode
}

function Error({ id, children }: ErrorProps) {
  if (!children) return null

  return (
    <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
      {children}
    </p>
  )
}

type FieldProps = JSX.IntrinsicElements['input'] & {
  error?: boolean
}

function Field({ error, ...rest }: FieldProps) {
  return (
    <div className="grid grid-cols-1">
      <input
        {...rest}
        aria-describedby={error ? `${rest.id}-error` : `${rest.id}-description`}
        className="col-start-1 row-start-1 block w-full rounded-md border-white/20 bg-white/5 px-3
          py-1.5 text-base text-white group-aria-invalid/input:border-red-400
          placeholder:text-white/40 focus:border-white/50 focus:ring-0"
      />
      <CircleAlertIcon
        aria-hidden
        className="pointer-events-none col-start-1 row-start-1 mr-3 hidden size-5 self-center
          justify-self-end text-red-300 group-aria-invalid/input:block"
      />
    </div>
  )
}

export const Input = {
  Group,
  Label,
  Field,
  Hint,
  Error,
}
