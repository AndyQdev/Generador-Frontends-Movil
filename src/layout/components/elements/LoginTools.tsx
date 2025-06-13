import { type Project } from '@/modules/projects/models/project.model'
import CardTools from '../elements/CardTools'
import LabelTools from '../elements/LabelTools'
import InputTools from '../elements/InputTools'
import ButtonTools from '../elements/ButtonTools'
import { type LoginComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: LoginComponent
  setComponent: (comp: LoginComponent) => void
  project: Project
}

export default function LoginTools({ component, setComponent, project }: Props) {
  return (
    <div className="space-y-6">

      {/* Card */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Card</h4>
        <CardTools
          component={component.card}
          setComponent={(updatedCard) => { setComponent({ ...component, card: updatedCard }) }
          }
        />
      </div>

      {/* Label */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Etiqueta</h4>
        <LabelTools
          component={component.label}
          setComponent={(updatedLabel) => { setComponent({ ...component, label: updatedLabel }) }
          }
        />
      </div>

      {/* Input - Email */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Input: Email</h4>
        <InputTools
          component={component.inputs[0]}
          setComponent={(updatedInput) => {
            setComponent({
              ...component,
              inputs: [updatedInput, component.inputs[1]]
            })
          }
          }
        />
      </div>

      {/* Input - Password */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Input: Password</h4>
        <InputTools
          component={component.inputs[1]}
          setComponent={(updatedInput) => {
            setComponent({
              ...component,
              inputs: [component.inputs[0], updatedInput]
            })
          }
          }
        />
      </div>

      {/* Botón */}
      <div>
        <h4 className="font-semibold text-sm text-primary mb-1">Botón</h4>
        <ButtonTools
          component={component.button}
          setComponent={(updatedButton) => { setComponent({ ...component, button: updatedButton }) }
          }
          project={project}
        />
      </div>

    </div>
  )
}
