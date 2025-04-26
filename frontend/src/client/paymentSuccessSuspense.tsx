// app/payment-success/page.tsx
import React, { Suspense } from "react";
import PaymentSuccessPageClient from "./paymentSuccessPageClient";

// Prevent Next.js from statically prerendering this page
export const dynamic = "force-dynamic";

export default function PaymentSuccessPageSuspense() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading confirmation…</div>}
    >
      <PaymentSuccessPageClient />
    </Suspense>
  );
}
