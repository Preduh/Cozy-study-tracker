'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  iconSize?: number;
}

export default function SearchInput({ 
  className, 
  containerClassName, 
  iconSize = 18,
  ...props 
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-cozy-brown/30" 
        size={iconSize} 
      />
      <input
        {...props}
        className={cn(
          "cozy-input pl-11 py-2.5 text-xs font-semibold placeholder:text-cozy-brown/30",
          className
        )}
      />
    </div>
  );
}
