import {
    ActionFunctionArgs,
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, NavLink, useLoaderData } from '@remix-run/react'
import { DateTime, Info } from 'luxon'
import { Account, Expense, Transfer, Vendor } from '~/types'
import {
    getUploadedTransactions,
    setUploadedTransactions,
} from './uploadService'
import { process as processChase } from '~/processors/chase'
import { process as processCoastal } from '~/processors/coastal'
import { process as processDiscover } from '~/processors/discover'
import { getAccounts, setNewBalances } from '~/data/accountsService'
import { getVendors } from '~/data/vendorsService'
import DateDisplay from '~/components/DateDisplay'

const fileUploadTypes = ['checking', 'credit']

export const loader = async () => {
    console.log('in loader')
    const accounts = Object.values(await getAccounts()).sort((a1, a2) => {
        const a1FileUpload = fileUploadTypes.includes(a1.type)
        const a2FileUpload = fileUploadTypes.includes(a2.type)
        if (a1FileUpload && !a2FileUpload) return -1
        if (a2FileUpload && !a1FileUpload) return 1
        return a1.displayName.localeCompare(a2.displayName)
    })
    const vendors = await getVendors()
    const uploadedTransactions = getUploadedTransactions()
    return json({ accounts, uploadedTransactions, vendors })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const uploadHandler = unstable_createMemoryUploadHandler({
        maxPartSize: 500_000,
    })
    const formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    )
    const newBalances: Array<[string, number]> = []
    Object.values(await getAccounts()).forEach(async (account) => {
        if (fileUploadTypes.includes(account.type)) {
            const file = formData.get(`${account.id}-upload`) as Blob
            if (file.size !== 0) {
                let uploadedTransactions
                switch (account.id.split('-')[0]) {
                    case 'chase':
                        uploadedTransactions = await processChase(
                            await file.text(),
                            account.id
                        )
                        break
                    case 'coastal':
                        uploadedTransactions = processCoastal(await file.text())
                        break
                    case 'discover':
                        uploadedTransactions = processDiscover(
                            await file.text()
                        )
                        break
                }
                if (uploadedTransactions)
                    setUploadedTransactions(uploadedTransactions, account.id)
            }
        } else {
            const balance = formData.get(`${account.id}-balance`) as string
            if (balance) {
                newBalances.push([account.id, parseFloat(balance)])
            }
        }
    })
    const year = parseInt(formData.get('year') as string)
    const month = parseInt(formData.get('month') as string)
    console.log(month)
    setNewBalances(newBalances, year, month)
    return true
}

export default function Upload() {
    const { accounts, uploadedTransactions, vendors } = useLoaderData<typeof loader>()
    return (
        <div className='flex h-full'>
            <Form
                method='post'
                className='py-4 pr-4 flex flex-col gap-4'
                encType='multipart/form-data'
            >
                <div className='flex gap-4'>
                    <div className='form-control w-full'>
                        <div className='label'>
                            <span className='label-text'>Year</span>
                        </div>
                        <input
                            type='number'
                            name='year'
                            className='input input-bordered input-sm input-accent w-full'
                        />
                    </div>
                    <div className='form-control w-full'>
                        <div className='label'>
                            <span className='label-text'>Month</span>
                        </div>
                        <select
                            className='select select-sm select-accent w-full max-w-xs'
                            name='month'
                            value={0}
                        >
                            {Info.months().map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {accounts.map((account) => (
                    <AccountField key={account.id} account={account} />
                ))}
                <div className='flex justify-between gap-4'>
                    <button
                        className='btn btn-accent btn-sm flex-1'
                        type='submit'
                    >
                        Upload
                    </button>
                    <NavLink
                        to={'/'}
                        className='btn btn-accent btn-sm flex-1'
                        type='button'
                    >
                        Cancel
                    </NavLink>
                </div>
            </Form>
            <div className='flex-0 w-0.5 self-stretch bg-gray-600' />
            <div className='flex-[3] py-4 pl-4 overflow-auto'>
                {Object.entries(uploadedTransactions).map(
                    ([account, transactions]) => (
                        <div key={account}>
                            <h1 className='text-2xl'>
                                {
                                    accounts.find((a) => a.id === account)
                                        ?.displayName
                                }
                            </h1>
                            {transactions.map((transaction) => {
                                const transactionObject = {
                                    ...transaction[1],
                                    date: DateTime.fromISO(
                                        transaction[1]
                                            .date as unknown as string,
                                        {
                                            zone: 'utc',
                                        }
                                    ),
                                }
                                return transactionObject.kind === 'expense' ? (
                                    <UploadedExpense
                                        transaction={[
                                            transaction[0],
                                            transactionObject,
                                        ]}
                                        vendor={vendors[transactionObject.vendorId]}
                                    />
                                ) : (
                                    <UploadedTransfer
                                        transaction={[
                                            transaction[0],
                                            transactionObject,
                                        ]}
                                    />
                                )
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

const AccountField = ({ account }: { account: Account }) => {
    return (
        <div className='form-control w-full'>
            <div className='label'>
                <span className='label-text'>{account.displayName}</span>
            </div>
            {fileUploadTypes.includes(account.type) ? (
                <input
                    type='file'
                    name={`${account.id}-upload`}
                    className='file-input file-input-sm file-input-bordered file-input-accent w-full'
                />
            ) : (
                <input
                    type='number'
                    name={`${account.id}-balance`}
                    className='input input-bordered input-sm input-accent w-full'
                />
            )}
        </div>
    )
}

const UploadedExpense = ({
    transaction: [rawTransaction, expense], vendor
}: {
    transaction: [string, Expense], vendor?: Vendor
}) => {
    return (
        <div key={expense.id}>
        {!expense.vendorId || !expense.category || !expense.subcategory ? (<>
                <p>{expense.vendorId}</p>
                <div className='flex gap-4'>
                    <div className='form-control flex-row items-center'>
                        <div className='label'>
                            <span className='label-text'>Vendor</span>
                        </div>
                        <select
                            className='select select-sm select-bordered'
                            name={`${expense.id}-vendorId`}
                            defaultValue={expense.vendorId}
                        ></select>
                    </div>
                    <div className='form-control flex-row items-center'>
                        <div className='label'>
                            <span className='label-text'>Category</span>
                        </div>
                        <select
                            className='select select-sm select-bordered'
                            name={`${expense.id}-category`}
                        ></select>
                    </div>
                    <div className='form-control flex-row items-center'>
                        <div className='label'>
                            <span className='label-text'>Sub-category</span>
                        </div>
                        <select
                            className='select select-sm select-bordered'
                            name={`${expense.id}-subcategory`}
                        ></select>
                    </div>
                </div>
                <p className='italic text-gray-500'>{rawTransaction}</p></>
        ) : (<div className='flex gap-4 text-success'>
            <span><DateDisplay date={expense.date} /></span>
            <span>{expense.amount}</span>
        <span>{vendor?.displayName}</span><span>{expense.category}|{expense.subcategory}</span></div>)}
                <hr className='w-full h-[1] border-gray-500 my-2' />
            </div>
        
    )
}

const UploadedTransfer = ({
    transaction: [rawTransaction, transfer],
}: {
    transaction: [string, Transfer]
}) => {
    return (
        <div key={transfer.id}>
            <p>{rawTransaction}</p>
            <p>{JSON.stringify(transfer)}</p>
            <p><DateDisplay date={transfer.date} /></p>
        </div>
    )
}
