import { Expense, Transfer } from '~/types'

const uploadedTransactions: Record<string, [string, Expense | Transfer][]> = {}

export const getUploadedTransactions = () => {
    return uploadedTransactions
}

export const setUploadedTransactions = (
    transactions: Array<[string, Expense | Transfer]>,
    account: string
) => {
    uploadedTransactions[account] = transactions
}
