"use client"

import { useState } from "react"
import { HeroSection } from "./components/HeroSection"
import { FollowLinks } from "./components/FollowLinks"
import { TeamSection } from "./components/TeamSection"
import { Footer } from "./components/Footer"
import { PhotoGallery } from "./components/PhotoGallery"
import { LiveTracking } from "./components/LiveTracking"
import { HeaderNav } from "./components/HeaderNav"
import { RideWidget } from "./components/RideWidget"

export default function App() {
  const [showRouteDetails, setShowRouteDetails] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [showLiveTracking, setShowLiveTracking] = useState(false)

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const goHome = () => {
    setShowRouteDetails(false)
    setShowPhotoGallery(false)
    setShowLiveTracking(false)
    scrollToTop()
  }

  const handleDiscoverRoute = () => {
    setShowRouteDetails(true)
    setShowPhotoGallery(false)
    setShowLiveTracking(false)
    scrollToTop()
  }

  const handleShowPhotoGallery = () => {
    setShowPhotoGallery(true)
    setShowRouteDetails(false)
    setShowLiveTracking(false)
    scrollToTop()
  }

  const handleShowLiveTracking = () => {
    setShowLiveTracking(true)
    setShowRouteDetails(false)
    setShowPhotoGallery(false)
    scrollToTop()
  }

  const activePage = showRouteDetails
      ? "route"
      : showPhotoGallery
          ? "gallery"
          : showLiveTracking
              ? "tracking"
              : "home"

  return (
      <div className="min-h-screen bg-background">
        <HeaderNav
            activePage={activePage}
            onGoHome={goHome}
            onDiscoverRoute={handleDiscoverRoute}
            onShowPhotoGallery={handleShowPhotoGallery}
            onShowLiveTracking={handleShowLiveTracking}
        />

        {showRouteDetails ? (
            <>
              <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <h1 className="text-2xl font-bold text-foreground mb-6">
                    Découvrir le tracé
                  </h1>
                  <RideWidget />
                </div>
              </div>
              <Footer />
            </>
        ) : showPhotoGallery ? (
            <>
              <PhotoGallery onBack={goHome} />
              <Footer />
            </>
        ) : showLiveTracking ? (
            <>
              <LiveTracking onBack={goHome} />
              <Footer />
            </>
        ) : (
            <>
              <HeroSection
                  onDiscoverRoute={handleDiscoverRoute}
                  onShowPhotoGallery={handleShowPhotoGallery}
                  onShowLiveTracking={handleShowLiveTracking}
              />
              <FollowLinks />
              <TeamSection />
              <Footer />
            </>
        )}
      </div>
  )
}
