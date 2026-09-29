import type { Metadata } from 'next'
import SellDataFunnel from '@/components/sell-data/SellDataFunnel'

export const metadata: Metadata = {
  title: 'Sell Your Company Data | NU WAV Media',
  description: "Answer 10 quick questions to find out if your company's emails, chats, CRM and documents qualify for a data offer.",
}

export default function SellYourDataPage() {
  return <SellDataFunnel />
}
