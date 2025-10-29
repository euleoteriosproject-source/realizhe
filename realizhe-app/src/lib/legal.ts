import crypto from "crypto";
import { TERMS_VERSION, termsText } from "@/data/legal";

export function getTermsHash(text: string = termsText) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function getTermsVersion() {
  return TERMS_VERSION;
}

export function getTermsSnapshot() {
  return {
    version: TERMS_VERSION,
    hash: getTermsHash(),
    text: termsText,
  };
}
