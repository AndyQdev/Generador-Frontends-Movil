// src/context/ProjectUsersContext.tsx
import React, { createContext, useContext, useState } from 'react'

interface User {
  id: string
  name: string
  // avatarUrl?: string
}

interface ProjectUsersContextValue {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

const ProjectUsersContext = createContext<ProjectUsersContextValue | undefined>(undefined)

export const ProjectUsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])

  return (
    <ProjectUsersContext.Provider value={{ users, setUsers }}>
      {children}
    </ProjectUsersContext.Provider>
  )
}

export const useProjectUsers = (): ProjectUsersContextValue => {
  const context = useContext(ProjectUsersContext)
  if (!context) {
    throw new Error('useProjectUsers must be used within a ProjectUsersProvider')
  }
  return context
}
