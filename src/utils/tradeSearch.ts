type TradeFilter = {
  disabled: boolean
  id: string
  value: {
    weight: number
  }
}

type TradeQueryPayload = {
  query: {
    stats: Array<{
      type: 'weight'
      filters: TradeFilter[]
      disabled: boolean
      value: {
        min: number
      }
    }>
    status: {
      option: 'online'
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
          type: 'weight',
          filters,
          disabled: false,
          value: {
            min: 1,
          },
        },
      ],
      status: {
        option: 'online',
      },
    },
    sort: {
      price: 'asc',
    },
  }

  const encoded = encodeURIComponent(JSON.stringify(payload))
  return `https://pathofexile.com/trade/search?q=${encoded}`
}
