import { Form, NavLink, useLocation, useSubmit } from '@remix-run/react'
import { Info } from 'luxon'
import AngleLeftSolid from './icons/angle-left-solid'
import AngleRightSolid from './icons/angle-right-solid'

export default function Header({ years }: { years: number[] }) {
    const submit = useSubmit()
    const { pathname } = useLocation()
    const [_, urlYear, month] = pathname.split('/')
    const year = parseInt(urlYear)
    console.log(year, years)
    return (
        <div className='bg-accent'>
            <div className='max-w-[1600px] m-auto w-full py-2 gap-4 flex items-center justify-between'>
                <h1 className='text-xl text-black'>Budget Manager</h1>
                <NavLink to={'/upload'} className='btn'>
                    Upload
                </NavLink>
                <Form
                    className='flex gap-4'
                    method='post'
                    onChange={(event) => submit(event.currentTarget)}
                >
                    <div className='flex items-center'>
                        <NavLink
                            to={`/${year - 1}/${month || ''}`}
                            className='btn btn-circle btn-ghost'
                        >
                            <AngleLeftSolid />
                        </NavLink>
                        <select
                            className='select w-full max-w-xs'
                            name='year'
                            id='year-select'
                            value={year || years[0]}
                        >
                            {years.map((year) => (
                                <option key={year}>{year}</option>
                            ))}
                        </select>
                        <NavLink
                            to={`/${year + 1}/${month || ''}`}
                            className='btn btn-circle btn-ghost'
                            role='button'
                        >
                            <AngleRightSolid />
                        </NavLink>
                    </div>
                    <div className='flex items-center'>
                        <NavLink
                            to={`/${year}/${
                                Info.months()[
                                    Info.months().indexOf(month) - 1
                                ] || ''
                            }`}
                            className='btn btn-circle btn-ghost'
                            role='button'
                        >
                            <AngleLeftSolid />
                        </NavLink>
                        <select
                            value={month || 'Summary'}
                            className='select w-full max-w-xs'
                            name='month'
                            id='month-select'
                        >
                            <option>Summary</option>
                            {Info.months().map((month) => (
                                <option key={month}>{month}</option>
                            ))}
                        </select>
                        <NavLink
                            to={`/${year}/${
                                Info.months()[
                                    Info.months().indexOf(month) + 1
                                ] || ''
                            }`}
                            className='btn btn-circle btn-ghost'
                            role='button'
                        >
                            <AngleRightSolid />
                        </NavLink>
                    </div>
                </Form>
            </div>
        </div>
    )
}
