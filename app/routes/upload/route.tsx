import {
    ActionFunctionArgs,
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, NavLink, useLoaderData } from '@remix-run/react'
import { DateTime, Info } from 'luxon'
import { Account, Category, Expense, Transfer, Vendor } from '~/types'
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
import { useState } from 'react'
import { getCategories } from '~/data/categoriesService'

const fileUploadTypes = ['checking', 'credit']

export const loader = async () => {
    const accounts = Object.values(await getAccounts()).sort((a1, a2) => {
        const a1FileUpload = fileUploadTypes.includes(a1.type)
        const a2FileUpload = fileUploadTypes.includes(a2.type)
        if (a1FileUpload && !a2FileUpload) return -1
        if (a2FileUpload && !a1FileUpload) return 1
        return a1.displayName.localeCompare(a2.displayName)
    })
    const vendors = await getVendors()
    const uploadedTransactions = getUploadedTransactions()
    const categories = await getCategories()
    return json({ accounts, uploadedTransactions, vendors, categories })
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
    setNewBalances(newBalances, year, month)
    return true
}

export default function Upload() {
    const { accounts, uploadedTransactions, vendors, categories } =
        useLoaderData<typeof loader>()
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
                                        vendors={vendors}
                                        categories={categories}
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
    transaction: [rawTransaction, expense],
    categories,
    vendors,
}: {
    transaction: [string, Expense]
    vendors: Record<string, Vendor>
    categories: Record<string, Category>
}) => {
    const [vendorId, setVendorId] = useState(expense.vendorId)
    const [category, setCategory] = useState(expense.category)
    const [subcategory, setSubcategory] = useState(expense.subcategory)
    return (
        <div key={expense.id}>
            {!expense.vendorId || !expense.category || !expense.subcategory ? (
                <>
                    <div className='flex gap-4'>
                        <div className='form-control flex-row items-center'>
                            <div className='label'>
                                <span className='label-text'>Vendor</span>
                            </div>
                            <select
                                className={`select select-sm select-bordered ${
                                    !vendorId ? 'select-warning' : ''
                                }`}
                                name={`${expense.id}-vendorId`}
                                defaultValue={expense.vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                                disabled={Boolean(expense.vendorId)}
                            >
                                <option value={''} />
                                {Object.values(vendors).map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-control flex-row items-center'>
                            <div className='label'>
                                <span className='label-text'>Category</span>
                            </div>
                            <select
                                className={`select select-sm select-bordered ${
                                    !category ? 'select-warning' : ''
                                }`}
                                name={`${expense.id}-category`}
                                onChange={(e) => setCategory(e.target.value)}
                                defaultValue={expense.category || ''}
                            >
                                <option value=''></option>
                                {Object.values(categories).map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-control flex-row items-center'>
                            <div className='label'>
                                <span className='label-text'>Sub-category</span>
                            </div>
                            <select
                                className={`select select-sm select-bordered ${
                                    !subcategory ? 'select-warning' : ''
                                }`}
                                name={`${expense.id}-subcategory`}
                                defaultValue={expense.subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                            >
                                {categories[category]?.subcategories.map(
                                    (subcategory) => (
                                        <option
                                            key={subcategory}
                                            value={subcategory}
                                        >
                                            {subcategory}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                    <p className='italic text-gray-500'>{rawTransaction}</p>
                </>
            ) : (
                <div className='flex gap-4 text-success'>
                    <span>
                        <DateDisplay date={expense.date} />
                    </span>
                    <span>{expense.amount}</span>
                    <span>{vendors[expense.vendorId]?.displayName}</span>
                    <span>
                        {expense.category}|{expense.subcategory}
                    </span>
                </div>
            )}
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
            <p>
                <DateDisplay date={transfer.date} />
            </p>
        </div>
    )
}
