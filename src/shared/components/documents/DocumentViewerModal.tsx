import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Trash2, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DocRecord } from '@/shared/types/document';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentViewerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: DocRecord | null;
    onDownload?: (doc: DocRecord) => void;
    onArchive?: (doc: DocRecord) => void;
}

export function DocumentViewerModal({ open, onOpenChange, document, onDownload, onArchive }: DocumentViewerModalProps) {
    if (!document && !open) return null;

    const isPdf = document?.mimeType === 'application/pdf';
    const isImage = document?.mimeType?.startsWith('image/');
    const isSupported = isPdf || isImage;

    return createPortal(
        <AnimatePresence>
            {open && document && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card w-full h-full max-w-7xl max-h-[90vh] rounded-xl shadow-xl flex flex-col border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-foreground truncate" title={document.name}>{document.name}</h2>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                        <span>{document.size}</span>
                                        <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                        <span className="hidden sm:block">Uploaded by {document.uploadedBy} on {document.uploadedAt}</span>
                                        {document.status === 'signed' && (
                                            <>
                                                <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle size={12} /> Signed
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button 
                                    onClick={() => onDownload && onDownload(document)}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors bg-card shadow-sm"
                                >
                                    <Download size={16} /> Download
                                </button>
                                <button 
                                    onClick={() => onArchive && onArchive(document)}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-rose-200 text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors bg-card shadow-sm"
                                >
                                    <Trash2 size={16} /> Archive
                                </button>
                                <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
                                <button 
                                    onClick={() => onOpenChange(false)}
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-muted-foreground"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden bg-slate-100/50 dark:bg-black/20 flex items-center justify-center p-4">
                            {isSupported && document.fileUrl ? (
                                isPdf ? (
                                    <iframe 
                                        src={`${document.fileUrl}#view=FitH`} 
                                        className="w-full h-full rounded border bg-white dark:bg-slate-900 shadow-sm"
                                        title={document.name}
                                    />
                                ) : (
                                    <img 
                                        src={document.fileUrl} 
                                        alt={document.name}
                                        className="max-w-full max-h-full object-contain rounded shadow-sm"
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center max-w-md text-center p-8 border-2 border-dashed rounded-xl bg-card">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <FileText size={32} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Preview Unavailable</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        This file type ({document.mimeType || 'unknown'}) cannot be previewed directly in the browser. Please download the file to view it.
                                    </p>
                                    <button 
                                        onClick={() => onDownload && onDownload(document)}
                                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                        <Download size={18} /> Download File ({document.size})
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        window.document.body
    );
}
