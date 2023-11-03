import Sidebar from './_components/sidebar'
import React from 'react'

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div>
      <Sidebar />
      {children}</div>
  )
}

export default WorkspaceLayout 
