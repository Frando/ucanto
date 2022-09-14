import { CID } from 'multiformats'
import * as API from '@ucanto/interface'

/**
 * @template {number} Code
 * @template {number} Alg
 * @param {Code} code
 * @param {API.MultihashDigest<Alg>} digest
 * @return {API.Link<unknown, Code, Alg>}
 */
export const create = (code, digest) =>
  /** @type {any} */ (CID.createV1(code, digest))

/**
 * @template {number} Alg
 * @param {API.MultihashDigest<Alg>} digest
 * @return {API.Link<unknown, 0x70, Alg, 0>}
 */
export const createV0 = digest => /** @type {any} */ (CID.createV0(digest))

/**
 * Type predicate returns true if value is the link.
 *
 * @template {API.Link} L
 * @param {unknown} value
 * @returns {value is L}
 */
export const isLink = value =>
  value != null && /** @type {{asCID: unknown}} */ (value).asCID === value

export const asLink =
  /** @type {<L extends API.Link<unknown, number, number, API.UCAN.CIDVersion>>(value:L|unknown) => L|null} */
  (CID.asCID)

export const parse =
  /** @type {<P extends string>(source:string, base?:API.MultibaseDecoder<P>) => API.Link<unknown, number, number, API.UCAN.CIDVersion>} */
  (CID.parse)

export const decode =
  /** @type {(bytes:Uint8Array) => API.Link<unknown, number, number, API.UCAN.CIDVersion>} */
  (CID.decode)
