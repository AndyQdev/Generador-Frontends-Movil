// Toolbar.tsx
import { Hand, MousePointer, Minus, Plus, Save, Download, FilePlus, ChevronDown } from 'lucide-react'
import { DEVICES, type Device } from '../utils/devices'
import { useState } from 'react'
import SelectPagesDialog from './SelectPagesDialog'

interface ToolbarProps {
  zoom: number // Nivel de zoom actual
  mode: 'select' | 'hand' // Modo actual (selección o mano)
  setMode: (mode: 'select' | 'hand') => void // Función para cambiar el modo
  zoomIn: () => void // Función para hacer zoom in
  zoomOut: () => void // Función para hacer zoom out
  reset: () => void // Función para restablecer el zoom
  onSubmit: () => void // Función para guardar cambios
  handleExport: () => void
  handleExportSelectedPages: (selectedPages: string[]) => void
  setOpenDlg: (open: boolean) => void
  device: Device
  setDevice: (d: Device) => void
  pages: Array<{
    id: string
    name: string
  }>
}

export default function Toolbar({
  zoom,
  mode,
  setMode,
  zoomIn,
  zoomOut,
  onSubmit,
  handleExport,
  handleExportSelectedPages,
  setOpenDlg,
  device,
  setDevice,
  pages
}: ToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showSelectPagesDialog, setShowSelectPagesDialog] = useState(false)

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 bg-neutral-800/90 backdrop-blur text-white rounded-full px-4 py-2 flex items-center shadow-lg">
    {/* <div className="fixed left-1/2 -translate-x-1/2 bottom-4 bg-neutral-800/90 backdrop-blur text-white rounded-full px-2 py-1 flex items-center shadow-lg overflow-x-auto max-w-[95vw] sm:px-4 sm:py-2 no-scrollbar"> */}
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
      <span className="w-12 text-center text-sm">{Math.round(zoom)}%</span>
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
      <div className="relative">
        <button
          onClick={() => { setShowExportMenu(!showExportMenu) }}
          className="p-2 rounded-full transition hover:bg-neutral-500 flex items-center gap-2"
          title="Exportar proyecto"
        >
          <Download size={18} />
          <ChevronDown size={14} />
        </button>

        {showExportMenu && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-800 rounded-lg shadow-lg py-2 min-w-[200px]">
            <button
              onClick={() => {
                handleExport()
                setShowExportMenu(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-neutral-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Descargar proyecto completo
            </button>
            <button
              onClick={() => {
                setShowSelectPagesDialog(true)
                setShowExportMenu(false)
              }}
              className="w-full px-4 py-2 text-left hover:bg-neutral-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Seleccionar páginas para descargar
            </button>
          </div>
        )}
      </div>
      {/* Botón para abrir el diálogo */}
      <button
        onClick={() => { setOpenDlg(true) }} // Abrir el diálogo
        className="p-2 rounded-full transition hover:bg-neutral-500 flex items-center gap-2"
        title="Crear nueva página"
      >
        <FilePlus size={18} />
      </button>
       {/* === SELECT DISPOSITIVO === */}
      <div className="hidden sm:block w-px h-6 bg-white/20 mx-2" />
      <select
        className="hidden sm:block text-white bg-[#3a3a3a] text-sm rounded px-2 py-1 outline-none"
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

      {/* Diálogo de selección de páginas */}
      <SelectPagesDialog
        open={showSelectPagesDialog}
        onOpenChange={setShowSelectPagesDialog}
        pages={pages}
        onExport={handleExportSelectedPages}
      />
    </div>
  )
}
