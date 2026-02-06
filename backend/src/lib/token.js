import crypto from "crypto";

/**
 * Generates a secure random token (raw)
 */
export const generateRawToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hashes a token before storing in DB
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
