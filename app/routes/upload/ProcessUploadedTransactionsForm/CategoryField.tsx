import { useLoaderData } from '@remix-run/react'
import { Dispatch, SetStateAction } from 'react'
import { Transaction } from '~/types'
import { loader } from '../route'
import LockOpen from '~/icons/lock-open'
import Lock from '~/icons/lock'

export default function CategoryField({
    transaction,
    category,
    categoryLock,
    setCategory,
    setCategoryLock,
}: {
    transaction: Transaction
    category: string
    categoryLock: boolean
    setCategory: Dispatch<SetStateAction<string>>
    setCategoryLock: Dispatch<SetStateAction<boolean>>
}) {
    const { categories } = useLoaderData<typeof loader>()
    return (
        <div>
            <div className='form-control flex-row items-center mb-1'>
                <div className='label'>
                    <span className='label-text'>Category</span>
                </div>
                <select
                    required
                    className='select select-sm select-bordered min-w-52 invalid:select-warning'
                    name={`${transaction.id}.category`}
                    onChange={(e) => setCategory(e.target.value)}
                    value={category || ''}
                    disabled={categoryLock}
                >
                    <option value=''></option>
                    <option value='new_category'>New Category</option>
                    {Object.values(categories).map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.displayName}
                        </option>
                    ))}
                </select>
                <input
                    hidden
                    name={`${transaction.id}.category`}
                    value={category}
                />
                {categoryLock ? (
                    <Lock
                        className='fill-accent hover:cursor-pointer'
                        onClick={() => setCategoryLock(false)}
                    />
                ) : (
                    <LockOpen
                        className='fill-neutral-content hover:cursor-pointer'
                        onClick={() => setCategoryLock(true)}
                    />
                )}
                <input
                    type='checkbox'
                    hidden
                    name={`${transaction.id}.category-lock`}
                    checked={categoryLock}
                />
            </div>
            {category === 'new_category' && (
                <div className='flex gap-2'>
                    <input
                        required
                        type='text'
                        placeholder='Category Name'
                        className='input input-bordered input-sm w-full invalid:input-warning'
                        name={`${transaction.id}.new-category`}
                    />
                    <input
                        required
                        type='text'
                        placeholder='Color'
                        className='input input-bordered input-sm w-full invalid:input-warning'
                        name={`${transaction.id}.new-category-color`}
                    />
                </div>
            )}
        </div>
    )
}
