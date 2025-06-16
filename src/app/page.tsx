'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Download, FileText, Building, Info } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from '@/components/language-toggle'

type BankType = 'raiffeisen' | 'fio'

interface CSVRecord {
  'vlastní účet': string
  'účet protistrany': string
  'částka': string
  'VS': string
  'KS': string
  'SS': string
  'název účtu prostistrany': string
  'datum zaúčtování': string
}

// Column mapping for ASCII headers (templates) to Czech headers (internal processing)
const COLUMN_MAPPING: Record<string, string> = {
  'vlastni ucet': 'vlastní účet',
  'ucet protistrany': 'účet protistrany',
  'castka': 'částka',
  'nazev uctu prostistrany': 'název účtu prostistrany',
  'datum zauctovani': 'datum zaúčtování'
}

export default function Home() {
  const { t } = useLanguage()
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [bankType, setBankType] = useState<BankType>('raiffeisen')
  const [detectedBank, setDetectedBank] = useState<BankType | null>(null)

  // Function to detect bank from account number
  const detectBankFromAccount = (accountNumber: string): BankType | null => {
    if (!accountNumber) return null
    
    const cleaned = accountNumber.trim()
    
    // Check if account has bank code (format: account/bankcode)
    if (cleaned.includes('/')) {
      const bankCode = cleaned.split('/')[1]
      if (bankCode === '5500') return 'raiffeisen'
      if (bankCode === '2010') return 'fio'
    }
    
    return null
  }
  const [clientName, setClientName] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<{ filename: string; content: string; recordCount: number; totalAmount: number } | null>(null)
  const [error, setError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [csvPreview, setCsvPreview] = useState<CSVRecord[] | null>(null)
  const [validationStatus, setValidationStatus] = useState<Record<string, { isValid: boolean; message?: string }>>({}) 
  const [conversionProgress, setConversionProgress] = useState(0)

  const validateAndSetFile = async (file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setCsvFile(file)
      setError('')
      setResult(null)
      
      // Load and preview CSV data
      try {
        const csvText = await file.text()
        const records = parseCsv(csvText)
        setCsvPreview(records)
        
        // Auto-detect bank from first payer account
        if (records.length > 0) {
          const firstPayerAccount = records[0]['vlastní účet'] || ''
          const detected = detectBankFromAccount(firstPayerAccount)
          if (detected) {
            setDetectedBank(detected)
            setBankType(detected)
          }
        }
        
        // Validate all accounts in preview
        const validation: Record<string, { isValid: boolean; message?: string }> = {}
        records.forEach((record, index) => {
          const payerAccount = record['vlastní účet'] || ''
          const payeeAccount = record['účet protistrany'] || ''
          
          const payerValid = !payerAccount || validateAccountModulo11(payerAccount)
          const payeeValid = !payeeAccount || validateAccountModulo11(payeeAccount)
          
          validation[`payer_${index}`] = {
            isValid: payerValid,
            message: payerValid ? undefined : t.invalidFormat
          }
          validation[`payee_${index}`] = {
            isValid: payeeValid, 
            message: payeeValid ? undefined : t.invalidFormat
          }
        })
        
        setValidationStatus(validation)
      } catch {
        setError(t.errorReadingCsv)
        setCsvPreview(null)
      }
      
      return true
    } else {
      setError(t.invalidCsvFile)
      setCsvFile(null)
      setCsvPreview(null)
      setDetectedBank(null)
      return false
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await validateAndSetFile(file)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) await validateAndSetFile(file)
  }

  const parseCsv = (csvText: string): CSVRecord[] => {
    // Remove UTF-8 BOM if present
    const cleanText = csvText.replace(/^\uFEFF/, '')
    const lines = cleanText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const records: CSVRecord[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      if (values.length >= headers.length) {
        const record: Record<string, string> = {}
        headers.forEach((header, index) => {
          // Normalize ASCII headers to Czech headers for internal processing
          const normalizedHeader = COLUMN_MAPPING[header] || header
          record[normalizedHeader] = values[index] || ''
        })
        records.push(record as unknown as CSVRecord)
      }
    }

    return records
  }

  const convertCzechToAscii = (text: string): string => {
    const replacements: Record<string, string> = {
      'Č': 'C', 'č': 'c', 'Ř': 'R', 'ř': 'r',
      'Š': 'S', 'š': 's', 'Ž': 'Z', 'ž': 'z',
      'Ý': 'Y', 'ý': 'y', 'Á': 'A', 'á': 'a',
      'É': 'E', 'é': 'e', 'Í': 'I', 'í': 'i',
      'Ó': 'O', 'ó': 'o', 'Ú': 'U', 'ú': 'u',
      'Ů': 'U', 'ů': 'u', 'Ě': 'E', 'ě': 'e',
      'Ď': 'D', 'ď': 'd', 'Ť': 'T', 'ť': 't',
      'Ň': 'N', 'ň': 'n'
    }

    let result = text
    Object.keys(replacements).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), replacements[key])
    })
    return result
  }

  const validateAccountModulo11 = (accountStr: string): boolean => {
    if (!accountStr) return false
    
    // Remove bank code if present
    const account = accountStr.includes('/') ? accountStr.split('/')[0] : accountStr
    
    // Remove dashes and spaces for processing
    const accountClean = account.replace(/[-\s]/g, '')
    
    if (!/^\d+$/.test(accountClean)) return false
    
    // Split into prefix and account number
    let prefix = ''
    let mainAccount = ''
    
    if (account.includes('-')) {
      const parts = account.split('-')
      prefix = parts[0] || ''
      mainAccount = parts[1] || ''
    } else {
      mainAccount = accountClean
    }
    
    // Validate prefix (if exists)
    if (prefix) {
      const prefixClean = prefix.replace(/[^0-9]/g, '')
      if (prefixClean) {
        const weights = [10, 5, 8, 4, 2, 1]
        const paddedPrefix = prefixClean.padStart(6, '0')
        const checksum = paddedPrefix.split('').reduce((sum, digit, i) => 
          sum + (parseInt(digit) * weights[i % weights.length]), 0)
        if (checksum % 11 !== 0) return false
      }
    }
    
    // Validate main account number
    const accountNumClean = mainAccount.replace(/[^0-9]/g, '')
    if (accountNumClean.length > 10) return false
    
    const weights = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
    const paddedAccount = accountNumClean.padStart(10, '0')
    const checksum = paddedAccount.split('').reduce((sum, digit, i) => 
      sum + (parseInt(digit) * weights[i]), 0)
    
    return checksum % 11 === 0
  }

  const generateUHL1Header = (clientName: string, bankType: BankType): string => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '')
    
    let header = 'UHL1' + dateStr
    
    if (bankType === 'raiffeisen') {
      const safeName = convertCzechToAscii(clientName).substring(0, 20).padEnd(20, ' ').toUpperCase()
      header += safeName
      header += '1234567890001999111111222222' // 58 chars total
    } else {
      // FIO uses spaces instead of client name + additional padding
      header += ' '.repeat(20)        // 20 spaces instead of client name
      header += '0000000000'         // Client ID (10 zeros)
      header += '001'                // File interval start
      header += '999'                // File interval end
      header += '000000000000'       // Additional padding (12 zeros)
    }
    
    return header
  }

  const formatAccountNumber = (accountStr: string, bankType: BankType): string => {
    if (!accountStr) return ''
    
    const accountClean = accountStr.trim()
    
    if (bankType === 'fio') {
      // FIO Bank: NEVER include bank codes, just return account part
      if (accountClean.includes('/')) {
        const [accountPart] = accountClean.split('/')
        return accountPart
      }
      return accountClean
    } else {
      // Raiffeisenbank: include bank codes for non-Raiffeisenbank accounts
      const targetBankCode = '5500'
      if (accountClean.includes('/')) {
        const [accountPart, bankCode] = accountClean.split('/')
        if (bankCode !== targetBankCode) {
          return accountPart + '/' + bankCode
        }
        return accountPart
      }
      return accountClean
    }
  }

  const generateABO = (records: CSVRecord[], clientName: string, bankType: BankType): string => {
    const lines: string[] = []
    
    // UHL1 header
    lines.push(generateUHL1Header(clientName, bankType))
    
    // File header
    if (bankType === 'raiffeisen') {
      lines.push('1 1501 111111 5500')
    } else {
      lines.push('1 1501 001000 2010')
    }
    
    // Calculate total amount
    let totalAmount = 0
    records.forEach(record => {
      const amountStr = (record['částka'] || '0').replace(',', '.')
      try {
        totalAmount += Math.abs(parseFloat(amountStr))
      } catch {
        // Skip invalid amounts
      }
    })
    
    // Group header
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '')
    const amountStr = Math.round(totalAmount * 100).toString()
    
    // Get payer account from first record
    const payerAccount = records.length > 0 ? formatAccountNumber(records[0]['vlastní účet'] || '', bankType) : ''
    
    if (bankType === 'fio') {
      lines.push(`2 ${payerAccount} ${amountStr.padStart(14, '0')} ${dateStr}`)  // FIO requires account number
    } else {
      lines.push(`2 ${amountStr} ${dateStr}`)
    }
    
    // Payment items
    records.forEach(record => {
      const fields: string[] = []
      
      // Payee account
      const payeeAcc = formatAccountNumber(record['účet protistrany'] || '', bankType)
      if (payeeAcc) fields.push(payeeAcc)
      
      // Amount
      const amountStr = (record['částka'] || '0').replace(',', '.')
      try {
        const amountFloat = parseFloat(amountStr)
        const amountInt = Math.round(Math.abs(amountFloat) * 100)
        if (bankType === 'fio') {
          fields.push(amountInt.toString().padStart(12, '0'))  // FIO uses 12-digit for payment items
        } else {
          fields.push(amountInt.toString())
        }
      } catch {
        fields.push(bankType === 'fio' ? '000000000000' : '0')  // Updated error fallback
      }
      
      // Variable symbol
      const vs = (record['VS'] || '').trim()
      if (vs && vs !== '0') {
        fields.push(vs.padStart(10, '0'))
      } else if (bankType === 'fio') {
        fields.push(' ')
      }
      
      // Bank code + Constant symbol
      const ks = (record['KS'] || '').trim()
      const payeeFull = record['účet protistrany'] || ''
      let bankCode = bankType === 'raiffeisen' ? '5500' : '2010'
      if (payeeFull.includes('/')) {
        bankCode = payeeFull.split('/')[1]
      }
      
      const bankCodePadded = bankCode.padEnd(4, '0').substring(0, 4)
      const ksPadded = ks ? ks.padEnd(4, '0').substring(0, 4) : '0000'
      fields.push(bankCodePadded + ksPadded)
      
      // Specific symbol
      const ss = (record['SS'] || '').trim()
      if (ss && ss !== '0') {
        fields.push(ss.padStart(10, '0'))
      } else if (bankType === 'fio') {
        fields.push(' ')
      }
      
      // AV field
      const clientName = (record['název účtu prostistrany'] || '').trim()
      if (clientName) {
        fields.push('AV:' + clientName.substring(0, 35))
      } else if (bankType === 'fio') {
        fields.push(' ')
      }
      
      lines.push(fields.join(' '))
    })
    
    // Group end and file end
    lines.push('3 +')
    lines.push('5 +')
    
    return lines.join('\r\n')
  }

  const handleConvert = async () => {
    if (!csvFile) {
      setError(t.selectCsvFile)
      return
    }
    
    if (bankType === 'raiffeisen' && !clientName.trim()) {
      setError(t.enterClientName)
      return
    }

    setIsConverting(true)
    setConversionProgress(0)
    setError('')
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      const csvText = await csvFile.text()
      const records = parseCsv(csvText)
      
      if (records.length === 0) {
        throw new Error(t.noValidRecords)
      }

      // Calculate total amount
      let totalAmount = 0
      records.forEach(record => {
        const amountStr = (record['částka'] || '0').replace(',', '.')
        try {
          totalAmount += Math.abs(parseFloat(amountStr))
        } catch {
          // Skip invalid amounts
        }
      })

      // Validate account numbers
      const validationWarnings: string[] = []
      records.forEach((record, index) => {
        const payerAccount = record['vlastní účet'] || ''
        const payeeAccount = record['účet protistrany'] || ''
        
        if (payerAccount && !validateAccountModulo11(payerAccount)) {
          validationWarnings.push(`Řádek ${index + 2}: Plátce "${payerAccount}" je neplatný (ČNB modulo 11)`)
        }
        if (payeeAccount && !validateAccountModulo11(payeeAccount)) {
          validationWarnings.push(`Řádek ${index + 2}: Příjemce "${payeeAccount}" je neplatný (ČNB modulo 11)`)
        }
      })

      if (validationWarnings.length > 0) {
        setError(`${t.accountValidationWarnings}:\n${validationWarnings.join('\n')}`)
        return
      }

      const aboContent = generateABO(records, clientName.trim(), bankType)
      const now = new Date()
      const dateStr = now.toISOString().substring(0, 10).replace(/-/g, '')
      const bankPrefix = bankType === 'raiffeisen' ? 'raiffeisen' : 'fio'
      const filename = `${bankPrefix}_payments_${dateStr}.kpc`

      // Complete progress
      setConversionProgress(100)
      
      setResult({
        filename,
        content: aboContent,
        recordCount: records.length,
        totalAmount
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t.conversionFailed)
    } finally {
      setIsConverting(false)
      setConversionProgress(0)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const blob = new Blob([result.content], { type: 'text/plain;charset=windows-1250' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">{t.subtitle}</p>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                {t.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Link href="/about">
                <Button variant="outline" className="flex items-center gap-2 h-11 px-6 border-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                  <Info className="h-4 w-4" />
                  {t.aboutTool}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Feature Banner */}
          <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <strong>{t.lightningFast}</strong><br />
                  <span className="text-gray-500">{t.lightningDesc}</span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <strong>{t.cnbValidated}</strong><br />
                  <span className="text-gray-500">{t.cnbDesc}</span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <strong>{t.multiBankSupport}</strong><br />
                  <span className="text-gray-500">{t.multiBankDesc}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload and Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t.uploadConfigure}
              </CardTitle>
              <CardDescription>
                {t.uploadConfigureDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="csv-file">{t.csvFile}</Label>
                <div 
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    {t.dragDrop}
                  </p>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="csv-file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t.chooseFile}
                  </Label>
                </div>
                {csvFile && (
                  <div className="mt-2 space-y-3">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-green-700 font-medium">
                              ✓ {csvFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(csvFile.size / 1024).toFixed(1)} KB • {new Date(csvFile.lastModified).toLocaleDateString()}
                              {csvPreview && <span> • {csvPreview.length} records</span>}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCsvFile(null)
                            setCsvPreview(null)
                            setValidationStatus({})
                            setResult(null)
                            setError('')
                            setDetectedBank(null)
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {/* CSV Preview */}
                    {csvPreview && csvPreview.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t.dataPreview}
                          </h4>
                          <span className="text-xs text-gray-500">{csvPreview.length} {t.rows}</span>
                        </div>
                        <div className="overflow-x-auto max-h-64">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.from}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.to}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.amount}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VS</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.recipient}</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {csvPreview.slice(0, 5).map((record, index) => {
                                const payerValid = validationStatus[`payer_${index}`]?.isValid !== false
                                const payeeValid = validationStatus[`payee_${index}`]?.isValid !== false
                                const rowValid = payerValid && payeeValid
                                
                                return (
                                  <tr key={index} className={`${!rowValid ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      <div className={`flex items-center gap-2 ${!payerValid ? 'text-red-600' : 'text-gray-900'}`}>
                                        {record['vlastní účet'] || '-'}
                                        {!payerValid && <span className="text-red-500" title="Invalid account">⚠️</span>}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      <div className={`flex items-center gap-2 ${!payeeValid ? 'text-red-600' : 'text-gray-900'}`}>
                                        {record['účet protistrany'] || '-'}
                                        {!payeeValid && <span className="text-red-500" title="Invalid account">⚠️</span>}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {record['částka'] || '-'} CZK
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {record['VS'] || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 max-w-32 truncate" title={record['název účtu prostistrany'] || ''}>
                                      {record['název účtu prostistrany'] || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      {rowValid ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          ✓ {t.valid}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          ⚠ {t.invalid}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                          {csvPreview.length > 5 && (
                            <div className="px-4 py-2 bg-gray-50 text-center">
                              <span className="text-xs text-gray-500">... a dalších {csvPreview.length - 5} {t.rows}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Template Downloads */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">{t.quickStartTemplates}</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  {t.quickStartDesc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <a
                    href="/templates/raiffeisen_template.csv"
                    download="raiffeisen_template.csv"
                    className="flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    🏦 Raiffeisenbank
                  </a>
                  <a
                    href="/templates/fio_template.csv"
                    download="fio_template.csv"
                    className="flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    🏛️ FIO Bank
                  </a>
                </div>
                <p className="text-xs text-blue-600">
                  {t.editInstructions}
                </p>
              </div>

              {/* Bank Detection/Selection */}
              <div>
                <Label htmlFor="bank-select">{t.bank}</Label>
                {detectedBank ? (
                  <div className="mt-1 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-green-800">
                            {bankType === 'raiffeisen' ? 'Raiffeisenbank (5500)' : 'FIO Bank (2010)'}
                          </span>
                          <p className="text-xs text-green-600">{t.autoDetected}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDetectedBank(null)
                        }}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        {t.changeBankSelection}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select value={bankType} onValueChange={(value: BankType) => setBankType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raiffeisen">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Raiffeisenbank (5500)
                        </div>
                      </SelectItem>
                      <SelectItem value="fio">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          FIO Bank (2010)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Client Name */}
              <div>
                <Label htmlFor="client-name">
                  {t.clientName} 
                  {bankType === 'fio' && <span className="text-xs text-gray-500"> {t.clientNameFio}</span>}
                  {bankType === 'raiffeisen' && <span className="text-xs text-gray-500"> {t.clientNameRaiff}</span>}
                </Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value.substring(0, 20))}
                  placeholder={bankType === 'fio' ? t.clientNameNotRequired : t.clientNamePlaceholder}
                  className="mt-1"
                  disabled={bankType === 'fio'}
                />
                {bankType === 'raiffeisen' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {clientName.length}/20 {t.clientNameChars}
                  </p>
                )}
                {bankType === 'fio' && (
                  <p className="text-xs text-blue-600 mt-1">
                    {t.fioInfo}
                  </p>
                )}
              </div>

              {/* Convert Button */}
              <div className="space-y-3">
                {/* Progress Bar */}
                {isConverting && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${conversionProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <Button
                  onClick={handleConvert}
                  disabled={!csvFile || (bankType === 'raiffeisen' && !clientName.trim()) || isConverting}
                  className="w-full relative overflow-hidden group"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isConverting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t.converting} {conversionProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>{t.convertToAbo}</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.conversionResults}
              </CardTitle>
              <CardDescription>
                {t.conversionResultsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Success Banner */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 mb-3 text-lg">{t.conversionSuccessful}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="text-green-700"><strong>{t.file}:</strong> {result.filename}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="text-green-700"><strong>{t.bank}:</strong> {bankType === 'raiffeisen' ? 'Raiffeisenbank (5500)' : 'FIO Bank (2010)'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              <span className="text-green-700"><strong>{t.records}:</strong> {result.recordCount}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              <span className="text-green-700"><strong>{t.total}:</strong> {result.totalAmount.toLocaleString('cs-CZ')} CZK</span>
                            </div>
                            {bankType === 'raiffeisen' && (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                <span className="text-green-700"><strong>{t.client}:</strong> {clientName}</span>
                              </div>
                            )}
                            {bankType === 'fio' && (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                <span className="text-green-700"><strong>{t.format}:</strong> {t.cnbCompliant}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleDownload} 
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      {t.downloadAbo}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setResult(null)
                        setCsvFile(null)
                        setCsvPreview(null)
                        setValidationStatus({})
                        setError('')
                        setDetectedBank(null)
                      }}
                      className="px-6 h-12 border-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                      title={t.newConversion}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t.newConversion}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{t.noResults}</p>
                  <p className="text-sm">{t.noResultsDesc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          {t.professionalTools}
        </div>
      </div>
    </div>
  )
}
