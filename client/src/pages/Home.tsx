import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
import DailyMotivation from "@/components/home/DailyMotivation";
import MindfulBlog from "@/components/home/MindfulBlog";
import Planner from "@/components/home/Planner";
import AdvancedPlanner from "@/components/home/AdvancedPlanner";
import RelaxSection from "@/components/home/RelaxSection";
import AudioLibrary from "@/components/home/AudioLibrary";
import Testimonials from "@/components/home/Testimonials";
import ContactSupport from "@/components/home/ContactSupport";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>MindEase - Student Wellness Platform</title>
        <meta name="description" content="MindEase is a student wellness platform supporting mental health, motivation, and academic balance with resources for students." />
        <meta property="og:title" content="MindEase - Student Wellness Platform" />
        <meta property="og:description" content="Supporting students through stress, motivation, and academic balance with mindful resources." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Hero />
      <DailyMotivation />
      <MindfulBlog />
      <AdvancedPlanner />
      <RelaxSection />
      <AudioTest />
      <AudioLibrary />
      <Testimonials />
      <ContactSupport />
    </>
  );
};

export default Home;
