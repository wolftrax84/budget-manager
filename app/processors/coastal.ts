import { Expense } from '~/types'

export const process = (file: string) => {
    const lines = file.split('\n')
    lines.shift()
    return lines.map(
        (line) => [line, { id: line } as Expense] as [string, Expense]
    )
}
