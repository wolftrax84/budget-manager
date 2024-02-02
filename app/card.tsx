import { HTMLProps, PropsWithChildren } from 'react'

export default function Card({
    className = '',
    children,
}: PropsWithChildren<{
    className?: HTMLProps<HTMLElement>['className']
}>) {
    return (
        <div className={`rounded-md bg-gray-600 p-4 text-black ${className}`}>
            {children}
        </div>
    )
}
