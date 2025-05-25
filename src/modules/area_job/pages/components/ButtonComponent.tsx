import { type ButtonComponent } from '../../models/Components'

interface Props {
  comp: ButtonComponent
}

export default function Button({ comp }: Props) {
  return (
    <button
      className="w-full h-full flex items-center justify-center transition-all"
      style={{
        backgroundColor: comp.style?.backgroundColor ?? '#2563eb',
        borderRadius: comp.style?.borderRadius ?? 8,
        paddingTop: comp.style?.padding?.top ?? 8,
        paddingBottom: comp.style?.padding?.bottom ?? 8,
        paddingLeft: comp.style?.padding?.left ?? 12,
        paddingRight: comp.style?.padding?.right ?? 12,
        fontSize: comp.style?.textStyle?.fontSize ?? 16,
        fontWeight: (() => {
          switch (comp.style?.textStyle?.fontWeight) {
            case 'bold': return 700
            case 'medium': return 500
            case 'light': return 300
            default: return 400
          }
        })(),
        color: comp.style?.textStyle?.color ?? '#ffffff'
      }}
    >
      {comp.label}
    </button>
  )
}
