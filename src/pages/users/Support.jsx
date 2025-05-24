import React from 'react';
import { useDarkMode } from '../../components/DarkModeContext';

export default function Support() {
  const { darkMode } = useDarkMode();

  return (
    <section className="p-6 flex">
      <h1 className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} text-3xl whitespace-pre-wrap`}>
        Support
      </h1>
    </section>
  );
}
