import { SearchScreen } from '@/screens/SearchScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub Repository Search',
  description: 'Search for GitHub repositories with Next.js App Router',
};

export default function Page() {
  return <SearchScreen />;
}
