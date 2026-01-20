import React from 'react'
import HeroSection from '../components/home/HeroSection'
import MissionHighlights from '../components/home/MissionHighlights'
import AboutPreview from '../components/home/AboutPreview'
import ProgramsPreview from '../components/home/ProgramsPreview'
import TransparencySection from '../components/home/TransparencySection'
import GalleryPreview from '../components/home/GalleryPreview'
import LeadershipSection from '../components/home/LeadershipSection'
import CTASection from '../components/home/CTASection'

const Home = () => {
  return (
    <div className="pt-16 sm:pt-20 overflow-x-hidden">
      <HeroSection />
      <MissionHighlights />
      <AboutPreview />
      <ProgramsPreview />
      <TransparencySection />
      {/* <GalleryPreview /> */}
      <LeadershipSection />
      <CTASection />
    </div>
  )
}

export default Home
