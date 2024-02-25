import { Form, useLoaderData } from '@remix-run/react'
import { loader } from '../route'
import { DateTime } from 'luxon'
import ProcessTransaction from './ProcessTransaction'
import { RawTransaction } from '~/types'

export default function ProcessUploadedTransactionsForm() {
    const { accounts, uploadedTransactions } = useLoaderData<typeof loader>()
    return (
        <Form
            action='submit'
            method='post'
            className='flex-[3] py-4 pl-4 overflow-auto'
        >
            {Object.entries(uploadedTransactions).map(
                ([account, transactions]) => (
                    <div key={account}>
                        <h1 className='text-2xl mb-2'>
                            {
                                accounts.find((a) => a.id === account)
                                    ?.displayName
                            }
                        </h1>
                        {transactions.map((transaction) => {
                            const transactionObject = {
                                ...transaction,
                                date: DateTime.fromISO(
                                    transaction.date as unknown as string,
                                    {
                                        zone: 'utc',
                                    }
                                ),
                            } as RawTransaction
                            return (
                                <>
                                <ProcessTransaction
                                    transaction={transactionObject}
                                    key={transaction.id}
                                />
                                <hr className='w-full h-[1] border-gray-500 my-2' />
                                </>
                            )
                        })}
                    </div>
                )
            )}
            {Object.keys(uploadedTransactions).length > 0 && (
                <button className='btn btn-accent btn-sm flex-1' type='submit'>
                    Submit
                </button>
            )}
        </Form>
    )
}
