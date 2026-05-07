import HeroBanner from "@/components/home/HeroBanner";
import MainTagline from "@/components/home/MainTagline";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import MarketSection from "@/components/home/MarketSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import DividendSection from "@/components/home/DividendSection";
import EasyInvestSection from "@/components/home/EasyInvestSection";
import TaxSection from "@/components/home/TaxSection";
import PartnersSection from "@/components/home/PartnersSection";
import InvestorsSection from "@/components/home/InvestorsSection";
import NewsroomSection from "@/components/home/NewsroomSection";
import RecruitSection from "@/components/home/RecruitSection";
import { queryAll } from "@/lib/db";
import type { Banner } from "@/types";

async function getBanners(): Promise<Banner[]> {
  try {
    return await queryAll<Banner>(
      "SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC"
    );
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const banners = await getBanners();

  return (
    <>
      <HeroBanner banners={banners} />
      <MainTagline />
      <SubscriptionSection />
      <MarketSection />
      <PortfolioSection />
      <DividendSection />
      <EasyInvestSection />
      <TaxSection />
      <PartnersSection />
      <InvestorsSection />
      <NewsroomSection />
      <RecruitSection />
    </>
  );
}
