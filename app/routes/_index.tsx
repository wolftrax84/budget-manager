import { redirect } from '@remix-run/node'
import { promises as fs } from 'fs'

export const loader = async () => {
    const transactionsDirectory = 'app/data/transactions'
    const files = await fs.readdir(transactionsDirectory, 'utf8')
    console.log(files)
    const latestYear = files
        .map((file) => parseInt(file.split('.')[0]))
        .filter((year) => Boolean(year))
        .sort()
        .reverse()[0]
    console.log(latestYear)
    return redirect(`/${latestYear}`)
}
