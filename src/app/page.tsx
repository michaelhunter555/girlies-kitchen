import { Hero } from "@/components/home/Hero";
import { DishGallery } from "@/components/home/DishGallery";
import { TrayPricing } from "@/components/home/TrayPricing";
import { CombosSection } from "@/components/home/CombosSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DishGallery />
      <TrayPricing />
      <CombosSection />
      <ContactSection />
    </>
  );
}
