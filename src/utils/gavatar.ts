import * as CryptoJS from "crypto-js";

export const getGravatarURL = (email: string) => {
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};
