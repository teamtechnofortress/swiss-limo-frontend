'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { autocompletePlaces, type PlaceSuggestion } from '@/lib/places';
import type { PlaceValue } from '@/lib/types';

interface PlaceFieldProps {
  id: string;
  value: PlaceValue | null;
  onChange: (value: PlaceValue | null) => void;
  placeholder: string;
  googleBrowserKey: string;
  initialQuery?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function PlaceField({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  initialQuery, 
  googleBrowserKey,
  className = "w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-[15px] text-black placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-1 focus:ring-[#eab308]",
  icon = <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
}: PlaceFieldProps) {
  const [text, setText] = useState(value?.text ?? initialQuery ?? '');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const session = useRef('');
  const resolved = useRef(false);

  useEffect(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      session.current = crypto.randomUUID();
    } else {
      session.current = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }, []);

  useEffect(() => {
    if (resolved.current || value || !initialQuery || !googleBrowserKey) return;
    resolved.current = true;

    autocompletePlaces(initialQuery, session.current, googleBrowserKey)
      .then((list) => {
        if (list[0]) {
          onChange({ placeId: list[0].placeId, text: list[0].text });
          setText(list[0].text);
        }
      })
      .catch(() => undefined);
  }, [googleBrowserKey, initialQuery, value, onChange]);

  useEffect(() => {
    if (value && value.text === text) return;
    if (text.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (!googleBrowserKey) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      autocompletePlaces(text, session.current, googleBrowserKey, controller.signal)
        .then((list) => {
          setSuggestions(list);
          setOpen(true);
        })
        .catch(() => undefined);
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleBrowserKey, text]);

  function choose(suggestion: PlaceSuggestion) {
    onChange({ placeId: suggestion.placeId, text: suggestion.text });
    setText(suggestion.text);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        {icon}
        <input
          id={id}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-autocomplete="list"
          autoComplete="off"
          className={className}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (value) onChange(null);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>

      {value && (
        <p className="mt-1.5 text-xs text-[#d97706]">Address selected</p>
      )}

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
                className="flex w-full items-start gap-3 px-5 py-3.5 text-left text-sm text-black transition hover:bg-[#fef3c7] hover:text-black"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#eab308]" />
                <span>{s.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}