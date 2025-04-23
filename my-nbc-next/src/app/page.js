import About from "@/components/home/About";
import OurCausesSection from "@/components/home/OurCausesSection";
import OurHeros from "@/components/home/OurHeros";
import WhatWeDo from "@/components/home/WhatWeDo";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OurProgram from "@/components/home/OurProgram";
import ScrollingTicker from "@/components/home/ScrollingTicker";
import OurFeatures from "@/components/home/OurFeatures";
import ContactUs from "@/components/home/ContactUs";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Gallery from "@/components/home/Gallery";
import BlogSection from "@/components/home/BlogSection";
import OurServices from "@/components/home/OurServices";

export default function Home() {
  return (
   <>
   <OurHeros/>
   <About/>
   <OurServices/>
   <WhatWeDo/>
   <OurCausesSection/>
   <WhyChooseUs/>
   <OurProgram/>
   <ScrollingTicker/>
   <OurFeatures/>
   <ContactUs/>
   <HowItWorks/>
   <Testimonials/>
   <Gallery/>
   <BlogSection/>
   </>
  );
}
