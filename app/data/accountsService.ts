import { promises as fs } from 'fs'
import { Account } from '~/types'

const FILE_PATH = 'app/data/accounts.json'
let accounts: Record<string, Account>

const loadAccounts = async () => {
    accounts = JSON.parse(await fs.readFile(FILE_PATH, 'utf-8')) as Record<
        string,
        Account
    >
}

const saveAccounts = async () => {
    await fs.writeFile(FILE_PATH, JSON.stringify(accounts))
}

export const getAccounts = async () => {
    if (!accounts) await loadAccounts()
    return accounts
}

export const getAccount = async (accountId: string) => {
    if (!accounts) await loadAccounts()
    return accounts[accountId]
}

export const setNewBalances = async (
    newBalances: Array<[string, number]>,
    year: number,
    month: number
) => {
    newBalances.forEach(([accountId, balance]) => {
        if (accounts[accountId].history[year])
            accounts[accountId].history[year][month] = balance
        else accounts[accountId].history[year] = { [month]: balance }
    })
    await saveAccounts()
}
