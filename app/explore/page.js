import { Suspense } from 'react';
import ExploreClient from './ExploreClient';
import { getAllTokens } from '@/lib/db';

export const revalidate = 30;

export default async function ExplorePage() {
  const tokens = await getAllTokens();
  return (
    <Suspense>
      <ExploreClient tokens={tokens} />
    </Suspense>
  );
}
