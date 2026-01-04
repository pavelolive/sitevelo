"use client"

import { useState } from "react"
import { HeroSection } from "./components/HeroSection"
import { FollowLinks } from "./components/FollowLinks"
import { TeamSection } from "./components/TeamSection"
import { Footer } from "./components/Footer"
import { RouteDetails } from "./components/RouteDetails"
import { PhotoGallery } from "./components/PhotoGallery"
import { LiveTracking } from "./components/LiveTracking"

export default function App() {
  const [showRouteDetails, setShowRouteDetails] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [showLiveTracking, setShowLiveTracking] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDiscoverRoute = () => {
    setShowRouteDetails(true)
    setShowPhotoGallery(false)
    setShowLiveTracking(false)
    scrollToTop()
  }

  const handleBackToHome = () => {
    setShowRouteDetails(false)
    scrollToTop()
  }

  const handleShowPhotoGallery = () => {
    setShowPhotoGallery(true)
    setShowRouteDetails(false)
    setShowLiveTracking(false)
    scrollToTop()
  }

  const handleBackToHomeFromGallery = () => {
    setShowPhotoGallery(false)
    scrollToTop()
  }

  const handleShowLiveTracking = () => {
    setShowLiveTracking(true)
    setShowRouteDetails(false)
    setShowPhotoGallery(false)
    scrollToTop()
  }

  const handleBackToHomeFromTracking = () => {
    setShowLiveTracking(false)
    scrollToTop()
  }

  return (
      <div className="min-h-screen bg-background">
        {showRouteDetails ? (
            <>
              <RouteDetails onBack={handleBackToHome} />
              <Footer />
            </>
        ) : showPhotoGallery ? (
            <>
              <PhotoGallery onBack={handleBackToHomeFromGallery} />
              <Footer />
            </>
        ) : showLiveTracking ? (
            <>
              <LiveTracking onBack={handleBackToHomeFromTracking} />
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
