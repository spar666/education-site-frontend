'use client';
import { MENU_CATEGORIES } from '../config/index';
import { useOnClickOutside } from '../hooks/use-on-click-outside';
import { useEffect, useRef, useState } from 'react';
import NavItem from './NavItem';

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  const handleOpen = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const close = () => setActiveIndex(null);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {MENU_CATEGORIES.map((category, i) => (
        <NavItem
          key={category.value}
          category={category}
          handleOpen={() => handleOpen(i)}
          close={close}
          isCourse={category.type === 'course' && i === activeIndex}
          isDestination={category.type === 'destination' && i === activeIndex}
          isAnyOpen={isAnyOpen}
        />
      ))}
    </div>
  );
};

export default NavItems;
