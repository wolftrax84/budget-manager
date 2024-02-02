import { DateTime } from 'luxon'

export type Transaction = {
    id: string
    date: DateTime
    accountId: string
    type: 'credit' | 'debit'
    amount: number
    category: string
}

export type Expense = Transaction & {
    vendorId: string
    subcategory: string | null
}

export type Transfer = Transaction & {
    transferAccountId: string
}

export type Account = {
    id: string
    displayName: string
    history: Record<number, Record<number, number>>
    type: 'credit' | 'checking' | 'saving' | 'investment'
}

export type Vendor = {
    id: string
    displayName: string
    category: string | null
    subcategory: string | null
}
