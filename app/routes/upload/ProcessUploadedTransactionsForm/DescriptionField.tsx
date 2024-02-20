import { Transaction } from '~/types'

export default function DescriptionField({
    transaction,
}: {
    transaction: Transaction
}) {
    return (
        <div className='form-control flex-row items-center mb-1'>
            <div className='label'>
                <span className='label-text'>Description</span>
            </div>
            <input
                type='text'
                className='input input-bordered input-sm w-full invalid:input-warning'
                name={`${transaction.id}.description`}
            />
        </div>
    )
}
