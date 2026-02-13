import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import ExploreImpact from '@/components/ExploreImpact';
import Programs from '@/components/Programs';
import Testimonials from '@/components/Testimonials';
import LatestNews from '@/components/LatestNews';
import CareerOpportunities from '@/components/CareerOpportunities';

export default function HomePage() {
  return (
    <main>
      <div className="overflow-hidden">
        <Hero />
        <Partners />
        <ExploreImpact />
        <Programs />
        <Testimonials />
        <CareerOpportunities />
        <LatestNews />
      </div>
    </main>
  );
}
