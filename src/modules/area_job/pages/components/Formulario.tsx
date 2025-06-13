import {
  type FormularioComponent
} from '../../models/Components'

interface Props {
  comp: FormularioComponent
}

export default function Formulario({ comp }: Props) {
  const { title, fields, button, style } = comp

  const getFontWeight = (weight?: string) => {
    switch (weight) {
      case 'bold':
        return 700
      case 'medium':
        return 500
      case 'light':
        return 300
      default:
        return 400
    }
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        position: 'relative',
        backgroundColor: style?.backgroundColor ?? '#ffffff',
        borderRadius: style?.borderRadius ?? 12,
        paddingTop: style?.padding?.top ?? 24,
        paddingBottom: style?.padding?.bottom ?? 24,
        paddingLeft: style?.padding?.left ?? 24,
        paddingRight: style?.padding?.right ?? 24,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="w-full">
        <p
          className="mb-6 text-center"
          style={{
            fontSize: title.style?.textStyle?.fontSize ?? 18,
            fontWeight: getFontWeight(title.style?.textStyle?.fontWeight),
            color: title.style?.textStyle?.color ?? '#111827'
          }}
        >
          {title.text}
        </p>

        {fields.map((field, idx) => {
          const baseStyle = {
            backgroundColor: field.style?.backgroundColor ?? '#f9fafb',
            borderRadius: field.style?.borderRadius ?? 6,
            border: field.style?.border ?? '1px solid #e5e7eb',
            paddingTop: field.style?.padding?.top ?? 6,
            paddingBottom: field.style?.padding?.bottom ?? 6,
            paddingLeft: field.style?.padding?.left ?? 10,
            paddingRight: field.style?.padding?.right ?? 10,
            fontSize: field.style?.textStyle?.fontSize ?? 14,
            fontWeight: getFontWeight(field.style?.textStyle?.fontWeight),
            color: field.style?.textStyle?.color ?? '#111827'
          }

          switch (field.type) {
            case 'input':
              return (
                <input
                  key={idx}
                  placeholder={field.placeholder}
                  value={field.value}
                  readOnly
                  className="w-full mb-4 rounded-md transition-all"
                  style={baseStyle}
                />
              )

            case 'select':
              return (
                <select
                  key={idx}
                  className="w-full mb-4 rounded-md transition-all"
                  style={baseStyle}
                  value={field.selectedOption}
                  disabled
                >
                  {field.options.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )

            case 'label':
              return (
                <p key={idx} className="mb-4" style={baseStyle}>
                  {field.text}
                </p>
              )

            case 'textArea':
              return (
                <textarea
                  key={idx}
                  placeholder={field.placeholder}
                  value={field.value}
                  readOnly
                  className="w-full mb-4 rounded-md transition-all"
                  style={baseStyle}
                />
              )

            case 'calendar':
              return (
                <input
                  key={idx}
                  type="date"
                  value={field.selectedDate}
                  readOnly
                  className="w-full mb-4 rounded-md transition-all"
                  style={baseStyle}
                />
              )

            case 'checklist':
              return (
                <div key={idx} className="mb-4">
                  <p className="mb-1 text-sm">{field.label}</p>
                  {field.options.map((opt, i) => (
                    <label key={i} className="block">
                      <input type="checkbox" disabled checked={field.selectedOptions?.includes(opt)} /> {opt}
                    </label>
                  ))}
                </div>
              )

            case 'radiobutton':
              return (
                <div key={idx} className="mb-4">
                  <p className="mb-1 text-sm">{field.label}</p>
                  {field.options.map((opt, i) => (
                    <label key={i} className="block">
                      <input type="radio" disabled checked={field.selectedOption === opt} /> {opt}
                    </label>
                  ))}
                </div>
              )

            default:
              return null
          }
        })}

        <button
          className="w-full rounded-md text-center transition-all"
          style={{
            backgroundColor: button.style?.backgroundColor ?? '#2563eb',
            borderRadius: button.style?.borderRadius ?? 8,
            paddingTop: button.style?.padding?.top ?? 8,
            paddingBottom: button.style?.padding?.bottom ?? 8,
            paddingLeft: button.style?.padding?.left ?? 12,
            paddingRight: button.style?.padding?.right ?? 12,
            fontSize: button.style?.textStyle?.fontSize ?? 16,
            fontWeight: getFontWeight(button.style?.textStyle?.fontWeight),
            color: button.style?.textStyle?.color ?? '#ffffff'
          }}
        >
          {button.label}
        </button>
      </div>
    </div>
  )
}
