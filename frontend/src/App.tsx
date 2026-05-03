import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuthStore } from '@/stores/authStore'

// ── Lazy imports — each page becomes a separate JS chunk ──────────
// Auth
const LoginPage             = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))

// Direction & Stratégie
const DashboardPage         = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ExecutiveInsightPage  = lazy(() => import('@/pages/ExecutiveInsightPage').then(m => ({ default: m.ExecutiveInsightPage })))
const AnalyticsDashboardPage= lazy(() => import('@/pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })))
const CrmPage               = lazy(() => import('@/pages/CrmPage').then(m => ({ default: m.CrmPage })))

// Cœur de métier DMC
const ProjectsPage          = lazy(() => import('@/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })))
const ProjectCreatePage     = lazy(() => import('@/pages/ProjectCreatePage').then(m => ({ default: m.ProjectCreatePage })))
const InvoicesPage          = lazy(() => import('@/pages/InvoicePage').then(m => ({ default: m.InvoicePage })))
const ErpInvoicingCenter    = lazy(() => import('@/pages/ErpInvoicingCenter').then(m => ({ default: m.ErpInvoicingCenter })))
const ProjectDetailPage     = lazy(() => import('@/pages/ProjectDetailPageFixed').then(m => ({ default: m.ProjectDetailPage })))
const QuotationsPage        = lazy(() => import('@/pages/QuotationsPage').then(m => ({ default: m.QuotationsPage })))
const ItineraryPage         = lazy(() => import('@/pages/ItineraryPage').then(m => ({ default: m.ItineraryPage })))
const ItineraryTemplatesPage = lazy(() => import('@/pages/ItineraryTemplatesPage').then(m => ({ default: m.ItineraryTemplatesPage })))
const MediaLibraryPage      = lazy(() => import('@/pages/MediaLibraryPage').then(m => ({ default: m.MediaLibraryPage })))

// Opérations Live
const OperationsPage        = lazy(() => import('@/pages/OperationsPage').then(m => ({ default: m.OperationsPage })))
const OperationsCalendarPage= lazy(() => import('@/pages/OperationsCalendarPage').then(m => ({ default: m.OperationsCalendarPage })))
const ConciergePage         = lazy(() => import('@/pages/ConciergePage').then(m => ({ default: m.ConciergePage })))
const QualityPage           = lazy(() => import('@/pages/QualityPage').then(m => ({ default: m.QualityPage })))

// Studio Créatif (IA)
const CircuitGeneratorPage  = lazy(() => import('@/pages/CircuitGeneratorPage').then(m => ({ default: m.CircuitGeneratorPage })))
const ProposalStudioPage    = lazy(() => import('@/pages/ProposalStudioPage').then(m => ({ default: m.ProposalStudioPage })))
const ProposalWriterPage    = lazy(() => import('@/pages/ProposalWriterPage').then(m => ({ default: m.ProposalWriterPage })))
const IntegrationsPage      = lazy(() => import('@/pages/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })))
const SustainabilityPage    = lazy(() => import('@/pages/SustainabilityPage').then(m => ({ default: m.SustainabilityPage })))
const PaymentAgentPage      = lazy(() => import('@/pages/PaymentAgentPage').then(m => ({ default: m.PaymentAgentPage })))
const PricingCoachPage      = lazy(() => import('@/pages/PricingCoachPage').then(m => ({ default: m.PricingCoachPage })))
const M365HubPage           = lazy(() => import('@/pages/M365HubPage').then(m => ({ default: m.M365HubPage })))
const O2CHubPage            = lazy(() => import('@/pages/O2CHubPage').then(m => ({ default: m.O2CHubPage })))
const P2PHubPage            = lazy(() => import('@/pages/P2PHubPage').then(m => ({ default: m.P2PHubPage })))
const DataHubPage           = lazy(() => import('@/pages/DataHubPage').then(m => ({ default: m.DataHubPage })))
const AgentDesignerPage     = lazy(() => import('@/pages/AgentDesignerPage').then(m => ({ default: m.AgentDesignerPage })))
const CotationAdvancedPage  = lazy(() => import('@/pages/CotationAdvancedPage').then(m => ({ default: m.CotationAdvancedPage })))
const TravelDesignerPage    = lazy(() => import('@/pages/TravelDesignerPage').then(m => ({ default: m.TravelDesignerPage })))
const ActivitiesCatalogPage = lazy(() => import('@/pages/ActivitiesCatalogPage').then(m => ({ default: m.ActivitiesCatalogPage })))
const DocumentTemplatesPage = lazy(() => import('@/pages/DocumentTemplatesPage').then(m => ({ default: m.DocumentTemplatesPage })))

// Logistique & Ressources
const HorizonPortalPage     = lazy(() => import('@/pages/HorizonPortalPage').then(m => ({ default: m.HorizonPortalPage })))
const HotelInventoryPage    = lazy(() => import('@/pages/HotelInventoryPage').then(m => ({ default: m.HotelInventoryPage })))
const GuideManagementPage   = lazy(() => import('@/pages/GuideManagementPage').then(m => ({ default: m.GuideManagementPage })))
const RestaurantInventoryPage = lazy(() => import('@/pages/RestaurantInventoryPage').then(m => ({ default: m.RestaurantInventoryPage })))
const FieldOpsPortal         = lazy(() => import('@/pages/FieldOpsPortal').then(m => ({ default: m.FieldOpsPortal })))
const TransportCommandCenter = lazy(() => import('@/pages/TransportCommandCenter').then(m => ({ default: m.TransportCommandCenter })))
const FinancialStrategyPage  = lazy(() => import('@/pages/FinancialStrategyPage').then(m => ({ default: m.FinancialStrategyPage })))
const FinancialDashboardPage = lazy(() => import('@/pages/FinancialDashboardPage').then(m => ({ default: m.FinancialDashboardPage })))
const RoomingListPage       = lazy(() => import('@/pages/RoomingListPage').then(m => ({ default: m.RoomingListPage })))
const CateringPlanPage      = lazy(() => import('@/pages/CateringPlanPage').then(m => ({ default: m.CateringPlanPage })))
const FleetOptimizerPage    = lazy(() => import('@/pages/FleetOptimizerPage').then(m => ({ default: m.FleetOptimizerPage })))

// Gestion & Finance
const BillingPage           = lazy(() => import('@/pages/BillingPage').then(m => ({ default: m.BillingPage })))
const ReportBuilderPage     = lazy(() => import('@/pages/ReportBuilderPage').then(m => ({ default: m.ReportBuilderPage })))
const ReferencesPage        = lazy(() => import('@/pages/ReferencesPage').then(m => ({ default: m.ReferencesPage })))
const ForexDashboardPage    = lazy(() => import('@/pages/ForexDashboardPage').then(m => ({ default: m.ForexDashboardPage })))
const PricingSimulator      = lazy(() => import('@/pages/PricingSimulator').then(m => ({ default: m.PricingSimulator })))
const SettingsPage          = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

// B2B & Notifications
const ClientPortalPage      = lazy(() => import('@/pages/ClientPortalPage').then(m => ({ default: m.ClientPortalPage })))
const NotificationCenterPage= lazy(() => import('@/pages/NotificationCenterPage').then(m => ({ default: m.NotificationCenterPage })))
const GuidePortalPageLazy   = lazy(() => import('@/pages/GuidePortalPage').then(m => ({ default: m.GuidePortalPage })))
const DriverPortalPageLazy  = lazy(() => import('@/pages/DriverPortalPage').then(m => ({ default: m.DriverPortalPage })))
const ProposalViewPageLazy  = lazy(() => import('@/pages/ProposalViewPage').then(m => ({ default: m.ProposalViewPage })))
const CompanionPageLazy    = lazy(() => import('./pages/CompanionPage'))
const OpsCockpitPageLazy   = lazy(() => import('./pages/OpsCockpitPage'))
const SubAgentPortalPageLazy = lazy(() => import('./pages/SubAgentPortalPage'))
const LeaderboardPage       = lazy(() => import('@/pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })))

// EXTRAS — 11 nouvelles fonctionnalités
const ClientPortalInteractivePage = lazy(() => import('@/pages/ClientPortalInteractivePage').then(m => ({ default: m.ClientPortalInteractivePage })))
const ExcelExportPage       = lazy(() => import('@/pages/ExcelExportPage').then(m => ({ default: m.ExcelExportPage })))
const WhatIfSimulatorPage   = lazy(() => import('@/pages/WhatIfSimulatorPage').then(m => ({ default: m.WhatIfSimulatorPage })))
const ProjectClonePage      = lazy(() => import('@/pages/ProjectClonePage').then(m => ({ default: m.ProjectClonePage })))
const PassengerManagementPage = lazy(() => import('@/pages/PassengerManagementPage').then(m => ({ default: m.PassengerManagementPage })))
const BudgetTrackerPage     = lazy(() => import('@/pages/BudgetTrackerPage').then(m => ({ default: m.BudgetTrackerPage })))
const AllotmentManagerPage  = lazy(() => import('@/pages/AllotmentManagerPage').then(m => ({ default: m.AllotmentManagerPage })))
const WhatsAppHubPage       = lazy(() => import('@/pages/WhatsAppHubPage').then(m => ({ default: m.WhatsAppHubPage })))
const FlightSearchPage      = lazy(() => import('@/pages/FlightSearchPage').then(m => ({ default: m.FlightSearchPage })))
const SupplierScoringPage   = lazy(() => import('@/pages/SupplierScoringPage').then(m => ({ default: m.SupplierScoringPage })))
const SupplierAuditPage     = lazy(() => import('@/pages/SupplierAuditPage').then(m => ({ default: m.SupplierAuditPage })))
const GroupOpsHubPage       = lazy(() => import('@/pages/GroupOpsHubPage').then(m => ({ default: m.GroupOpsHubPage })))

// SAP ERP integration
const ErpIntegrationsPage   = lazy(() => import('@/pages/ErpIntegrationsPage').then(m => ({ default: m.ErpIntegrationsPage })))

// Lead Generation
const LeadGenerationPage    = lazy(() => import('@/pages/LeadGenerationPage').then(m => ({ default: m.LeadGenerationPage })))
const AgencyDetailPage      = lazy(() => import('@/pages/AgencyDetailPage').then(m => ({ default: m.AgencyDetailPage })))

// War Room & Cash Pulse
const WarRoomPage           = lazy(() => import('@/pages/WarRoomPage').then(m => ({ default: m.WarRoomPage })))
const CashPulsePage         = lazy(() => import('@/pages/CashPulsePage').then(m => ({ default: m.CashPulsePage })))

// Itinerary Search (Memory)
const ItinerarySearchPage   = lazy(() => import('@/pages/ItinerarySearchPage').then(m => ({ default: m.ItinerarySearchPage })))

// Site Inspection 360
const SiteInspectionPage    = lazy(() => import('@/pages/SiteInspectionPage').then(m => ({ default: m.SiteInspectionPage })))

// AI Concierge Hub
const AiConciergePage       = lazy(() => import('@/pages/AiConciergePage').then(m => ({ default: m.AiConciergePage })))

// Sustainability (Eco-Luxe)
const SustainabilityPage_   = lazy(() => import('@/pages/SustainabilityPage').then(m => ({ default: m.SustainabilityPage })))

// Voice Assistant
const VoiceAssistantPage    = lazy(() => import('@/pages/VoiceAssistantPage').then(m => ({ default: m.VoiceAssistantPage })))

// Live Ops Sync Hub
const OperationsWarRoomPage = lazy(() => import('@/pages/OperationsWarRoomPage').then(m => ({ default: m.OperationsWarRoomPage })))
const LiveOpsSyncPage       = lazy(() => import('@/pages/LiveOpsSyncPage').then(m => ({ default: m.LiveOpsSyncPage })))
const LogisticsControlTower = lazy(() => import('@/pages/LogisticsControlTower').then(m => ({ default: m.LogisticsControlTower })))

// Suivi groupe temps réel — incidents & journey tracking
const GroupLiveTrackingPage = lazy(() => import('@/pages/GroupLiveTrackingPage').then(m => ({ default: m.GroupLiveTrackingPage })))

// Pipeline Commercial Kanban
const SalesPipelinePage     = lazy(() => import('@/pages/SalesPipelinePage').then(m => ({ default: m.SalesPipelinePage })))

// Moteur IA DMC — Brief → Package complet
const AIDmcEnginePage       = lazy(() => import('@/pages/AIDmcEnginePage').then(m => ({ default: m.AIDmcEnginePage })))

// B2B Hotel Booking Portal
const B2BHotelPortalPage    = lazy(() => import('@/pages/B2BHotelPortalPage').then(m => ({ default: m.B2BHotelPortalPage })))

// 7 pages précédemment non routées
const AIAssistantPage       = lazy(() => import('@/pages/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })))
const CircuitModelPage      = lazy(() => import('@/pages/CircuitModelPage').then(m => ({ default: m.CircuitModelPage })))
const ContentStudioPage     = lazy(() => import('@/pages/ContentStudioPage').then(m => ({ default: m.ContentStudioPage })))
const EmailQuotationPage    = lazy(() => import('@/pages/EmailQuotationPage').then(m => ({ default: m.EmailQuotationPage })))
const ItineraryBuilderPage  = lazy(() => import('@/pages/ItineraryBuilderPage').then(m => ({ default: m.ItineraryBuilderPage })))
const OperationsFulfillmentPage = lazy(() => import('@/pages/OperationsFulfillmentPage').then(m => ({ default: m.OperationsFulfillmentPage })))
const PassengerAppPage      = lazy(() => import('@/pages/PassengerAppPage').then(m => ({ default: m.PassengerAppPage })))

// CRM complet
const CrmAnalyticsPage      = lazy(() => import('@/pages/CrmAnalyticsPage').then(m => ({ default: m.CrmAnalyticsPage })))

// ── Skeleton loader shown during page transitions ─────────────────
function PageSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      flexDirection: 'column',
      gap: '16px',
      opacity: 0.5,
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: 'rgba(255,255,255,0.6)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── QueryClient — performance-optimized defaults ──────────────────
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) return false
        return failureCount < 2
      },
      staleTime: 2 * 60_000,          // 2 min — reduce redundant network calls
      gcTime: 10 * 60_000,            // 10 min in-memory cache
      refetchOnWindowFocus: false,     // Avoid refetching on tab switch
      refetchOnReconnect: 'always',    // Always refetch on network recovery
      refetchOnMount: 'always',        // Ensure data freshness on mount
      networkMode: 'offlineFirst',     // Use cache when offline (PWA support)
    },
    mutations: {
      retry: false,
      networkMode: 'online',
    },
  },
})

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    // Validate persisted token on mount — clears stale state if expired
    if (token) fetchMe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <ErrorBoundary>
        <OfflineIndicator />
        <PWAUpdatePrompt />
        <BrowserRouter>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* Public proposal view — no auth required */}
              <Route path="/p/:token" element={<ProposalViewPageLazy />} />
              <Route path="/companion/:token" element={<CompanionPageLazy />} />

              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* DIRECTION & STRATÉGIE */}
                <Route path="/dashboard"             element={<DashboardPage />} />
                <Route path="/executive-insights"    element={<ExecutiveInsightPage />} />
                <Route path="/analytics"             element={<AnalyticsDashboardPage />} />
                <Route path="/crm"                   element={<CrmPage />} />
                <Route path="/crm/agencies/:id"      element={<AgencyDetailPage />} />

                {/* CŒUR DE MÉTIER DMC */}
                <Route path="/projects"              element={<ProjectsPage />} />
                <Route path="/projects/new"          element={<ProjectCreatePage />} />
                <Route path="/projects/:projectId"   element={<ProjectDetailPage />} />
                <Route path="/finance/invoices"      element={<InvoicesPage />} />
                <Route path="/finance/erp-center"    element={<ErpInvoicingCenter />} />
                <Route path="/finance/quotations"    element={<QuotationsPage />} />
                <Route path="/itineraries"           element={<ItineraryPage />} />
                <Route path="/itinerary-templates"   element={<ItineraryTemplatesPage />} />
                <Route path="/media-library"         element={<MediaLibraryPage />} />

                {/* OPÉRATIONS LIVE */}
                <Route path="/operations"            element={<OperationsPage />} />
                <Route path="/operations/calendar"   element={<OperationsCalendarPage />} />
                <Route path="/operations/concierge"  element={<ConciergePage />} />
                <Route path="/quality"               element={<QualityPage />} />

                {/* STUDIO CRÉATIF (IA) */}
                <Route path="/circuit-generator"     element={<CircuitGeneratorPage />} />
                <Route path="/proposal-studio"       element={<ProposalStudioPage />} />
                <Route path="/proposal-writer"       element={<ProposalWriterPage />} />
                <Route path="/integrations"          element={<IntegrationsPage />} />
                <Route path="/sustainability"        element={<SustainabilityPage_ />} />
                <Route path="/payment-agent"         element={<PaymentAgentPage />} />
                <Route path="/pricing-coach"         element={<PricingCoachPage />} />
                <Route path="/m365"                  element={<M365HubPage />} />
                <Route path="/o2c"                   element={<O2CHubPage />} />
                <Route path="/p2p"                   element={<P2PHubPage />} />
                <Route path="/data-hub"              element={<DataHubPage />} />
                <Route path="/agent-designer"       element={<AgentDesignerPage />} />
                <Route path="/cotation-advanced"     element={<CotationAdvancedPage />} />
                <Route path="/travel-designer"       element={<TravelDesignerPage />} />
                <Route path="/activities"            element={<ActivitiesCatalogPage />} />
                <Route path="/document-templates"    element={<DocumentTemplatesPage />} />

                {/* LOGISTIQUE & RESSOURCES */}
                <Route path="/portal/horizon"        element={<HorizonPortalPage />} />
                <Route path="/inventory/hotels"      element={<HotelInventoryPage />} />
                <Route path="/inventory/guides"      element={<GuideManagementPage />} />
                <Route path="/inventory/restaurants" element={<RestaurantInventoryPage />} />
                <Route path="/fleet-optimizer"       element={<FleetOptimizerPage />} />

                {/* GESTION & FINANCE */}
                <Route path="/invoices"              element={<BillingPage />} />
                <Route path="/reports"               element={<ReportBuilderPage />} />
                <Route path="/references"            element={<ReferencesPage />} />
                <Route path="/forex"                 element={<ForexDashboardPage />} />
                <Route path="/pricing-simulator"     element={<PricingSimulator />} />
                <Route path="/settings"              element={<SettingsPage />} />

                {/* B2B & NOTIFICATIONS */}
                <Route path="/portal"                element={<ClientPortalPage />} />
                <Route path="/portal/guide"          element={<GuidePortalPageLazy />} />
                <Route path="/portal/driver"         element={<DriverPortalPageLazy />} />
                <Route path="/notifications"         element={<NotificationCenterPage />} />
                
                {/* FIELD OPERATIONS (Drivers/Guides) */}
                <Route path="/field-ops"             element={<FieldOpsPortal />} />
                <Route path="/operations/command-center" element={<TransportCommandCenter />} />
                <Route path="/operations/war-room"   element={<OperationsWarRoomPage />} />
                <Route path="/operations/cockpit"    element={<OpsCockpitPageLazy />} />
                <Route path="/operations/logistics-tower" element={<LogisticsControlTower />} />
                <Route path="/portal"                element={<SubAgentPortalPageLazy />} />
                <Route path="/operations/supplier-audit" element={<SupplierAuditPage />} />
                <Route path="/operations/rooming"    element={<RoomingListPage />} />
                <Route path="/operations/catering"   element={<CateringPlanPage />} />
                
                {/* FINANCE & STRATEGY */}
                <Route path="/finance/strategy"      element={<FinancialStrategyPage />} />
                <Route path="/finance/p-l"           element={<FinancialDashboardPage />} />
                <Route path="/gamification/leaderboard" element={<LeaderboardPage />} />

                {/* EXTRAS — 11 nouvelles fonctionnalités haute valeur */}
                <Route path="/client-portal"    element={<ClientPortalInteractivePage />} />
                <Route path="/export-excel"     element={<ExcelExportPage />} />
                <Route path="/what-if"          element={<WhatIfSimulatorPage />} />
                <Route path="/projects/clone"   element={<ProjectClonePage />} />
                <Route path="/passengers"       element={<PassengerManagementPage />} />
                <Route path="/budget-tracker"   element={<BudgetTrackerPage />} />
                <Route path="/allotments"       element={<AllotmentManagerPage />} />
                <Route path="/whatsapp"         element={<WhatsAppHubPage />} />
                <Route path="/flight-search"    element={<FlightSearchPage />} />
                <Route path="/supplier-scoring" element={<SupplierScoringPage />} />
                <Route path="/group-ops"        element={<GroupOpsHubPage />} />

                {/* SAP ERP integration */}
                <Route path="/erp-integrations" element={<ErpIntegrationsPage />} />

                {/* Lead Generation */}
                <Route path="/leads" element={<LeadGenerationPage />} />

                {/* War Room & Cash Pulse */}
                <Route path="/war-room" element={<WarRoomPage />} />
                <Route path="/cash-pulse" element={<CashPulsePage />} />

                {/* Experience Memory */}
                <Route path="/itinerary-search" element={<ItinerarySearchPage />} />

                {/* Site Inspection 360 */}
                <Route path="/site-inspection" element={<SiteInspectionPage />} />

                {/* AI Concierge Hub */}
                <Route path="/ai-concierge" element={<AiConciergePage />} />

                {/* Sustainability (Eco-Luxe) */}
                <Route path="/sustainability-ops" element={<SustainabilityPage_ />} />

                {/* Voice Assistant */}
                <Route path="/voice-assistant" element={<VoiceAssistantPage />} />

                {/* Live Sync Hub */}
                <Route path="/live-sync-hub" element={<LiveOpsSyncPage />} />

                {/* Suivi groupe en temps réel — incidents & journey */}
                <Route path="/operations/live-tracking" element={<GroupLiveTrackingPage />} />

                {/* Pipeline Commercial Kanban */}
                <Route path="/sales-pipeline" element={<SalesPipelinePage />} />

                {/* Moteur IA DMC */}
                <Route path="/ai-dmc-engine" element={<AIDmcEnginePage />} />

                {/* B2B Hotel Booking Portal */}
                <Route path="/b2b-hotel-portal" element={<B2BHotelPortalPage />} />

                {/* CRM Analytics */}
                <Route path="/crm/analytics" element={<CrmAnalyticsPage />} />

                {/* 7 pages nouvellement routées */}
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/circuit-model" element={<CircuitModelPage />} />
                <Route path="/content-studio" element={<ContentStudioPage />} />
                <Route path="/email-quotation" element={<EmailQuotationPage />} />
                <Route path="/itinerary-builder" element={<ItineraryBuilderPage />} />
                <Route path="/operations/fulfillment" element={<OperationsFulfillmentPage />} />
                <Route path="/passenger-app" element={<PassengerAppPage />} />

              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
