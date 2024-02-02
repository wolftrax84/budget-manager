import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { promises as fs } from 'fs'
import { Account } from '~/types'
import { Info } from 'luxon'
import Card from '~/card'
import AccountBalances from './AccountBalances'
import { getTransactions } from '~/data/transactions/transactionsService'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.month, 'month missing in params')
    invariant(params.year, 'year missing in params')
    const accountsFile = await fs.readFile('app/data/accounts.json', 'utf-8')

    const year = parseInt(params.year)
    const month = Info.months().indexOf(params.month)
    const transactions = await getTransactions(year, month)
    return json({
        month,
        year,
        accounts: JSON.parse(accountsFile) as Record<string, Account>,
        transactions,
    })
}

export default function Month() {
    const { month, year, accounts, transactions } =
        useLoaderData<typeof loader>()
    return (
        <div>
            <h1 className='mx-auto text-center text-4xl'>
                {year} - {Info.months()[month]}
            </h1>
            <div className='flex'>
                <AccountBalances
                    year={year}
                    month={month}
                    accounts={accounts}
                />
                {transactions.map((transaction) => (
                    <p key={transaction.id}>{JSON.stringify(transaction)}</p>
                ))}
            </div>
        </div>
    )
}
