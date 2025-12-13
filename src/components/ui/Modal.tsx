import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    fullScreen?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, fullScreen = false }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 ${fullScreen ? '' : 'p-4'}`}>
            <div
                ref={modalRef}
                className={`bg-white shadow-xl overflow-hidden animate-in duration-200 flex flex-col ${fullScreen
                    ? 'w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-5xl rounded-2xl slide-in-from-bottom'
                    : 'w-full max-w-lg rounded-2xl zoom-in-95'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
                    <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className={`flex-1 overflow-y-auto ${fullScreen ? 'p-6 max-w-2xl mx-auto w-full' : 'p-4'}`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
