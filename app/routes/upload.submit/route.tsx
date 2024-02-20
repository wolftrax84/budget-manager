import type { ActionFunctionArgs } from '@remix-run/node'
import { Category, ProcessedExpenseData, Vendor } from '~/types'
import { updateProcessedTransactions } from '../upload/uploadService'

const displayNameToId = (displayName: string) =>
    displayName
        .replaceAll(/[^a-zA-Z0-9\s]/g, '')
        .replaceAll(/\s/g, '-')
        .toLocaleLowerCase()

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const transactionsToUpdate: Record<string, ProcessedExpenseData> = {}
    const vendorsToUpdate: Record<string, Vendor> = {}
    const categoriesToUpdate: Record<string, Category> = {}
    const formData = Object.fromEntries(await request.formData())
    console.log(formData)
    Object.entries(formData).forEach(([key, value]) => {
        const [transactionId, fieldKey] = key.split('.')
        switch (fieldKey) {
            case 'vendorId':
                if (value !== 'new_vendor') {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              value as string)
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: value as string,
                              description: '',
                          } as ProcessedExpenseData)
                } else {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              displayNameToId(
                                  formData[
                                      `${transactionId}.new-vendor`
                                  ].toString()
                              ))
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: displayNameToId(
                                  formData[
                                      `${transactionId}.new-vendor`
                                  ].toString()
                              ),
                              description: '',
                          } as ProcessedExpenseData)
                }
                break
            case 'category':
                if (value !== 'new_category') {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              value as string)
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: value as string,
                              description: '',
                          } as ProcessedExpenseData)
                } else {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              displayNameToId(
                                  formData[
                                      `${transactionId}.new-category`
                                  ].toString()
                              ))
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: displayNameToId(
                                  formData[
                                      `${transactionId}.new-category`
                                  ].toString()
                              ),
                              description: '',
                          } as ProcessedExpenseData)
                }
                break
            case 'subcategory':
                if (value !== 'new_subcategory') {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              value as string)
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: value as string,
                              description: '',
                          } as ProcessedExpenseData)
                } else {
                    transactionsToUpdate[transactionId]
                        ? (transactionsToUpdate[transactionId][fieldKey] =
                              displayNameToId(
                                  formData[
                                      `${transactionId}.new-subcategory`
                                  ].toString()
                              ))
                        : (transactionsToUpdate[transactionId] = {
                              [fieldKey]: displayNameToId(
                                  formData[
                                      `${transactionId}.new-subcategory`
                                  ].toString()
                              ),
                              description: '',
                          } as ProcessedExpenseData)
                }
                break
            case 'new-vendor':
                const vendorId = displayNameToId(value.toString())
                const category = formData[`${transactionId}.category-lock`]
                    ? formData[`${transactionId}.new-category`]
                        ? displayNameToId(
                              formData[
                                  `${transactionId}.new-category`
                              ].toString()
                          )
                        : formData[`${transactionId}.category`].toString()
                    : null
                const subcategory =
                    !category || !formData[`${transactionId}.subcategory-lock`]
                        ? null
                        : formData[`${transactionId}.new-subcategory`]
                        ? displayNameToId(
                              formData[
                                  `${transactionId}.new-subcategory`
                              ].toString()
                          )
                        : formData[`${transactionId}.subcategory`].toString()
                vendorsToUpdate[vendorId] = {
                    id: vendorId,
                    displayName: value.toString(),
                    category,
                    subcategory,
                }
                transactionsToUpdate[transactionId]
                    ? (transactionsToUpdate[transactionId].vendorId =
                          displayNameToId(
                              formData[`${transactionId}.new-vendor`].toString()
                          ))
                    : (transactionsToUpdate[transactionId] = {
                          vendorId: displayNameToId(
                              formData[`${transactionId}.new-vendor`].toString()
                          ),
                          description: '',
                      } as ProcessedExpenseData)
                break
            case 'new-category':
                const id = displayNameToId(value.toString())
                categoriesToUpdate[id] = {
                    id,
                    displayName: value.toString(),
                    color: formData[
                        `${transactionId}.new-category-color`
                    ].toString(),
                    subcategories: [
                        formData[`${transactionId}.new-subcategory`].toString(),
                    ],
                }
                transactionsToUpdate[transactionId]
                    ? (transactionsToUpdate[transactionId].category =
                          displayNameToId(
                              formData[`${transactionId}.new-vendor`].toString()
                          ))
                    : (transactionsToUpdate[transactionId] = {
                          category: displayNameToId(
                              formData[`${transactionId}.new-vendor`].toString()
                          ),
                          description: '',
                      } as ProcessedExpenseData)
                break
            case 'description':
                transactionsToUpdate[transactionId]
                    ? (transactionsToUpdate[transactionId].category =
                          displayNameToId(
                              formData[
                                  `${transactionId}.description`
                              ].toString()
                          ))
                    : (transactionsToUpdate[transactionId] = {
                          category: displayNameToId(
                              formData[
                                  `${transactionId}.description`
                              ].toString()
                          ),
                      } as ProcessedExpenseData)
                break
        }
    })
    console.log('transactions', transactionsToUpdate)
    updateProcessedTransactions(transactionsToUpdate)
    console.log('categories', categoriesToUpdate)
    if (Object.keys(categoriesToUpdate).length > 0)
        updateCategories(categoriesToUpdate)
    console.log('vendors', vendorsToUpdate)
    return true
}
