import { promises as fs } from 'fs'

export const save = async (filePath: string, data: any) => {
    await fs.writeFile(filePath, JSON.stringify(data))
}

export const load = async <T>(filePath: string) => {
    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T
}
