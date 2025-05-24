// Toolbar.tsx
import { Hand, MousePointer, Minus, Plus, Save, Download, FilePlus } from 'lucide-react'
import { DEVICES, type Device } from '../utils/devices'

interface ToolbarProps {
  zoom: number // Nivel de zoom actual
  mode: 'select' | 'hand' // Modo actual (selección o mano)
  setMode: (mode: 'select' | 'hand') => void // Función para cambiar el modo
  zoomIn: () => void // Función para hacer zoom in
  zoomOut: () => void // Función para hacer zoom out
  reset: () => void // Función para restablecer el zoom
  onSubmit: () => void // Función para guardar cambios
  handleExport: () => void
  setOpenDlg: (open: boolean) => void
  device: Device
  setDevice: (d: Device) => void
}

export default function Toolbar({
  zoom,
  mode,
  setMode,
  zoomIn,
  zoomOut,
  onSubmit,
  handleExport,
  setOpenDlg,
  device,
  setDevice
}: ToolbarProps) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 bg-neutral-800/90 backdrop-blur text-white rounded-full px-4 py-2 flex items-center shadow-lg">
      {/* Modo selección */}
      <button
        onClick={() => { setMode('select') }}
        className={`p-2 rounded-full transition ${
          mode === 'select' ? 'bg-blue-500 text-white' : 'hover:bg-neutral-700'
        }`}
        title="Modo selección"
      >
        <MousePointer size={18} />
      </button>

      {/* Modo mano */}
      <button
        onClick={() => { setMode('hand') }}
        className={`p-2 rounded-full transition ${
          mode === 'hand' ? 'bg-blue-500 text-white cursor-grab' : 'hover:bg-neutral-700'
        }`}
        title="Modo mano"
      >
        <Hand size={18} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-2" />

      {/* Zoom */}
      <button
        onClick={zoomOut}
        className="p-2 rounded-full hover:bg-neutral-700 transition"
        title="Alejar"
      >
        <Minus size={18} />
      </button>
      <span className="w-12 text-center text-sm">{zoom}%</span>
      <button
        onClick={zoomIn}
        className="p-2 rounded-full hover:bg-neutral-700 transition"
        title="Acercar"
      >
        <Plus size={18} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-2" />

      {/* Guardar */}
      <button
        onClick={() => {
          console.log('✅ onSubmit clicked')
          console.log(onSubmit)
          onSubmit()
        }}
        className="p-2 rounded-full transition hover:bg-neutral-500 flex items-center gap-2"
        title="Guardar cambios"
      >
        <Save size={18} />
      </button>

      {/* Exportar */}
      <button
        onClick={() => {
          handleExport()
        }}
        className="p-2 rounded-full transition hover:bg-neutral-500 flex items-center gap-2"
        title="Exportar proyecto"
      >
        <Download size={18} />
      </button>
      {/* Botón para abrir el diálogo */}
      <button
        onClick={() => { setOpenDlg(true) }} // Abrir el diálogo
        className="p-2 rounded-full transition hover:bg-neutral-500 flex items-center gap-2"
        title="Crear nueva página"
      >
        <FilePlus size={18} />
      </button>
       {/* === SELECT DISPOSITIVO === */}
      <div className="w-px h-6 bg-white/20 mx-2" />
      <select
        className="text-white bg-[#3a3a3a] text-sm rounded px-2 py-1 outline-none"
        value={device.id}
        onChange={(e) => {
          const d = DEVICES.find(dev => dev.id === e.target.value)!
          setDevice(d)
        }}
        title="Seleccionar dispositivo"
      >
        {DEVICES.map((d) => (
          <option
            key={d.id}
            value={d.id}
            className="text-white bg-[#3a3a3a]" // Esto solo tiene efecto en algunos navegadores
          >
            {d.label}
          </option>
        ))}
      </select>

    </div>
  )
}
