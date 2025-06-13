import { type LoginComponent } from '../../models/Components'

interface Props {
  comp: LoginComponent
}

export default function Login({ comp }: Props) {
  const card = comp.card
  const label = comp.label
  const [emailInput, passwordInput] = comp.inputs
  const button = comp.button

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        position: 'relative'
      }}
    >
      <div
        className="w-full h-full rounded-lg transition-all shadow-xl border border-gray-200 bg-white"
        style={{
          backgroundColor: card.style?.backgroundColor ?? '#ffffff',
          borderRadius: card.style?.borderRadius ?? 12,
          paddingTop: card.style?.padding?.top ?? 24,
          paddingBottom: card.style?.padding?.bottom ?? 24,
          paddingLeft: card.style?.padding?.left ?? 24,
          paddingRight: card.style?.padding?.right ?? 24,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}
        >
        <p
          className="mb-4 text-center"
          style={{
            fontSize: label.style?.textStyle?.fontSize ?? 16,
            fontWeight: (() => {
              switch (label.style?.textStyle?.fontWeight) {
                case 'bold': return 700
                case 'medium': return 500
                case 'light': return 300
                default: return 400
              }
            })(),
            color: label.style?.textStyle?.color ?? '#111827'
          }}
        >
          {label.text}
        </p>
        <p className="text-sm text-gray-600 mb-1">Introduzca su correo electrónico</p>
        <input
          className="w-full mb-4 rounded-md transition-all"
          placeholder={emailInput.placeholder}
          value={emailInput.value}
          readOnly
          style={{
            backgroundColor: emailInput.style?.backgroundColor ?? '#f9fafb',
            borderRadius: emailInput.style?.borderRadius ?? 6,
            border: emailInput.style?.border ?? '1px solid #e5e7eb',
            paddingTop: emailInput.style?.padding?.top ?? 6,
            paddingBottom: emailInput.style?.padding?.bottom ?? 6,
            paddingLeft: emailInput.style?.padding?.left ?? 10,
            paddingRight: emailInput.style?.padding?.right ?? 10,
            fontSize: emailInput.style?.textStyle?.fontSize ?? 14,
            fontWeight: (() => {
              switch (emailInput.style?.textStyle?.fontWeight) {
                case 'bold': return 700
                case 'medium': return 500
                case 'light': return 300
                default: return 400
              }
            })(),
            color: emailInput.style?.textStyle?.color ?? '#111827'
          }}
        />
        <p className="text-sm text-gray-600 mb-1">Introduzca su contraseña</p>
        <input
          className="w-full mb-6 rounded-md transition-all"
          placeholder={passwordInput.placeholder}
          value={passwordInput.value}
          readOnly
          style={{
            backgroundColor: passwordInput.style?.backgroundColor ?? '#f9fafb',
            borderRadius: passwordInput.style?.borderRadius ?? 6,
            border: passwordInput.style?.border ?? '1px solid #e5e7eb',
            paddingTop: passwordInput.style?.padding?.top ?? 6,
            paddingBottom: passwordInput.style?.padding?.bottom ?? 6,
            paddingLeft: passwordInput.style?.padding?.left ?? 10,
            paddingRight: passwordInput.style?.padding?.right ?? 10,
            fontSize: passwordInput.style?.textStyle?.fontSize ?? 14,
            fontWeight: (() => {
              switch (passwordInput.style?.textStyle?.fontWeight) {
                case 'bold': return 700
                case 'medium': return 500
                case 'light': return 300
                default: return 400
              }
            })(),
            color: passwordInput.style?.textStyle?.color ?? '#111827'
          }}
        />

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
            fontWeight: (() => {
              switch (button.style?.textStyle?.fontWeight) {
                case 'bold': return 700
                case 'medium': return 500
                case 'light': return 300
                default: return 400
              }
            })(),
            color: button.style?.textStyle?.color ?? '#ffffff'
          }}
        >
          {button.label}
        </button>
      </div>
    </div>
  )
}
