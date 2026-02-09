'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  threshold?: number;
}

export default function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.9,
  threshold = 0.05,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally disconnect after first animation
          // observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 150px 0px', // Trigger 150px before element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const getDirectionClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translate-y-12 opacity-0';
        case 'down':
          return '-translate-y-12 opacity-0';
        case 'left':
          return 'translate-x-12 opacity-0';
        case 'right':
          return '-translate-x-12 opacity-0';
        case 'fade':
          return 'opacity-0';
        default:
          return 'translate-y-12 opacity-0';
      }
    }
    return 'translate-y-0 translate-x-0 opacity-100';
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${getDirectionClass()} ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
