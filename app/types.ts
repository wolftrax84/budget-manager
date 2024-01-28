import { DateTime } from 'luxon'

export type Transaction = {
    date: DateTime
    accountId: string
    category: string
    subcategory: string | null
    amount: number
}
