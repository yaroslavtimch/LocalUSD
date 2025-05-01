'use client'

import TokenBuilder from "@/components/TokenBuider/TokenBuider";

export default function Home() {
  const handleTokenCreation = (data: any) => {
    console.log("Token Params:", data);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-20 px-4">
      <TokenBuilder onSubmit={handleTokenCreation} />
    </main>
  );
}