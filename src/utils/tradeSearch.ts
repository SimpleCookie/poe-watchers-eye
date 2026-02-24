import type { ModTradeType } from '../types/tradeGroup'

type TradeFilter = {
  disabled?: boolean
  id: string
  value?: { weight: number }
}

type TradeQueryPayload = {
  query: {
    name?: string
    type?: string
    stats: Array<{
      type: 'weight' | 'and' | 'count' | 'not'
      filters: TradeFilter[]
      disabled?: boolean
      value?: { min: number }
    }>
    status: { option: 'online' | 'securable' }
  }
  sort: { price: 'asc' }
}

export type TradeEntry = {
  statId: string
  type: ModTradeType
}

export function buildTradeSearchUrl(entries: TradeEntry[]): string | null {
  if (entries.length === 0) return null

  const andIds = entries.filter((e) => e.type === 'and').map((e) => e.statId)
  const countIds = entries.filter((e) => e.type === 'count').map((e) => e.statId)
  const notIds = entries.filter((e) => e.type === 'not').map((e) => e.statId)

  if (andIds.length === 0 && countIds.length === 0 && notIds.length === 0) return null

  const toFilters = (ids: string[]): TradeFilter[] => ids.map((id) => ({ id, disabled: false }))

  const stats: TradeQueryPayload['query']['stats'] = []
  if (andIds.length > 0) stats.push({ type: 'and', filters: toFilters(andIds), disabled: false })
  if (countIds.length > 0) stats.push({ type: 'count', filters: toFilters(countIds), disabled: false, value: { min: 1 } })
  if (notIds.length > 0) stats.push({ type: 'not', filters: toFilters(notIds), disabled: false })

  const payload: TradeQueryPayload = {
    query: {
      name: "Watcher's Eye",
      type: 'Prismatic Jewel',
      stats,
      status: { option: 'securable' },
    },
    sort: { price: 'asc' },
  }

  const encoded = encodeURIComponent(JSON.stringify(payload))
  return `https://pathofexile.com/trade/search?q=${encoded}`
}
