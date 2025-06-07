// utils/logout.ts
import { getSocket } from '@/lib/socket'

export const logout = (projectId?: string) => {
  const socket = getSocket()
  const user   = JSON.parse(localStorage.getItem('user') || '{}')

  if (socket && user?.id) {
    socket.emit('component_selected', {
      project_id  : projectId,
      page_id     : null,
      component_id: null,
      user_id     : user.id,
      user_name   : user.name
    })
    socket.emit('leaveProject', projectId)
    socket.disconnect()
  }

  localStorage.clear()
}
