import { ActionFunctionArgs } from '@remix-run/node'
import { setVendorAlias } from '~/data/vendorsService'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = Object.fromEntries(await request.formData())
    // setVendorAlias(
    // 
    
    formData.vendorId.toString(),
    //     formData.vendorAlias.toString()
    // )
    console.log(formData)
    return true
}
