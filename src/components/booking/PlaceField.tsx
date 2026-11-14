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
  statusPosition?: 'inline' | 'overlay';
}

export function PlaceField({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  initialQuery, 
  googleBrowserKey,
  className = "w-full min-w-0 truncate rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-[15px] !font-normal text-black placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-1 focus:ring-[#eab308]",
  icon = <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />,
  statusPosition = 'inline',
}: PlaceFieldProps) {
  const [text, setText] = useState(value?.text ?? initialQuery ?? '');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
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
  // Do not show suggestions for automatically prefilled addresses.
  if (!hasUserEdited) {
    setSuggestions([]);
    setOpen(false);
    return;
  }

  if (value && value.text === text) {
    setSuggestions([]);
    setOpen(false);
    return;
  }

  if (text.trim().length < 3) {
    setSuggestions([]);
    setOpen(false);
    return;
  }

  if (!googleBrowserKey) {
    setSuggestions([]);
    return;
  }

  const controller = new AbortController();

  const timer = setTimeout(() => {
    autocompletePlaces(
      text,
      session.current,
      googleBrowserKey,
      controller.signal
    )
      .then((list) => {
        setSuggestions(list);
        setOpen(list.length > 0);
      })
      .catch(() => undefined);
  }, 250);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [googleBrowserKey, text, hasUserEdited, value]);



  function choose(suggestion: PlaceSuggestion) {
    onChange({ placeId: suggestion.placeId, text: suggestion.text });
    setText(suggestion.text);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className="relative w-full min-w-0">
      <div className="relative w-full min-w-0">
        {icon}
        <input
          id={id}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-autocomplete="list"
          autoComplete="off"
          className={`${className} min-w-0 w-full max-w-full`}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setHasUserEdited(true);
            setText(e.target.value);
            if (value) onChange(null);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>

      {value && (
        <p
          className={statusPosition === 'overlay'
            ? 'pointer-events-none absolute left-0 top-full mt-1 text-[11px] font-medium leading-4 text-[#d97706]'
            : 'mt-1.5 text-xs text-[#d97706]'}
          aria-live="polite"
        >
          Address selected
        </p>
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
