import { auth } from "@/auth";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Security } from "@/components/landing/Security";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default async function HomePage() {
  const session = await auth();
  const isAuthenticated = Boolean(session);

  return (
    <div className="min-h-screen bg-steel-950 text-steel-100">
      <LandingNav isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
        <Features />
        <HowItWorks />
        <Security />
        <FinalCTA isAuthenticated={isAuthenticated} />
      </main>
      <SiteFooter />
    </div>
  );
}
