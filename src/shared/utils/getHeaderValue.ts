export const getHeaderValue = (
  headers: Record<string, string | undefined> | undefined,
  name: string,
): string | undefined => {
  const headerName = Object.keys(headers ?? {}).find(
    (key) => key.toLowerCase() === name.toLowerCase(),
  )

  return headerName ? headers?.[headerName] : undefined
}
