import * as UCAN from '@ipld/dag-ucan'
import { bindings, mf, test } from './helpers/setup.js'
import * as Client from '@ucanto/client'
import * as CAR from '@ucanto/transport/car'
import * as CBOR from '@ucanto/transport/cbor'
import * as HTTP from '@ucanto/transport/http'
import { SigningAuthority, Authority } from '@ucanto/authority'

/**
 * @typedef {import('../src/index.js').Service } Service
 */

// const serviceKp = /** @type {UCAN.Issuer & ucans.EdKeypair} */ (
//   ucans.EdKeypair.fromSecretKey(bindings._PRIVATE_KEY)
// )

test.before((t) => {
  t.context = { mf }
})

test('should route correctly to identity/validate', async (t) => {
  const { mf } = t.context

  /** @type {Client.Connection<Service>} */
  const connection = Client.connect({
    encoder: CAR,
    decoder: CBOR,
    channel: HTTP.open({
      url: new URL('http://localhost:8787'),
      fetch: mf.dispatchFetch,
      method: 'POST',
    }),
  })

  const kp = await SigningAuthority.generate()

  const validate = Client.invoke({
    issuer: kp,
    audience: kp,
    capability: {
      can: 'identity/validate',
      with: kp.did(),
    },
  })

  validate.execute(connection)
})

// test('should route correctly to identity/validate', async (t) => {
//   const { mf } = t.context
//   const kp = /** @type {UCAN.Issuer & ucans.EdKeypair} */ (
//     await ucans.EdKeypair.create()
//   )

//   const invocationUcan = await UCAN.issue({
//     issuer: kp,
//     audience: serviceKp,
//     capabilities: [{ with: 'mailto:hugo@dag.house', can: 'identity/validate' }],
//     lifetimeInSeconds: 1000,
//   })

//   const res = await mf.dispatchFetch('http://localhost:8787', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${UCAN.format(invocationUcan)}`,
//     },
//   })
//   const rsp = await res.json()
//   const ucan = UCAN.parse(rsp.value)
//   t.is(rsp.ok, true)
//   t.is(ucan.audience.did(), kp.did())
//   t.is(ucan.issuer.did(), serviceKp.did())
//   t.deepEqual(ucan.capabilities, [
//     { can: 'identity/register', with: 'mailto:hugo@dag.house' },
//   ])
// })

// test('should route correctly to identity/validate and fail with proof', async (t) => {
//   const { mf } = t.context
//   const kp = await ucans.EdKeypair.create()
//   const rootUcan = await ucans.build({
//     audience: kp.did(),
//     issuer: serviceKp,
//     capabilities: [
//       {
//         can: { namespace: 'identity', segments: ['validate'] },
//         with: { scheme: 'mailto', hierPart: '*' },
//       },
//     ],
//     lifetimeInSeconds: 100,
//   })
//   const ucan = await ucans.build({
//     audience: serviceKp.did(),
//     issuer: kp,
//     capabilities: [
//       {
//         can: { namespace: 'identity', segments: ['validate'] },
//         with: { scheme: 'mailto', hierPart: 'alice@mail.com' },
//       },
//     ],
//     lifetimeInSeconds: 100,
//     proofs: [ucans.encode(rootUcan)],
//   })
//   const res = await mf.dispatchFetch('http://localhost:8787', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${ucans.encode(ucan)}`,
//     },
//   })
//   const rsp = await res.json()
//   t.deepEqual(rsp, {
//     ok: false,
//     error: { code: 'Error', message: 'Invalid capability' },
//   })
// })
