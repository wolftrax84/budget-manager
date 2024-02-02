import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

export const loader = ({ params }: LoaderFunctionArgs) => {
    invariant(params.year, 'Year is missing')
    return json({ year: parseInt(params.year) })
}

export default function Year() {
    const { year } = useLoaderData<typeof loader>()

    return <Outlet />
}
