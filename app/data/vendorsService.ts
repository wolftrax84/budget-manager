import { Vendor } from '~/types'
import { load } from './fileService'

const VENDORS_FILE_PATH = 'app/data/vendors.json'
const VENDOR_ALIAS_FILE_PATH = 'app/data/vendorAliases.json'

let vendors: Record<string, Vendor>
let vendorAliases: Record<string, string>

export const getVendors = async (vendorId?: string) => {
    if (!vendors) {
        vendors = await load<Record<string, Vendor>>(VENDORS_FILE_PATH)
    }
    if (vendorId) return vendors[vendorId]
    return vendors
}

export const getVendorFromAlias = async (alias: string) => {
    if (!vendorAliases) {
        vendorAliases = await load<Record<string, string>>(
            VENDOR_ALIAS_FILE_PATH
        )
    }
    return vendorAliases[alias]
}
