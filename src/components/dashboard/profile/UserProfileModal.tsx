import React, { useState } from 'react';
import { useUserStore } from '@/core/store/userStore';
import Modal from '@/components/ui/Modal';
import { User, Mail, Phone, Edit2, Check, X, CreditCard } from 'lucide-react';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
    const { name, role, email, phone, identification, updateProfile, avatarUrl } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name,
        email,
        phone
    });

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setFormData({ name, email, phone });
            setIsEditing(false);
        }
    }, [isOpen, name, email, phone]);

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    const handleCancelString = () => {
        setFormData({ name, email, phone });
        setIsEditing(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Perfil de Usuario">
            <div className={`flex flex-col gap-6 ${isEditing ? 'max-w-md mx-auto w-full' : ''}`}>
                {/* Header with Avatar */}
                <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-100">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover bg-blue-50"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-lg">
                            <User size={48} />
                        </div>
                    )}
                    {!isEditing ? (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-800">{name}</h2>
                            <p className="text-sm text-slate-500">{role}</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-center font-bold text-slate-800"
                            />
                        </div>
                    )}
                </div>

                {/* Info List */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Información Personal</h4>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Edit2 size={14} /> Editar
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {/* Identification (Read Only) */}
                        <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                                <CreditCard size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">Cédula</p>
                                <p className="text-sm font-medium text-slate-800">{identification}</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                                <Mail size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">Correo Electrónico</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-1 bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none text-sm text-slate-700"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-slate-800">{email}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                                <Phone size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">Teléfono</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-1 bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none text-sm text-slate-700"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-slate-800">{phone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {isEditing && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={handleCancelString}
                            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Check size={18} /> Guardar
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
