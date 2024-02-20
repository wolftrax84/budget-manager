import { Info } from 'luxon'

export default function DateFields() {
    return (
        <div className='flex gap-4'>
            <div className='form-control w-full'>
                <div className='label'>
                    <span className='label-text'>Year</span>
                </div>
                <input
                    type='number'
                    name='year'
                    className='input input-bordered input-sm input-accent w-full'
                />
            </div>
            <div className='form-control w-full'>
                <div className='label'>
                    <span className='label-text'>Month</span>
                </div>
                <select
                    className='select select-sm select-accent w-full max-w-xs'
                    name='month'
                    defaultValue={0}
                >
                    {Info.months().map((month, index) => (
                        <option key={month} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
