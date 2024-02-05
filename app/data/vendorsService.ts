import { Vendor } from '~/types'
import { load } from './fileService'

const VENDORS_FILE_PATH = 'app/data/vendors.json'
const VENDOR_ALIAS_FILE_PATH = 'app/data/vendorAliases.json'

let vendors: Record<string, Vendor>
let vendorAliases: Record<string, string>

export const getVendors = async () => {
    if (!vendors) {
        vendors = await load<Record<string, Vendor>>(VENDORS_FILE_PATH)
    }
    return vendors
}

export const getVendor = async (vendorId: string) => {
    if (!vendors) {
        vendors = await load<Record<string, Vendor>>(VENDORS_FILE_PATH)
    }
    return vendors[vendorId]
}

export const getVendorFromAlias = async (alias: string) => {
    if (!vendorAliases) {
        vendorAliases = await load<Record<string, string>>(
            VENDOR_ALIAS_FILE_PATH
        )
    }
    console.log(vendorAliases, alias)
    return vendorAliases[alias]
}
