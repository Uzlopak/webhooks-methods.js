import { createHmac, timingSafeEqual } from "crypto";
import { Buffer } from "buffer";

import { VERSION } from "../version";
import { isValidSignaturePrefix } from "../utils";

export async function verify(
  secret: string | Buffer,
  eventPayload: string,
  signature: string,
): Promise<boolean> {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  }

  if (isValidSignaturePrefix(signature) === false) {
    return false;
  }
  const signatureBuffer = Buffer.from(signature.slice(7), "hex");

  if (signatureBuffer.length !== 32) {
    return false;
  }

  const verificationBuffer = Buffer.from(
    createHmac("sha256", secret).update(eventPayload).digest(),
  );

  // constant time comparison to prevent timing attacks
  // https://stackoverflow.com/a/31096242/206879
  // https://en.wikipedia.org/wiki/Timing_attack
  return timingSafeEqual(signatureBuffer, verificationBuffer);
}

verify.VERSION = VERSION;
