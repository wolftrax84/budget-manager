import { ProcessedExpenseData, RawTransaction, Transaction } from '~/types'

const uploadedTransactions: Record<string, RawTransaction[]> = {}

export const getUploadedTransactions = () => {
    return uploadedTransactions
}

export const setUploadedTransactions = (
    transactions: Array<[RawTransaction, Transaction]>,
    account: string
) => {
    uploadedTransactions[account] = transactions
}

export const addUploadedTransaction = (transaction: RawTransaction) => {
    uploadedTransactions[transaction.accountId] ?
    uploadedTransactions[transaction.accountId].push(transaction) :
    uploadedTransactions[transaction.accountId] = [transaction]
}

export const updateProcessedTransactions = (
    processedTransactions: Record<string, ProcessedExpenseData>
) => {
    Object.entries(processedTransactions).forEach(
        ([transactionId, { vendorId, category, subcategory, description }]) => {
            const transactionToUpdate = uploadedTransactions[
                transactionId.split('-')[0]
            ].find((transaction) => transaction[1].id === transactionId)
            if (transactionToUpdate) {
                transactionToUpdate[1].vendorId = vendorId
                transactionToUpdate[1].category = category
                transactionToUpdate[1].subcategory = subcategory
                transactionToUpdate[1].description = description
            }
        }
    )
}
