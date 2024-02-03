import { DateTime, Zone } from 'luxon'
import { Expense, Transfer } from '~/types'

export const process = (file: string, accountId: string) => {
    const lines = file.split('\n')
    lines.shift()
    return lines.map((line, index) => {
        // Transaction Date,Post Date,Description,Category,Type,Amount,Memo
        const parts = line.split(',')
        const date = DateTime.fromFormat(parts[0], 'MM/dd/yyyy', {
            zone: 'utc',
        })
        const amount = parseFloat(parts[5])
        const transaction =
            parts[4] === 'Payment'
                ? ({
                      id: `chase-${parts[0]}-${index}`,
                      date,
                      accountId,
                      type: amount < 0 ? 'debit' : 'credit',
                      amount,
                      category: 'Transfer',
                      transferAccountId: '',
                      kind: 'transfer',
                  } satisfies Transfer)
                : ({
                      id: `chase-${parts[0]}-${index}`,
                      date,
                      accountId,
                      type: amount < 0 ? 'debit' : 'credit',
                      amount,
                      category: 'Transfer',
                      vendorId: '',
                      subcategory: '',
                      kind: 'expense',
                  } satisfies Expense)

        return [line, transaction] as [string, Expense | Transfer]
    })
}
