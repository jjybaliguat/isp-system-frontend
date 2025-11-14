export function chunkRecipients(recipients: string, chunkSize = 1000): string[] {
  const arr = recipients.split(",").map(r => r.trim()).filter(Boolean);
  const chunks: string[] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize).join(",");
    chunks.push(chunk);
  }

  return chunks;
}