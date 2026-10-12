import type { ReactNode } from 'react';

// The real root layout is app/[locale]/layout.tsx, so each language renders its own <html lang>.
// This one only passes through, for the few files outside a locale (the redirect at / and the 404).
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}
