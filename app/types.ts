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
    kind: 'expense'
    vendorId: string
    subcategory: string
    description: string
}

export type Transfer = Transaction & {
    kind: 'transfer'
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

export type Category = {
    id: string
    displayName: string
    color: string
    subcategories: string[]
}
