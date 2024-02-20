import { DateTime } from 'luxon'
import { getVendor, getVendorFromAlias } from '~/data/vendorsService'
import { Expense, RawTransaction, Transfer } from '~/types'

export const process = async (
    file: string,
    accountId: string
): Promise<Array<[RawTransaction, Expense | Transfer]>> => {
    const lines = file.trim().split('\n')
    lines.shift()
    return await Promise.all(
        lines.map(async (line, index) => {
            // Transaction Date,Post Date,Description,Category,Type,Amount,Memo
            const parts = line.split(',')
            const date = DateTime.fromFormat(parts[0], 'MM/dd/yyyy', {
                zone: 'utc',
            })
            const amount = parseFloat(parts[5])
            const vendor = parts[2]
            const vendorId = await getVendorFromAlias(vendor)
            if (vendorId) {
                console.log(vendorId)
            }
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
                          vendorId,
                          category: vendorId
                              ? (await getVendor(vendorId)).category || ''
                              : '',
                          subcategory: vendorId
                              ? (await getVendor(vendorId)).subcategory || ''
                              : '',
                          kind: 'expense',
                          description: '',
                      } satisfies Expense)
            const rawTransaction = {
                amount: parts[5],
                date: parts[0],
                vendor: parts[2],
                raw: line,
            }
            return [rawTransaction, transaction] as [
                RawTransaction,
                Expense | Transfer
            ]
        })
    )
}
