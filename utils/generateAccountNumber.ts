"use server"

import { randomInt } from "crypto";

export const generateAccountNumber = async() => {
  const yearPrefix = new Date().getFullYear().toString().slice(2);
  let randomPart = "";

  for (let i = 0; i < 10; i++) {
    randomPart += randomInt(0, 10);
  }

  return yearPrefix + randomPart;
};
