import {
    ActionFunctionArgs,
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, NavLink, useLoaderData } from '@remix-run/react'
import { promises as fs } from 'fs'
import { Info } from 'luxon'
import { Account } from '~/types'
import {
    getUploadedTransactions,
    setUploadedTransactions,
} from './uploadService'
import { process as processChase } from '~/processors/chase'

const fileUploadTypes = ['checking', 'credit']

export const loader = async () => {
    console.log('in loader')
    const accounts = Object.values(
        JSON.parse(
            await fs.readFile('app/data/accounts.json', 'utf-8')
        ) as Record<string, Account>
    ).sort((a1, a2) => {
        const a1FileUpload = fileUploadTypes.includes(a1.type)
        const a2FileUpload = fileUploadTypes.includes(a2.type)
        if (a1FileUpload && !a2FileUpload) return -1
        if (a2FileUpload && !a1FileUpload) return 1
        return a1.displayName.localeCompare(a2.displayName)
    })
    const uploadedTransactions = getUploadedTransactions()
    return json({ accounts, uploadedTransactions })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const uploadHandler = unstable_createMemoryUploadHandler({
        maxPartSize: 500_000,
    })
    const formDataBlah = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    )

    // Hard code file processors for now
    const chaseCreditFile = formDataBlah.get('chase-credit-upload') as Blob
    if (chaseCreditFile.size !== 0) {
        const uploadedTransactions = processChase(await chaseCreditFile.text())
        setUploadedTransactions(uploadedTransactions, 'chase-credit')
    }
    // const coastal = formDataBlah.get('coastal-checking-upload') as Blob
    // if (coastal.size !== 0) {
    // console.log(await coastal.text())
    // } else {
    // console.log('NO FILE')
    // }

    // const formData = await request.formData()
    // console.log('woohoo!', Object.fromEntries(formData))
    // console.log(formData.get('chase-credit-upload'))
    return true
}

export default function Upload() {
    const { accounts, uploadedTransactions } = useLoaderData<typeof loader>()
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
                        >
                            {Info.months().map((month) => (
                                <option key={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {accounts.map((account) => (
                    <AccountField account={account} />
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
                Other Side
                {Object.entries(uploadedTransactions).map(
                    ([account, transactions]) => (
                        <div key={account}>
                            <h1 className='text-2xl'>
                                {
                                    accounts.find((a) => a.id === account)
                                        ?.displayName
                                }
                            </h1>
                            {transactions.map((transaction) => (
                                <p key={transaction[1].id}>{transaction[0]}</p>
                            ))}
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
