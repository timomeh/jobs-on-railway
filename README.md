# One-off jobs on Railway

A small app to manage and run one-off jobs in your Railway project.

Features:
- Create one-off jobs
- Automatically configures a new service as a one-off job
- Run one-off jobs with a single click
- Runs jobs with a custom dockerfile (see `scripts/Dockerfile`)

## Deploy

Deploy this repo into your Railway project to create and manage jobs. Configure the required environment variables (see `.env`).

**Warning:**
- This is a proof of concept. Use on your own risk.
- There is no authentication. Deploy behind an authenticated proxy.

## Contributing

This is a [Next.js][nextjs] app. You need:

- Node.js
- pnpm (via corepack)

First install dependencies:

```bash
pnpm i
```

The duplicate the `.env` file to `.env.local` and fill in the values.

Finally, run the development server:

```bash
pnpm dev
```

Run tests with [vitest][vitest]:

```bash
pnpm test
```

[nextjs]: https://nextjs.org/docs/app/
[vitest]: https://vitest.dev/guide/