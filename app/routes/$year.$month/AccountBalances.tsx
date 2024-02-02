import Card from '~/card'
import CaretDown from '~/icons/caret-down'
import CaretUp from '~/icons/caret-up'
import { Account } from '~/types'

export default function AccountBalances({
    year,
    month,
    accounts,
}: {
    year: number
    month: number
    accounts: Record<string, Account>
}) {
    const sortedAccounts = Object.keys(accounts)
        .sort()
        .map((accountId) => accounts[accountId])
        .filter((account) => account.type !== 'credit')
    return (
        <Card>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAccounts.map((account) => (
                        <tr key={account.id}>
                            <td>{account.displayName}</td>
                            <td className='text-right'>
                                {account.history[year]?.[month]}{' '}
                            </td>
                            <td>
                                <AccountBalanceDiff
                                    account={account}
                                    month={month}
                                    year={year}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    )
}

const AccountBalanceDiff = ({
    month,
    year,
    account,
}: {
    month: number
    year: number
    account: Account
}) => {
    let diff: number = 0
    if (month === 0) {
        diff = 0
    } else {
        diff =
            account.history[year][month] -
            (account.history[year][month - 1] || 0)
    }
    console.log(account.history[year][month] - account.history[year][month - 1])

    const color = diff < 0 ? 'text-error' : 'text-success'
    return (
        <span className={`${color} flex items-center justify-end gap-1`}>
            {diff < 0 ? (
                <CaretDown className='fill-error' />
            ) : (
                <CaretUp className={`fill-success`} />
            )}
            {Math.abs(diff).toFixed(2)}
        </span>
    )
}
