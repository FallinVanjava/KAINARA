import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { MotionProvider } from '@/components/site/motion-provider';

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="inner-editorial flex min-h-screen flex-col">
      <SiteHeader />
      <MotionProvider />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
