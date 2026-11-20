export const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockResponse(payload, ms = 350) {
  await wait(ms)
  return payload
}
