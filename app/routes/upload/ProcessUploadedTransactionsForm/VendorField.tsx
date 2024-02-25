import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import { Dispatch, SetStateAction } from 'react'
import { RawTransaction } from '~/types'
import { loader } from '../route'

export default function VendorField({
    transaction,
    vendorId,
    setVendorId,
}: {
    transaction: RawTransaction
    vendorId: string
    setVendorId: Dispatch<SetStateAction<string>>
}) {
    const submit = useSubmit()
    const { vendors } = useLoaderData<typeof loader>()
    return (
        <div>
            <div className='form-control flex-row items-center mb-1'>
                <div className='label'>
                    <span className='label-text'>Vendor</span>
                </div>
                <Form
                    action='updatetransactionvendor'
                    method='post'
                    onChange={(event) => submit(event.currentTarget)}
                >
                    <select
                        required
                        className='select select-sm select-bordered min-w-52 invalid:select-warning'
                        name={`vendorId`}
                        defaultValue={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                        disabled={Boolean(transaction.vendorId)}
                    >
                        <option value={''} />
                        <option value='new_vendor'>New Vendor</option>
                        {Object.values(vendors).map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.displayName}
                            </option>
                        ))}
                    </select>
                    <input hidden name={`vendorAlias`} value={transaction.vendorAlias} />
                    <input hidden name='transactionId' value={transaction.id} />
                </Form>
                <input
                    hidden
                    name={`${transaction.id}.vendorId`}
                    value={vendorId}
                />
            </div>
            {vendorId === 'new_vendor' && (
                <input
                    required
                    type='text'
                    placeholder='Vendor Name'
                    className='input input-bordered input-sm w-full invalid:input-warning'
                    name={`${transaction.id}.new-vendor`}
                />
            )}
        </div>
    )
}
