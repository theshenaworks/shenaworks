import React from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  align?: 'left' | 'right'
  render: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  caption: string
  hideCaption?: boolean
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  interactiveRows?: boolean
  className?: string
}

export function DataTable<T>({
  caption,
  hideCaption = true,
  columns,
  rows,
  getRowKey,
  interactiveRows = false,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`relative ${className}`.trim()}>
      <div
        tabIndex={0}
        role="region"
        aria-label={caption}
        className="w-full overflow-x-auto focus-visible:outline-offset-[-2px]"
      >
        <table className="w-full border-collapse t-body-sm">
          <caption className={hideCaption ? 'sr-only' : 't-overline text-left mb-4'}>
            {caption}
          </caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`t-overline !text-[var(--ink-900)] border-b-2 border-[var(--ink-900)] py-3 px-4 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={`border-b border-[var(--grey-300)] ${
                  interactiveRows ? 'hover:bg-[var(--grey-100)] transition-colors duration-200' : ''
                }`}
              >
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : 'text-left'} ${
                      idx === 0 ? 'font-bold bg-white sticky left-0 lg:static' : ''
                    }`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 48px right edge fade below lg (DESIGN.md 2.1 & 5.18) */}
      <div
        aria-hidden="true"
        className="pointer-events-none lg:hidden absolute top-0 right-0 bottom-0 w-12 bg-[linear-gradient(90deg,transparent,var(--white))]"
      />
    </div>
  )
}
