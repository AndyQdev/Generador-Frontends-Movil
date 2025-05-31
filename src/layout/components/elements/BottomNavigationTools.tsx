import { type BottomNavigationBarComponent } from '@/modules/area_job/models/Components'
import { type Project } from '@/modules/projects/models/project.model'
import { useState } from 'react'

interface Props {
  component: BottomNavigationBarComponent
  setComponent: (c: BottomNavigationBarComponent) => void
  project?: Project
}

export default function BottomNavigationTools({ component, setComponent, project }: Props) {
  /* ─ Picker local de iconos ───────────────────────────── */
  const iconList = [
    'home','search','user','star','heart','cog','plus','camera','calendar',
    'file','folder','chart-line','music','lock','download'
  ]
  const [iconDlgIdx, setIconDlgIdx] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {/* Color de fondo */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-32">Color fondo:</label>
        <input
          type="color"
          value={component.backgroundColor ?? '#ffffff'}
          onChange={(e) => {
            setComponent({
              ...component,
              backgroundColor: e.target.value
            })
          }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Color icono activo */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-32">Color activo:</label>
        <input
          type="color"
          value={component.activeColor ?? '#1976d2'}
          onChange={(e) => {
            setComponent({
              ...component,
              activeColor: e.target.value
            })
          }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Color icono inactivo */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-32">Color inactivo:</label>
        <input
          type="color"
          value={component.inactiveColor ?? '#757575'}
          onChange={(e) => {
            setComponent({
              ...component,
              inactiveColor: e.target.value
            })
          }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Radio de borde */}
      <div className="flex items-center justify-between gap-2">
        <label className="w-32">Bordes:</label>
        <input
          type="number"
          min={0}
          value={component.borderRadius ?? 0}
          onChange={(e) => setComponent({ ...component, borderRadius: +e.target.value })}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Ítems */}
      <div className="space-y-2">
        <label className="font-medium text-sm">Ítems:</label>

        {component.items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-[auto_auto_1fr_auto] gap-2 items-center mt-2">
            {/* Icono con picker local */}
            <button
              onClick={() => setIconDlgIdx(idx)}
              className="w-9 h-9 grid place-items-center border rounded bg-gray-50 hover:bg-gray-100"
            >
              <i className={`fa fa-${it.icon}`} />
            </button>

            {/* Label */}
            <input
              value={it.label}
              onChange={(e) => {
                const items = [...component.items]
                items[idx].label = e.target.value
                setComponent({ ...component, items })
              }}
              className="border rounded px-3 py-2 text-xs col-span-2"
            />

            {/* Ruta */}
            <select
              value={it.route}
              onChange={(e) => {
                const items = [...component.items]
                items[idx].route = e.target.value
                setComponent({ ...component, items })
              }}
              className="border rounded px-2 py-1 text-sm" 
            >
              <option value="">—</option>
              {project?.pages?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={() =>
            setComponent({
              ...component,
              items: [...component.items, { icon: 'star', label: 'Nuevo', route: '' }]
            })
          }
          className="text-xs text-blue-600 hover:underline"
        >
          + Agregar ítem
        </button>
      </div>

      {/* ─────────── Diálogo simple de iconos ─────────── */}
      {iconDlgIdx !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-[320px] max-h-[70vh] overflow-y-auto shadow-lg">
            <h3 className="text-sm font-semibold mb-3">Seleccionar icono</h3>
            <div className="grid grid-cols-5 gap-2">
              {iconList.map((ic) => (
                <button
                  key={ic}
                  onClick={() => {
                    const items = [...component.items]
                    items[iconDlgIdx].icon = ic
                    setComponent({ ...component, items })
                    setIconDlgIdx(null)
                  }}
                  className="w-12 h-12 grid place-items-center border rounded hover:bg-primary/10"
                >
                  <i className={`fa fa-${ic}`} />
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full text-sm text-red-600 hover:underline"
              onClick={() => setIconDlgIdx(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
