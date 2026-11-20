import { useContext } from 'react'
import { ReportContext } from './reportContextValue'

export function useReport() {
  const context = useContext(ReportContext)
  if (!context) throw new Error('useReport must be used within ReportProvider')
  return context
}
