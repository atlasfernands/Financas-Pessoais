import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Limpa localStorage e classes do documento antes de cada teste
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('inicia com tema light por padrão', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('carrega tema do localStorage se disponível', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('alterna entre temas corretamente', () => {
    const { result } = renderHook(() => useTheme());
    
    // Tema inicial é light
    expect(result.current.theme).toBe('light');
    
    // Alterna para dark
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Alterna de volta para light
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('respeita a preferência do sistema', () => {
    // Simula preferência do sistema para dark mode
    const mediaQueryList = {
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn()
    };
    
    vi.spyOn(window, 'matchMedia').mockImplementation(() => mediaQueryList);
    
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
