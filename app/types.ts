import { DateTime } from 'luxon'

export type RawTransaction = {
    date: string
    vendor: string
    amount: string
    raw: string
}

export type ProcessedExpenseData = {
    vendorId: string
    category: string
    subcategory: string
    description: string
}

export type Transaction = {
    id: string
    date: DateTime
    accountId: string
    type: 'credit' | 'debit'
    amount: number
    category: string
    description: string
    vendorId: string
    subcategory: string
}

// export type Expense = Transaction & {
//     kind: 'expense'
// }

// export type Transfer = Transaction & {
//     kind: 'transfer'
//     transferAccountId: string
// }

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
