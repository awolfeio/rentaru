
import { useState } from 'react';
import { FileText, Download, ExternalLink, Info, PenLine } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/components/ui/Toast';

export default function DocumentsSettings() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [eSignConsent, setESignConsent] = useState(true);
    const [paperless, setPaperless] = useState(true);

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">Documents & E-Signature</h2>
                <p className="text-sm text-muted-foreground">Manage document delivery, e-signature consent, and document profile details.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Document Profile */}
            <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <PenLine size={18} className="text-muted-foreground" />
                    Document Profile
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div>
                            <p className="text-sm font-medium">Legal Name</p>
                            <p className="text-sm text-muted-foreground mt-0.5">John Allen Smith</p>
                            <p className="text-xs text-muted-foreground mt-1">Used on lease agreements and legal documents.</p>
                        </div>
                        <button
                            onClick={() => toast({ type: 'info', title: 'Request Submitted', message: 'Your property manager will review the name change request.' })}
                            className="text-sm font-medium text-primary hover:underline shrink-0"
                        >
                            Request Change
                        </button>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
                        <Info size={14} className="shrink-0 mt-0.5" />
                        Legal name changes require approval because they affect signed lease agreements and records.
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* E-Signature */}
            <div className="flex items-start justify-between">
                <div className="flex-1 mr-8">
                    <p className="text-sm font-medium">E-Signature Consent</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Allow documents to be signed electronically. Required for lease renewals and addenda.
                    </p>
                </div>
                <Switch checked={eSignConsent} onCheckedChange={setESignConsent} />
            </div>

            <div className="w-full h-px bg-border" />

            {/* Paperless */}
            <div className="flex items-start justify-between">
                <div className="flex-1 mr-8">
                    <p className="text-sm font-medium">Paperless Document Delivery</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Receive all documents electronically. Disabling this may require a mailing address on file.</p>
                </div>
                <Switch checked={paperless} onCheckedChange={setPaperless} />
            </div>

            <div className="w-full h-px bg-border" />

            {/* Actions */}
            <div>
                <h3 className="font-medium mb-4">Document Archive</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                                <FileText size={16} className="text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">View Lease Documents</p>
                                <p className="text-xs text-muted-foreground">Lease agreement, addenda, and move-in checklist.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/tenant/documents')}
                            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            View <ExternalLink size={13} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                                <Download size={16} className="text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Download Document Archive</p>
                                <p className="text-xs text-muted-foreground">All signed documents as a single ZIP file.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toast({ type: 'info', title: 'Preparing Download', message: 'Your archive will be ready shortly.' })}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
