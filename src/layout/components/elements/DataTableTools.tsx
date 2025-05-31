import { type DataTableComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: DataTableComponent
  setComponent: (c: DataTableComponent) => void
}

export default function DataTableTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-4">
      {/* Color fondo */}
      <div className="flex items-center justify-between gap-2">
        <label className="w-28">Color fondo:</label>
        <input
          type="color"
          value={component.backgroundColor ?? '#ffffff'}
          onChange={(e) =>
            setComponent({ ...component, backgroundColor: e.target.value })
          }
          className="w-10 h-6 border rounded"
        />
      </div>

      {/* Editar cabeceras */}
      <div>
        <label className="font-medium text-sm">Cabeceras:</label>
        {component.headers.map((h, idx) => (
          <div key={idx} className="flex gap-2 items-center mt-1">
            <input
              value={h}
              onChange={(e) => {
                const headers = [...component.headers]
                headers[idx] = e.target.value
                setComponent({ ...component, headers })
              }}
              className="flex-1 border rounded px-2 py-1 text-xs"
            />
            <button
              onClick={() => {
                const headers = [...component.headers]
                headers.splice(idx, 1)
                const rows = component.rows.map(r => {
                  const nr = [...r]; nr.splice(idx, 1); return nr
                })
                setComponent({ ...component, headers, rows })
              }}
              className="text-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setComponent({
              ...component,
              headers: [...component.headers, 'Nueva'],
              rows: component.rows.map(r => [...r, ''])
            })
          }
          className="mt-1 text-xs text-blue-600 hover:underline"
        >
          + Columna
        </button>
      </div>

      {/* Editar filas */}
      <div>
        <label className="font-medium text-sm">Filas:</label>
        {component.rows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-[1fr_auto] gap-1 mt-1">
            <div className="grid grid-cols-3 gap-1">
              {row.map((cell, cIdx) => (
                <input
                  key={cIdx}
                  value={cell}
                  onChange={(e) => {
                    const rows = [...component.rows]
                    rows[rIdx][cIdx] = e.target.value
                    setComponent({ ...component, rows })
                  }}
                  className="border rounded px-1 text-xs"
                />
              ))}
            </div>
            <button
              onClick={() => {
                const rows = [...component.rows]
                rows.splice(rIdx, 1)
                setComponent({ ...component, rows })
              }}
              className="text-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setComponent({
              ...component,
              rows: [...component.rows, component.headers.map(() => '')]
            })
          }
          className="mt-1 text-xs text-blue-600 hover:underline"
        >
          + Fila
        </button>
      </div>
    </div>
  )
}
