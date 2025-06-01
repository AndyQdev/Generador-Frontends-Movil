import { type TextAreaComponent } from '../../models/Components'

interface Props {
  comp: TextAreaComponent
}

export default function TextArea({ comp }: Props) {
  return (
    <textarea
      placeholder={comp.placeholder ?? ''}
      defaultValue={comp.value ?? ''}
      className="w-full h-full resize-none transition-all"
      style={{
        backgroundColor: comp.style?.backgroundColor ?? '#ffffff',
        borderRadius: comp.style?.borderRadius ?? 6,
        paddingTop: comp.style?.padding?.top ?? 8,
        paddingBottom: comp.style?.padding?.bottom ?? 8,
        paddingLeft: comp.style?.padding?.left ?? 10,
        paddingRight: comp.style?.padding?.right ?? 10,
        fontSize: comp.style?.textStyle?.fontSize ?? 14,
        color: comp.style?.textStyle?.color ?? '#111827'
      }}
    />
  )
}
