import { listRunbooks } from '@/data/list-runbooks'
import { CreateRunbookForm } from './_create/CreateRunbookForm'
import { RunbookItem } from './_item/RunbookItem'

export default async function Home() {
  const services = await listRunbooks()

  return (
    <div>
      <h1>Runbooks</h1>
      <hr />

      <h2>Create</h2>
      <CreateRunbookForm />
      <hr />

      <h2>List</h2>
      {services.length === 0 && <div>None yet!</div>}

      {services.length > 0 && (
        <ul>
          {services.map((service) => (
            <RunbookItem
              key={service.name}
              name={service.name}
              command={service.command}
              status={service.status}
              serviceId={service.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
