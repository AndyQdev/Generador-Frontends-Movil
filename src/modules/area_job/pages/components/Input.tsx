import { type InputComponent } from '../../models/Components'

interface Props {
  comp: InputComponent
}

export default function Input({ comp }: Props) {
  return (
    <input
      className="w-full h-full transition-all"
      placeholder={comp.placeholder ?? ''}
      style={{
        backgroundColor: comp.style?.backgroundColor ?? '#ffffff',
        borderRadius: comp.style?.borderRadius ?? 6,
        paddingTop: comp.style?.padding?.top ?? 6,
        paddingBottom: comp.style?.padding?.bottom ?? 6,
        paddingLeft: comp.style?.padding?.left ?? 10,
        paddingRight: comp.style?.padding?.right ?? 10,
        fontSize: comp.style?.textStyle?.fontSize ?? 14,
        fontWeight: (() => {
          switch (comp.style?.textStyle?.fontWeight) {
            case 'bold': return 700
            case 'medium': return 500
            case 'light': return 300
            default: return 400
          }
        })(),
        color: comp.style?.textStyle?.color ?? '#111827'
      }}
      value={comp.value ?? ''}
      readOnly // Puedes quitar esto si en edición deseas permitir tipeo
    />
  )
}
