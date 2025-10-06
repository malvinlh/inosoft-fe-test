export const toMap = (arr = []) =>
  Object.fromEntries(arr.map(o => [o.id, o.name]))

export const lookup = (map, id) => map?.[id] ?? id