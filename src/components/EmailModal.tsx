'use client';

import { useEffect, useRef, useState } from 'react';

interface EmailModalProps {
  onClose: () => void;
}

type Step = 'name' | 'email' | 'topic' | 'message' | 'confirm' | 'sent';

export function EmailModal({ onClose }: EmailModalProps) {
  const [step, setStep] = useState<Step>('name');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [topic, setTopic]     = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Focus the active input whenever step changes
  useEffect(() => {
    setTimeout(() => {
      (inputRef.current as HTMLElement | null)?.focus();
    }, 30);
  }, [step]);

  // Escape closes at any step; Y/N on confirm step
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (step === 'confirm') {
        if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); handleSend(); }
        if (e.key === 'n' || e.key === 'N') { e.preventDefault(); onClose(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, step]);

  const advance = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (step === 'name')    { setName(trimmed);    setStep('email'); }
    else if (step === 'email')   { setEmail(trimmed);   setStep('topic'); }
    else if (step === 'topic')   { setTopic(trimmed);   setStep('message'); }
    else if (step === 'message') { setMessage(trimmed); setStep('confirm'); }
  };

  const handleSend = () => {
    // Compose a mailto link as a simple fallback
    const body = encodeURIComponent(message);
    const sub  = encodeURIComponent(topic);
    window.open(`mailto:hello@example.com?subject=${sub}&body=${body}`);
    setStep('sent');
  };

  const fieldDone = (s: Step) =>
    ['email', 'topic', 'message', 'confirm', 'sent'].indexOf(s) >
    ['email', 'topic', 'message', 'confirm', 'sent'].indexOf(step);

  const isConfirmOrAfter = step === 'confirm' || step === 'sent';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative border border-gray-700 bg-black text-gray-300
                    w-full max-w-sm mx-4 p-5 text-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-200">Email</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 focus:outline-none cursor-pointer"
          >
            [Esc] close
          </button>
        </div>

        <div className="space-y-1.5">
          {/* Name */}
          <div className="flex gap-2 items-center">
            <span className="text-gray-500 w-28 shrink-0">What&apos;s your name:</span>
            {step === 'name' ? (
              <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                className="bg-transparent border-none outline-none text-gray-200 flex-1 caret-gray-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') advance((e.target as HTMLInputElement).value);
                }}
              />
            ) : (
              <span className="text-gray-200">{name}</span>
            )}
          </div>
          {step === 'name' && (
            <p className="text-gray-700 text-xs pl-[7.5rem]">Press Enter to continue</p>
          )}

          {/* Email */}
          {(step !== 'name') && (
            <div className="flex gap-2 items-center">
              <span className="text-gray-500 w-28 shrink-0">Email address:</span>
              {step === 'email' ? (
                <input
                  ref={inputRef as React.Ref<HTMLInputElement>}
                  className="bg-transparent border-none outline-none text-gray-200 flex-1 caret-gray-200"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') advance((e.target as HTMLInputElement).value);
                  }}
                />
              ) : (
                <span className="text-gray-200">{email}</span>
              )}
            </div>
          )}
          {step === 'email' && (
            <p className="text-gray-700 text-xs pl-[7.5rem]">Press Enter to continue</p>
          )}

          {/* Topic */}
          {(['topic','message','confirm','sent'] as Step[]).includes(step) && (
            <div className="flex gap-2 items-center">
              <span className="text-gray-500 w-28 shrink-0">Topic:</span>
              {step === 'topic' ? (
                <input
                  ref={inputRef as React.Ref<HTMLInputElement>}
                  className="bg-transparent border-none outline-none text-gray-200 flex-1 caret-gray-200"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') advance((e.target as HTMLInputElement).value);
                  }}
                />
              ) : (
                <span className="text-gray-200">{topic}</span>
              )}
            </div>
          )}
          {step === 'topic' && (
            <p className="text-gray-700 text-xs pl-[7.5rem]">Press Enter to continue</p>
          )}

          {/* Message */}
          {(['message','confirm','sent'] as Step[]).includes(step) && (
            <div className="flex gap-2 items-start">
              <span className="text-gray-500 w-28 shrink-0 pt-0.5">Your message:</span>
              {step === 'message' ? (
                <textarea
                  ref={inputRef as React.Ref<HTMLTextAreaElement>}
                  rows={3}
                  className="bg-transparent border-none outline-none text-gray-200 flex-1 resize-none caret-gray-200"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      advance((e.target as HTMLTextAreaElement).value);
                    }
                  }}
                />
              ) : (
                <span className="text-gray-200 leading-snug">{message}</span>
              )}
            </div>
          )}
          {step === 'message' && (
            <p className="text-gray-700 text-xs pl-[7.5rem]">Enter to continue · Shift+Enter for newline</p>
          )}

          {/* Divider before confirm */}
          {isConfirmOrAfter && (
            <div className="border-t border-gray-800 my-2" />
          )}

          {/* Confirm / sent */}
          {step === 'confirm' && (
            <div className="flex gap-4 items-center pt-1">
              <span className="text-gray-500">Send:</span>
              <button
                onClick={handleSend}
                className="text-gray-200 hover:text-white focus:outline-none cursor-pointer"
              >
                [Y]es
              </button>
              <span className="text-gray-700">/</span>
              <button
                onClick={onClose}
                className="text-gray-200 hover:text-white focus:outline-none cursor-pointer"
              >
                [N]o
              </button>
            </div>
          )}

          {step === 'sent' && (
            <p className="text-gray-400 pt-1">Message sent. Thanks!</p>
          )}
        </div>
      </div>
    </div>
  );
}
