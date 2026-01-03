import { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { FollowLinks } from './components/FollowLinks';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { RouteDetails } from './components/RouteDetails';
import { RouteDetailsAlt } from './components/RouteDetailsAlt';
import { RouteDetailsV3 } from './components/RouteDetailsV3';
import { ElevationTimeline } from './components/ElevationTimeline';
import { TimelineView } from './components/TimelineView';

export default function App() {
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [showRouteTimeline, setShowRouteTimeline] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showElevationTimeline, setShowElevationTimeline] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiscoverRoute = () => {
    setShowRouteDetails(true);
    setShowRouteTimeline(false);
    setShowRouteMap(false);
    scrollToTop();
  };

  const handleBackToHome = () => {
    setShowRouteDetails(false);
    scrollToTop();
  };

  const handleDiscoverTimeline = () => {
    setShowRouteTimeline(true);
    setShowRouteDetails(false);
    setShowRouteMap(false);
    scrollToTop();
  };

  const handleBackToHomeTimeline = () => {
    setShowRouteTimeline(false);
    scrollToTop();
  };

  const handleDiscoverMap = () => {
    setShowRouteMap(true);
    setShowRouteDetails(false);
    setShowRouteTimeline(false);
    scrollToTop();
  };

  const handleBackToHomeMap = () => {
    setShowRouteMap(false);
    scrollToTop();
  };

  const handleDiscoverElevationTimeline = () => {
    setShowElevationTimeline(true);
    setShowRouteDetails(false);
    setShowRouteTimeline(false);
    setShowRouteMap(false);
    scrollToTop();
  };

  const handleBackToHomeElevationTimeline = () => {
    setShowElevationTimeline(false);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-background">
      {showRouteDetails ? (
        <>
          <RouteDetails onBack={handleBackToHome} />
          <Footer />
        </>
      ) : showRouteTimeline ? (
        <>
          <RouteDetailsAlt onBack={handleBackToHomeTimeline} />
          <Footer />
        </>
      ) : showRouteMap ? (
        <>
          <RouteDetailsV3 onBack={handleBackToHomeMap} />
          <Footer />
        </>
      ) : showElevationTimeline ? (
        <>
          <TimelineView onBack={handleBackToHomeElevationTimeline} />
          <Footer />
        </>
      ) : (
        <>
          <HeroSection 
            onDiscoverRoute={handleDiscoverRoute} 
            onDiscoverTimeline={handleDiscoverTimeline} 
            onDiscoverMap={handleDiscoverMap} 
            onDiscoverElevationTimeline={handleDiscoverElevationTimeline} 
          />
          <FollowLinks />
          <TeamSection />
          <Footer />
        </>
      )}
    </div>
  );
}