import { Category } from '~/types'
import { load } from './fileService'

const CATEGORIES_FILE_PATH = 'app/data/categories.json'

let categories: Record<string, Category>

export const getCategories = async () => {
    if (!categories) {
        categories = await load<Record<string, Category>>(CATEGORIES_FILE_PATH)
    }
    return categories
}

// export const updateCategories = async (categoriesToUpdate: Record<string, Category>) => {
//     if (!categories) {
//         categories = await load<Record<string, Category>>(CATEGORIES_FILE_PATH)
//     }
    
// }
