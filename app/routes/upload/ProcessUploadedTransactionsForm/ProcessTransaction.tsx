import { useState, useEffect } from 'react'
import DateDisplay from '~/components/DateDisplay'
import { RawTransaction } from '~/types'
import { useLoaderData } from '@remix-run/react'
import { loader } from '../route'
import VendorField from './VendorField'
import CategoryField from './CategoryField'
import SubcategoryField from './SubcategoryField'
import DescriptionField from './DescriptionField'

export default function Processtransaction({
    transaction,
}: {
    transaction: RawTransaction
}) {
    const { vendors } = useLoaderData<typeof loader>()

    const [vendorId, setVendorId] = useState(transaction.vendorId)
    const [category, setCategory] = useState(transaction.category)
    const [categoryLock, setCategoryLock] = useState(
        Boolean(transaction.category)
    )
    const [subcategory, setSubcategory] = useState(transaction.subcategory)
    const [subcategoryLock, setSubcategoryLock] = useState(
        Boolean(transaction.subcategory)
    )

    useEffect(() => {
        if (!vendorId) return
        const vendor = vendors[vendorId]
        if (!vendor) return
        if (vendor.category !== null) {
            console.log('blah')
            setCategory(vendor.category)
            setCategoryLock(true)
            if (vendor.subcategory !== null) {
                setSubcategory(vendor.subcategory)
                setSubcategoryLock(true)
            }
        } else {
            setCategory('')
            setCategoryLock(false)
            setSubcategory('')
            setSubcategoryLock(false)
        }
    }, [vendorId])

    useEffect(() => {
        if (category === 'new_category') setSubcategory('new_subcategory')
    }, [category])

    const [processed, setProcessed] = useState(Boolean(transaction.vendorId && transaction.category && transaction.subcategory))

    if (processed) {
        return (<><div className='flex gap-4 text-success'>
        <span>
            <DateDisplay date={transaction.date} />
        </span>
        <span>{transaction.amount}</span>
        <span>{vendors[transaction.vendorId]?.displayName}</span>
        <span>
            {transaction.category} | {transaction.subcategory}
        </span>
        <button onClick={() => setProcessed(false)}>Edit</button>
    </div></>)
    }

    console.log(transaction.vendorId, transaction.category, transaction.subcategory)
    return (
        <div key={transaction.id}>
                <p className='italic text-gray-500'><DateDisplay date={transaction.date}/> | {transaction.amount} | {transaction.vendorAlias}</p>
            <div className='flex gap-4 items-start'>
                <VendorField
                    transaction={transaction}
                    vendorId={vendorId}
                    setVendorId={setVendorId}
                />
                <CategoryField
                    transaction={transaction}
                    category={category}
                    categoryLock={categoryLock}
                    setCategory={setCategory}
                    setCategoryLock={setCategoryLock}
                />
                <SubcategoryField
                    category={category}
                    transaction={transaction}
                    subcategory={subcategory}
                    subcategoryLock={subcategoryLock}
                    setSubcategory={setSubcategory}
                    setSubcategoryLock={setSubcategoryLock}
                />
                <DescriptionField transaction={transaction} />
            </div>
        </div>
    )
}
