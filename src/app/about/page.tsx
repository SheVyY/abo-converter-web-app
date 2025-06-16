'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { ArrowLeft, Building, CheckCircle, Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <Link href="/">
              <Button variant="outline" className="h-11 px-6 border-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.backToConverter}
              </Button>
            </Link>
            <LanguageToggle />
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {t.aboutAboConverter}
                </h1>
                <p className="text-lg text-gray-600 font-medium">{t.professionalBankingSuite}</p>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.theStoryBehind}
            </p>
          </div>
          
          {/* Stats Banner */}
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <p className="text-sm text-gray-600">{t.cnbCompliantStat}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-green-600">2</div>
                <p className="text-sm text-gray-600">{t.majorBanksSupported}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <p className="text-sm text-gray-600">{t.filesStored}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Problem Statement */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-red-600 text-xl">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                {t.theChallenge}
              </CardTitle>
              <CardDescription className="text-base">
                {t.bankingComplexityNeeded}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-4 text-lg">{t.manualAboCreation}</h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">{t.eachCzechBank}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">{t.manualFormatting}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">{t.invalidFiles}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">{t.noStandardizedTools}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">{t.technicalEncoding}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-red-600">{t.realImpact}</strong> {t.realImpactDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-green-600 text-xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                {t.ourSolution}
              </CardTitle>
              <CardDescription className="text-base">
                {t.modernAutomation}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-4 text-lg">{t.automatedBankReady}</h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">{t.uploadCsvGet}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">{t.automaticFormat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">{t.realTimeValidation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">{t.properEncoding}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">{t.interactiveData}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-green-600">{t.resultSolution}</strong> {t.resultSolutionDesc}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-600 text-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                {t.keyBenefits}
              </CardTitle>
              <CardDescription className="text-base">
                {t.whyProfessionals}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.lightningFastBenefit}</h4>
                    <p className="text-sm text-gray-600">{t.lightningFastDesc}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.zeroRejections}</h4>
                    <p className="text-sm text-gray-600">{t.zeroRejectionsDesc}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.workflowIntegration}</h4>
                    <p className="text-sm text-gray-600">{t.workflowIntegrationDesc}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.privacyFocused}</h4>
                    <p className="text-sm text-gray-600">{t.privacyFocusedDesc}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supported Banks */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-purple-600 text-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                {t.bankSupport}
              </CardTitle>
              <CardDescription className="text-base">
                {t.leadingCzechBanks}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-red-100 rounded-xl p-6 bg-gradient-to-br from-red-50 to-pink-50 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 text-lg">{t.raiffeisenbank}</h4>
                      <p className="text-sm text-red-600">{t.bankCode}: 5500</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-red-700">{t.features}:</span>
                      <p className="text-red-600">{t.fullAboSupport}</p>
                    </div>
                    <div>
                      <span className="font-medium text-red-700">{t.validation}:</span>
                      <p className="text-red-600">{t.accountChecking}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-blue-100 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-lg">{t.fioBank}</h4>
                      <p className="text-sm text-blue-600">{t.bankCode}: 2010</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">{t.features}:</span>
                      <p className="text-blue-600">{t.specializedFormat}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">{t.processing}:</span>
                      <p className="text-blue-600">{t.optimizedWorkflow}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 font-medium">{t.moreBanksComingSoon}</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <CardContent className="p-8 lg:p-12 relative">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  {t.readyToTransform}
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {t.joinHundreds}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      {t.startConvertingNow}
                      <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-blue-200 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{t.freeNoRegistration}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{t.csvToAboConverter}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {t.professionalBankingTools}
          </p>
        </div>
      </div>
    </div>
  )
}