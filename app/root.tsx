import { cssBundleHref } from '@remix-run/css-bundle'
import type { ActionFunctionArgs, LinksFunction } from '@remix-run/node'
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    json,
    redirect,
    useLoaderData,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'
import Header from './header'
import { promises as fs } from 'fs'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async () => {
    const transactionsDirectory = 'app/data/transactions'
    const files = await fs.readdir(transactionsDirectory, 'utf8')
    return json({
        years: files
            .map((file) => parseInt(file.split('.')[0]))
            .filter((file) => Boolean(file))
            .sort()
            .reverse(),
    })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    // const action =
    const year = formData.get('year')
    const month = formData.get('month')
    return redirect(`/${year}/${month !== 'Summary' ? month : ''}`)
}

export default function App() {
    const { years } = useLoaderData<typeof loader>()
    return (
        <html lang='en' data-theme='dark'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <Meta />
                <Links />
            </head>
            <body className='h-screen flex flex-col'>
                <Header years={years} />
                <div className='m-auto w-full max-w-[1600px] flex-1 overflow-hidden'>
                    <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
