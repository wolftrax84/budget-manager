import { Account } from '~/types'
import { fileUploadTypes } from './types'

export default function AccountField({ account }: { account: Account }) {
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
