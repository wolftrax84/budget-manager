import { promises as fs } from 'fs'
import { DateTime } from 'luxon'
import { Expense, Transfer } from '~/types'

const transactions: Record<number, Array<Expense | Transfer>> = {}

export const getTransactions = async (year: number, month: number) => {
    if (!transactions[year]?.length) {
        const transactionFile = await fs.readFile(
            `app/data/transactions/${year}.json`,
            'utf-8'
        )
        transactions[year] = JSON.parse(transactionFile) as Array<
            Expense | Transfer
        >
    }
    return transactions[year].filter(
        (transaction) => transaction.date.month === month
    )
}

export const saveTransactions = async (
    newTransactions: Array<Expense | Transfer>
) => {
    const affectedYears = new Set<number>()
    newTransactions.forEach((newTransaction) => {
        affectedYears.add(newTransaction.date.year)
        transactions[newTransaction.date.year].push(newTransaction)
    })
    affectedYears.forEach((year) => {
        transactions[year].sort((t1, t2) =>
            t1.date < t2.date
                ? -1
                : t1.date > t2.date
                ? 1
                : t1.id.localeCompare(t2.id)
        )
        void fs.writeFile(
            `app/data/transactions/${year}.json`,
            JSON.stringify(transactions[year])
        )
    })
}
