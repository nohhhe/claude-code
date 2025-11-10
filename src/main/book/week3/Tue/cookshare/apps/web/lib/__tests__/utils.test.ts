import { cn } from '../utils';

describe('utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });

    it('merges Tailwind classes correctly', () => {
      const result = cn('p-4 p-2'); // p-2 should override p-4
      expect(result).toBe('p-2');
    });

    it('handles complex class combinations', () => {
      const result = cn(
        'bg-primary text-white',
        'hover:bg-primary-dark',
        { 'active:scale-95': true },
        undefined,
        null,
        false && 'hidden'
      );
      expect(result).toBe('bg-primary text-white hover:bg-primary-dark active:scale-95');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('resolves Tailwind conflicts correctly', () => {
      const result = cn('text-sm text-lg text-xl');
      expect(result).toBe('text-xl');
    });

    it('handles object syntax', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'p-4': true
      });
      expect(result).toBe('text-red-500 p-4');
    });

    it('handles mixed input types', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        { 'object-class': true },
        'string-class',
        undefined,
        null,
        false && 'conditional-class'
      );
      expect(result).toBe('base-class array-class1 array-class2 object-class string-class');
    });

    it('resolves responsive class conflicts', () => {
      const result = cn('sm:text-sm md:text-base sm:text-lg');
      expect(result).toBe('md:text-base sm:text-lg');
    });

    it('handles hover and focus states', () => {
      const result = cn(
        'bg-white hover:bg-gray-100 focus:bg-gray-200',
        'hover:bg-blue-100'
      );
      expect(result).toBe('bg-white focus:bg-gray-200 hover:bg-blue-100');
    });
  });
});