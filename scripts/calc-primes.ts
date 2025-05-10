// This is an example script to simulate a job command.

// ChatGPT generated

const COUNT = 50 // Number of primes to generate
const WORK_DELAY_MS = 100 // Delay between each prime computation step

function isPrime(n: number) {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  const limit = Math.sqrt(n)
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false
  }
  return true
}

async function runJob() {
  console.log(`Prime job started at ${new Date().toISOString()}`)
  console.log(`Generating ${COUNT} primes`)

  const primes: number[] = []
  let num = 2
  while (primes.length < COUNT) {
    if (isPrime(num)) {
      primes.push(num)
      console.log(`Found prime #${primes.length}: ${num}`)
      await new Promise((resolve) => setTimeout(resolve, WORK_DELAY_MS))
    }
    num++
  }

  console.log(`Successfully generated ${COUNT} primes.`)
  console.log(`Primes: ${primes.join(', ')}`)
  console.log(`Job completed at ${new Date().toISOString()}`)
}

runJob().catch((err) => {
  console.error('Job failed with error:', err)
  process.exit(1)
})
