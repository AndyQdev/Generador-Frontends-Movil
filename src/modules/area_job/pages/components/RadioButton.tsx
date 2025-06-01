import { type RadioButtonComponent } from '../../models/Components'

interface Props {
  comp: RadioButtonComponent
}

export default function RadioButton({ comp }: Props) {
  return (
    <div className="w-full h-full overflow-y-auto p-2 space-y-1 text-sm"
         style={{ backgroundColor: comp.style?.backgroundColor }}>
      {comp.label && <p className="mb-1 font-medium">{comp.label}</p>}
      {comp.options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name={comp.id}
            value={opt}
            checked={comp.selectedOption === opt}
            readOnly
          />
          <span style={{
            fontSize: comp.style?.textStyle?.fontSize,
            color: comp.style?.textStyle?.color
          }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}
