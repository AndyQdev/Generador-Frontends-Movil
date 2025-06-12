import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface SelectPagesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pages: Array<{
    id: string
    name: string
  }>
  onExport: (selectedPages: string[]) => void
}

export default function SelectPagesDialog({
  open,
  onOpenChange,
  pages,
  onExport
}: SelectPagesDialogProps) {
  const [selectedPages, setSelectedPages] = useState<string[]>([])

  const handleTogglePage = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([])
    } else {
      setSelectedPages(pages.map(page => page.id))
    }
  }

  const handleExport = () => {
    onExport(selectedPages)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <DialogTitle>Seleccionar páginas para exportar</DialogTitle>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="select-all"
              checked={selectedPages.length === pages.length}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Seleccionar todas
            </label>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center space-x-2">
                <Checkbox
                  id={page.id}
                  checked={selectedPages.includes(page.id)}
                  onCheckedChange={() => handleTogglePage(page.id)}
                />
                <label
                  htmlFor={page.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {page.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedPages.length === 0}
          >
            Exportar seleccionadas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 