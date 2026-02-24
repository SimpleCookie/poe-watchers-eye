type TradeFilter = {
  disabled?: boolean
  id: string
  value?: {
    weight: number
  }
}

type TradeQueryPayload = {
  query: {
    name?: string
    type?: string
    stats: Array<{
      type: 'weight' | 'and'
      filters: TradeFilter[]
      disabled?: boolean
      value?: {
        min: number
      }
    }>
    status: {
      option: 'online' | 'securable'
    }
  }
  sort: {
    price: 'asc'
  }
}

export function buildTradeSearchUrl(statIds: string[]) {
  const filters: TradeFilter[] = statIds.map((id) => ({
    disabled: false,
    id,
    value: {
      weight: 1,
    },
  }))

  const payload: TradeQueryPayload = {
    query: {
      stats: [
        {
          type: 'and',
          filters,
        },
      ],
      status: {
        option: 'securable',
      },
    },
    sort: {
      price: 'asc',
    },
  }

  const encoded = encodeURIComponent(JSON.stringify(payload))
  return `https://pathofexile.com/trade/search?q=${encoded}`
}
