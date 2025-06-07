import { Edit, MessageSquare } from 'lucide-react'
import Navigation from './navigation'
import { CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface AsideProps {
  isChatOpen: boolean
  onToggleChat: () => void
}

const Aside = ({ onToggleChat }: AsideProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-[260px] z-40
        bg-background dark:bg-dark-background-primary
        border-r shadow-md
        transition-transform duration-300 ease-in-out
        hidden md:flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-[258px]'}
      `}
    >
      <div className="absolute top-10 -right-10 bg-background dark:bg-dark-background-primary p-2 rounded-r-md shadow-md flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsOpen(!isOpen) }}
          className="hover:bg-transparent"
        >
          <Edit className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleChat}
          className="hover:bg-transparent"
        >
          <MessageSquare className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
        </Button>
      </div>

      <div className="h-14 border-b lg:h-[60px] bg-dark-primary-foreground flex items-center justify-center text-light-text-primary dark:text-dark-text-primary font-medium text-lg">
        <div className="flex items-center gap-3">
          <Edit className="w-7 h-7" />
          <CardTitle>UI SKETCH</CardTitle>
        </div>
      </div>
      <Navigation />
    </aside>
  )
}

export default Aside
