import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
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
            <body>
                <div className='bg-teal-500'>
                    <div className='max-w-screen-2xl m-auto w-full py-2 flex gap-4 items-center'>
                        <h1 className='text-xl text-black'>Budget Manager</h1>
                        <div className='flex-1'></div>
                        <select className='select select-secondary w-full max-w-xs'>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                        <select className='select select-bordered w-full max-w-xs'>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </div>
                </div>
                <div className="max-w-screen-2xl m-auto w-full">
                <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
