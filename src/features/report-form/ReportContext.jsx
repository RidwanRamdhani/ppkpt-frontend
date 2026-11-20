import { useMemo, useState } from 'react'
import { ReportContext } from './reportContextValue'

const initialData = {
  reporter: { name: '', age: '', gender: '', status: '', identity: '', campus: 'Telkom University', faculty: '', program: '', whatsapp: '', email: '' },
  reporterIsVictim: false,
  victim: { name: '', gender: '', status: '', faculty: '', program: '', contact: '', relation: '' },
  parties: [{ name: '', gender: '', identity: '', campus: '', faculty: '', program: '', contact: '', relation: '' }],
  incidents: [{ dateStart: '', dateEnd: '', location: '', description: '' }],
  violationTypes: [],
  evidence: { chronology: '', additionalDescription: '', reportedElsewhere: false, reportedTo: '', effortsMade: '', expectation: '', files: [], alreadyReportedWhere: false },
  consent: false,
}

export function ReportProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [step, setStep] = useState(1)
  const value = useMemo(() => ({ data, setData, step, setStep }), [data, step])
  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}
