import { DateTime } from 'luxon'
import { getVendor, getVendorFromAlias } from '~/data/vendorsService'
import { addUploadedTransaction } from '~/routes/upload/uploadService'
// import { Transaction } from '~/types'

export const process = async (
    file: string,
    accountId: string
) => {
    const lines = file.trim().split('\n')
    lines.shift()
    return await Promise.all(
        lines.map(async (raw, index) => {
            // Transaction Date,Post Date,Description,Category,Type,Amount,Memo
            const parts = raw.split(',')
            // const id = `chase-${parts[0]}-${index}`
            const date = DateTime.fromFormat(parts[0], 'MM/dd/yyyy', {
                zone: 'utc',
            })
            const amount = parseFloat(parts[5])
            const vendorAlias = parts[2]
            const vendorId = await getVendorFromAlias(vendorAlias)
            if (vendorId) {
                console.log(vendorId)
            }
            // const transaction =
            //     parts[4] === 'Payment'
            //         ? ({
            //               id: `chase-${parts[0]}-${index}`,
            //               date,
            //               accountId,
            //               type: amount < 0 ? 'debit' : 'credit',
            //               amount,
            //               category: 'Transfer',
            //               transferAccountId: '',
            //               kind: 'transfer',
            //           } satisfies Transfer)
            //         : ({
            //               id: `chase-${parts[0]}-${index}`,
            //               date,
            //               accountId,
            //               type: amount < 0 ? 'debit' : 'credit',
            //               amount,
            //               vendorId,
            //               category: vendorId
            //                   ? (await getVendor(vendorId)).category || ''
            //                   : '',
            //               subcategory: vendorId
            //                   ? (await getVendor(vendorId)).subcategory || ''
            //                   : '',
            //               kind: 'expense',
            //               description: '',
            //           } satisfies Expense)
            addUploadedTransaction({
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
                              description: '',
                              raw,
                              vendorAlias
                          })
            // return {
            //     id,
            //     amount,
            //     date,
            //     vendorAlias,
            //     vendorId,
            //     raw,
            // }
        })
    )
}
