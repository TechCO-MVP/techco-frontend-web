"use server";

export async function sendResponse(): Promise<boolean> {
  return await new Promise((resolve) => setTimeout(resolve, 1000));
}
