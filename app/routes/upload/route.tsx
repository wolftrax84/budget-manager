import {
    ActionFunctionArgs,
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, NavLink, useLoaderData } from '@remix-run/react'
import {
    getUploadedTransactions,
    setUploadedTransactions,
} from './uploadService'
import { process as processChase } from '~/processors/chase'
import { process as processCoastal } from '~/processors/coastal'
import { process as processDiscover } from '~/processors/discover'
import { getAccounts, setNewBalances } from '~/data/accountsService'
import { getVendors } from '~/data/vendorsService'
import { getCategories } from '~/data/categoriesService'
import { fileUploadTypes } from './types'
import AccountField from './AccountField'
import DateFields from './DateFields'
import ProcessUploadedTransactionsForm from './ProcessUploadedTransactionsForm/ProcessUploadedTransactionsForm'

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
                    // case 'coastal':
                    //     uploadedTransactions = processCoastal(await file.text())
                    //     break
                    // case 'discover':
                    //     uploadedTransactions = processDiscover(
                    //         await file.text()
                    //     )
                    //     break
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
                <DateFields />
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
            <ProcessUploadedTransactionsForm />
        </div>
    )
}
