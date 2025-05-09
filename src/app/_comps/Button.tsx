type Props = {
  children: React.ReactNode
}

export function SolidButton({ children }: Props) {
  return (
    <div
      className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-md
        bg-fuchsia-700 px-3 py-2 text-center text-sm font-semibold text-white transition
        *:shrink-0 not-in-disabled:hover:bg-fuchsia-600 active:translate-y-px
        in-disabled:text-fuchsia-300 *:[svg]:size-4"
    >
      {children}
    </div>
  )
}
