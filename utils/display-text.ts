/** Match text that survives HTML parsing without changing the source data. */
export function displayText(value: string | number): string {
  return String(value).replace(/\0/g, "").replace(/\r\n?/g, "\n");
}
