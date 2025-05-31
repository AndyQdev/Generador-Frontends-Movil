import { type DataTableComponent } from '../../models/Components'
import { cn } from '@/lib/utils'

export default function DataTable({ comp }: { comp: DataTableComponent }) {
  const { headers, rows, backgroundColor = '#ffffff' } = comp

  return (
    <div
      className={cn(
        'w-full h-full overflow-auto rounded-lg border shadow-sm'
      )}
      style={{ backgroundColor }}
    >
      <table className="min-w-full text-xs">
        {/* Cabeceras */}
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas */}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 ? 'bg-gray-50' : undefined}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-1 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
