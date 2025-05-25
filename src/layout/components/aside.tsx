import { Edit } from 'lucide-react'
import Navigation from './navigation'
import { CardTitle } from '@/components/ui/card'

const Aside = () => {
  return (
    <aside
      className="
        fixed top-0 left-0 h-full w-[260px] z-40
        bg-background dark:bg-dark-background-primary
        border-r shadow-md
        -translate-x-[258px] hover:translate-x-0
        transition-transform duration-300 ease-in-out
        hidden md:flex flex-col
      "
    >
      <div className="absolute top-4 -right-10 bg-background dark:bg-dark-background-primary p-2 rounded-r-md shadow-md">
        <Edit className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
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
