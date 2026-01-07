"use client"

import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { HeroSection } from "./components/HeroSection"
import { FollowLinks } from "./components/FollowLinks"
import { TeamSection } from "./components/TeamSection"
import { Footer } from "./components/Footer"
import { PhotoGallery } from "./components/PhotoGallery"
import { LiveTracking } from "./components/LiveTracking"
import { RideWidget } from "./components/RideWidget"
import { HeaderNav } from "./components/HeaderNav"
import { AdminPhotoUpload } from "./components/AdminPhotoUpload"

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const goHome = () => {
    navigate("/")
    scrollToTop()
  }

  const onDiscoverRoute = () => {
    navigate("/route")
    scrollToTop()
  }

  const onShowGallery = () => {
    navigate("/gallery")
    scrollToTop()
  }

  const onShowTracking = () => {
    navigate("/tracking")
    scrollToTop()
  }

  // Optionnel : activePage basé sur l’URL
  const activePage =
      location.pathname.startsWith("/admin/photos") ? "admin"
          : location.pathname.startsWith("/route") ? "route"
              : location.pathname.startsWith("/gallery") ? "gallery"
                  : location.pathname.startsWith("/tracking") ? "tracking"
                      : "home"

  return (
      <div className="min-h-screen bg-background">
        <HeaderNav
            activePage={activePage}
            onGoHome={goHome}
            onDiscoverRoute={onDiscoverRoute}
            onShowLiveTracking={onShowTracking}
            onShowPhotoGallery={onShowGallery}
            // 👉 bouton admin temporaire : tu peux l’enlever plus tard
            // onShowAdminUpload={() => { navigate("/admin/photos"); scrollToTop() }}
        />

        <Routes>
          <Route
              path="/"
              element={
                <>
                  <HeroSection
                      onDiscoverRoute={onDiscoverRoute}
                      onShowLiveTracking={onShowTracking}
                      onShowPhotoGallery={onShowGallery}
                  />
                  <FollowLinks />
                  <TeamSection />
                </>
              }
          />

          <Route
              path="/route"
              element={
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <h1 className="text-2xl font-bold text-foreground mb-6">Découvrir le tracé</h1>
                  <RideWidget />
                </div>
              }
          />

          <Route path="/gallery" element={<PhotoGallery onBack={goHome} />} />
          <Route path="/tracking" element={<LiveTracking onBack={goHome} />} />
          <Route path="/admin/photos" element={<AdminPhotoUpload />} />
        </Routes>

        <Footer />
      </div>
  )
}

export default function App() {
  return (
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
  )
}
