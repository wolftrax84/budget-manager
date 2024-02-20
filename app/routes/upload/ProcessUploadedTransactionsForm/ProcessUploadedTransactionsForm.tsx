import { Form, useLoaderData } from '@remix-run/react'
import { loader } from '../route'
import { DateTime } from 'luxon'
import ProcessTransaction from './ProcessTransaction'
import { Transaction } from '~/types'

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
                                ...transaction[1],
                                date: DateTime.fromISO(
                                    transaction[1].date as unknown as string,
                                    {
                                        zone: 'utc',
                                    }
                                ),
                            } as Transaction
                            return (
                                <ProcessTransaction
                                    transaction={[
                                        transaction[0],
                                        transactionObject,
                                    ]}
                                    key={transactionObject.id}
                                />
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
