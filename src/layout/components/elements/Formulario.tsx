import { type Project } from '@/modules/projects/models/project.model'
import LabelTools from '../elements/LabelTools'
import InputTools from '../elements/InputTools'
import SelectTools from '../elements/SelectTools'
import TextAreaTools from '../elements/TextAreaTools'
import RadioButtonTools from '../elements/RadioButtonTools'
import CheckListTools from '../elements/CheckListTools'
import CalendarTools from '../elements/CalendarTools'
import ButtonTools from '../elements/ButtonTools'
import { type FormularioComponent } from '@/modules/area_job/models/Components'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
interface Props {
  component: FormularioComponent
  setComponent: (comp: FormularioComponent) => void
  project: Project
}

// dentro de tu componente FormularioTools

export default function FormularioTools({ component, setComponent, project }: Props) {
  const [newFieldType, setNewFieldType] = useState<'input' | 'select' | 'label' | 'textArea' | 'calendar' | 'checklist' | 'radiobutton'>('input')

  const handleAddField = () => {
    const id = uuidv4()
    let newField: any

    switch (newFieldType) {
      case 'input':
        newField = {
          id,
          type: 'input',
          placeholder: 'Nuevo input',
          value: '',
          x: 0,
          y: 0,
          width: 100,
          height: 8,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 },
            textStyle: { fontSize: 14, color: '#111827' }
          }
        }
        break
      case 'select':
        newField = {
          id,
          type: 'select',
          label: 'Seleccione una opción',
          options: ['Opción 1', 'Opción 2'],
          selectedOption: '',
          x: 0,
          y: 0,
          width: 100,
          height: 8,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 },
            textStyle: { fontSize: 14, color: '#111827' }
          }
        }
        break
      case 'label':
        newField = {
          id,
          type: 'label',
          text: 'Etiqueta nueva',
          x: 0,
          y: 0,
          width: 100,
          height: 4,
          style: {
            textStyle: { fontSize: 14, color: '#111827' }
          }
        }
        break
      case 'textArea':
        newField = {
          id,
          type: 'textArea',
          placeholder: 'Texto...',
          value: '',
          x: 0,
          y: 0,
          width: 100,
          height: 12,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 },
            textStyle: { fontSize: 14, color: '#111827' }
          }
        }
        break
      case 'calendar':
        newField = {
          id,
          type: 'calendar',
          selectedDate: '',
          x: 0,
          y: 0,
          width: 100,
          height: 8,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 }
          }
        }
        break
      case 'checklist':
        newField = {
          id,
          type: 'checklist',
          label: 'Selecciona opciones',
          options: ['A', 'B'],
          selectedOptions: [],
          x: 0,
          y: 0,
          width: 100,
          height: 12,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 }
          }
        }
        break
      case 'radiobutton':
        newField = {
          id,
          type: 'radiobutton',
          label: 'Selecciona una opción',
          options: ['X', 'Y'],
          selectedOption: '',
          x: 0,
          y: 0,
          width: 100,
          height: 10,
          style: {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            padding: { top: 6, bottom: 6, left: 10, right: 10 }
          }
        }
        break
    }

    setComponent({ ...component, fields: [...component.fields, newField] })
  }
  return (
    <div className="space-y-6">

      {/* Título */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Título</h4>
        <LabelTools
          component={component.title}
          setComponent={(updatedTitle) => {
            setComponent({ ...component, title: updatedTitle })
          }}
        />
      </div>

      {/* Campos */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Campos</h4>
        {component.fields.map((field, index) => {
          const updateField = (updated: typeof field) => {
            const updatedFields = [...component.fields]
            updatedFields[index] = updated
            setComponent({ ...component, fields: updatedFields })
          }

          const moveUp = () => {
            if (index === 0) return
            const updatedFields = [...component.fields]
            const temp = updatedFields[index - 1]
            updatedFields[index - 1] = updatedFields[index]
            updatedFields[index] = temp
            setComponent({ ...component, fields: updatedFields })
          }

          const moveDown = () => {
            if (index === component.fields.length - 1) return
            const updatedFields = [...component.fields]
            const temp = updatedFields[index + 1]
            updatedFields[index + 1] = updatedFields[index]
            updatedFields[index] = temp
            setComponent({ ...component, fields: updatedFields })
          }

          const subtitle = `Campo ${index + 1}: ${field.type[0].toUpperCase()}${field.type.slice(1)}`

          return (
            <div key={field.id} className="mb-6 border border-gray-200 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-semibold text-gray-700">{subtitle}</h5>
                <div className="space-x-1">
                  <button
                    className="text-xs px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={moveUp}
                    title="Mover arriba"
                  >
                    🔼
                  </button>
                  <button
                    className="text-xs px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={moveDown}
                    title="Mover abajo"
                  >
                    🔽
                  </button>
                </div>
              </div>

              {/* Renderizado del tool correspondiente */}
              {(() => {
                switch (field.type) {
                  case 'input':
                    return <InputTools component={field} setComponent={updateField} />
                  case 'select':
                    return <SelectTools component={field} setComponent={updateField} />
                  case 'label':
                    return <LabelTools component={field} setComponent={updateField} />
                  case 'textArea':
                    return <TextAreaTools component={field} setComponent={updateField} />
                  case 'calendar':
                    return <CalendarTools component={field} setComponent={updateField} />
                  case 'checklist':
                    return <CheckListTools component={field} setComponent={updateField} />
                  case 'radiobutton':
                    return <RadioButtonTools component={field} setComponent={updateField} />
                  default:
                    return null
                }
              })()}
            </div>
          )
        })}
      </div>

      {/* Botón */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Botón</h4>
        <ButtonTools
          component={component.button}
          setComponent={(updatedButton) => {
            setComponent({ ...component, button: updatedButton })
          }}
          project={project}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Agregar campo</label>
        <div className="flex gap-2">
            <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={newFieldType}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChange={(e) => { setNewFieldType(e.target.value as any) }}
            >
            <option value="input">Input</option>
            <option value="select">Select</option>
            <option value="label">Etiqueta</option>
            <option value="textArea">TextArea</option>
            <option value="calendar">Calendario</option>
            <option value="checklist">CheckList</option>
            <option value="radiobutton">RadioButton</option>
            </select>

            <button
            className="bg-primary text-white rounded px-4 py-1 text-sm"
            onClick={handleAddField}
            >
            Añadir
            </button>
        </div>
        </div>
    </div>
  )
}
