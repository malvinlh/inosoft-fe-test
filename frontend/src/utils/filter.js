export function filterLots(allItems, criteria) {
  const { lotNo, allocation, owner, condition } = criteria

  const lots = []
  for (const it of allItems ?? []) {
    for (const l of it.lots ?? []) {
      lots.push({ item: it, ...l })
    }
  }

  return lots.filter(l =>
    (lotNo ? l.lotNo === lotNo : true) &&
    (allocation ? l.allocation === allocation : true) &&
    (owner ? l.owner === owner : true) &&
    (condition ? l.condition === condition : true)
  )
}

export function deriveOptions(filteredLots) {
  const set = (key) => Array.from(new Set(filteredLots.map(x => x[key])))
  return {
    lotNumbers: set('lotNo'),
    allocations: set('allocation'),
    owners: set('owner'),
    conditions: set('condition')
  }
}