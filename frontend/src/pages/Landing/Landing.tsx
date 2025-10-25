import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from '../../components/HeroSection';
import ProblemSection from '../../components/ProblemSection';
import SolutionSection from '../../components/SolutionSection';
import DemoSection from '../../components/DemoSection';
import TechnologySection from '../../components/TechnologySection';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <DemoSection />
                <TechnologySection />
            </main>
            <Footer />
        </div>
    );
}