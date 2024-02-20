import { Dispatch, SetStateAction } from 'react'
import { Transaction } from '~/types'
import LockOpen from '~/icons/lock-open'
import Lock from '~/icons/lock'
import { useLoaderData } from '@remix-run/react'
import { loader } from '../route'

export default function SubcategoryField({
    category,
    transaction,
    subcategory,
    subcategoryLock,
    setSubcategory,
    setSubcategoryLock,
}: {
    category: string
    transaction: Transaction
    subcategory: string
    subcategoryLock: boolean
    setSubcategory: Dispatch<SetStateAction<string>>
    setSubcategoryLock: Dispatch<SetStateAction<boolean>>
}) {
    const { categories } = useLoaderData<typeof loader>()
    return (
        <div>
            <div className='form-control flex-row items-center mb-1'>
                <div className='label'>
                    <span className='label-text'>Sub-category</span>
                </div>
                <select
                    required
                    className='select select-sm select-bordered min-w-52 invalid:select-warning'
                    name={`${transaction.id}.subcategory`}
                    value={subcategory || ''}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={category === 'new_category' || subcategoryLock}
                >
                    <option value=''></option>
                    <option value='new_subcategory'>New Subcategory</option>
                    {categories[category]?.subcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                            {subcategory}
                        </option>
                    ))}
                </select>
                <input
                    hidden
                    name={`${transaction.id}.subcategory`}
                    value={subcategory}
                />
                {subcategoryLock ? (
                    <Lock
                        className='fill-accent hover:cursor-pointer'
                        onClick={() => setSubcategoryLock(false)}
                    />
                ) : (
                    <LockOpen
                        className='fill-neutral-content hover:cursor-pointer'
                        onClick={() => setSubcategoryLock(true)}
                    />
                )}
                <input
                    type='checkbox'
                    hidden
                    name={`${transaction.id}.subcategory-lock`}
                    checked={subcategoryLock}
                />
            </div>
            {(subcategory === 'new_subcategory' ||
                category === 'new_category') && (
                <input
                    required
                    type='text'
                    placeholder='Subcategory Name'
                    className='input input-bordered input-sm w-full invalid:input-warning'
                    name={`${transaction.id}.new-subcategory`}
                />
            )}
        </div>
    )
}
