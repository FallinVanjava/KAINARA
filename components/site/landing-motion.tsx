'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LandingMotion() {
  useEffect(() => {
    // 1. Inisialisasi Lenis Smooth Scroll
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Hubungkan klik anchor (#top, #fitur-aplikasi, #kuesioner) ke Lenis smooth scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      const href = target?.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#' && href !== '#download') {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // 2. Inisialisasi GSAP Entrance & Scroll Animations
    const ctx = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? null
      : gsap.context(() => {
      // Timeline Masuk Hero (berjalan saat halaman dibuka)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '[data-hero-badge]',
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.15 }
      )
        .fromTo(
          '[data-hero-title]',
          { autoAlpha: 0, y: 35 },
          { autoAlpha: 1, y: 0, duration: 0.85 },
          '-=0.4'
        )
        .fromTo(
          '[data-hero-desc]',
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.75 },
          '-=0.5'
        )
        .fromTo(
          '[data-hero-cta]',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.65 },
          '-=0.45'
        )
        .fromTo(
          '[data-hero-tags]',
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          '-=0.35'
        )
        .fromTo(
          '[data-hero-mockup]',
          { autoAlpha: 0, y: 60, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
            ease: 'power2.out',
            onComplete: () => {
              // Animasi melayang halus (floating) setelah HP masuk
              gsap.to('[data-hero-mockup]', {
                y: -10,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            },
          },
          0.2
        )
        .fromTo(
          '[data-hero-scroll-hint]',
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );

      // Animasi Scroll Section: Fitur Aplikasi
      gsap.fromTo(
        '[data-features-header]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#fitur-aplikasi',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-feature-card]',
        { autoAlpha: 0, y: 35 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#fitur-aplikasi',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Animasi Scroll Section: Kuis Motif
      gsap.fromTo(
        '[data-quiz-section]',
        { autoAlpha: 0, y: 35 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#kuesioner',
            start: 'top 82%',
            once: true,
          },
        }
      );
    });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      ctx?.revert();
      lenis.destroy();
    };
  }, []);

  return null;
}
