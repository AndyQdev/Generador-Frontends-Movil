import { type LabelComponent } from '../../models/Components'

interface Props {
  comp: LabelComponent
}

export default function Label({ comp }: Props) {
  return (
    <span
      className="w-full h-full flex items-center justify-start"
      style={{
        fontSize: comp.style?.textStyle?.fontSize,
        fontWeight: (() => {
          switch (comp.style?.textStyle?.fontWeight) {
            case 'bold': return 700
            case 'medium': return 500
            case 'light': return 300
            default: return 400
          }
        })(),
        color: comp.style?.textStyle?.color
      }}
    >
      {comp.text}
    </span>
  )
}
