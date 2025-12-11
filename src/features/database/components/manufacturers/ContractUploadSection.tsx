import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Paperclip, Download, Trash2, FileText, Loader2 } from 'lucide-react';

interface ContractUploadSectionProps {
    manufacturerId: string;
    // Current file paths or IDs
    contractFileId?: string | null;
    exclusivityFileId?: string | null;
    onUpdate: () => void; // Callback to refresh parent data
}

export function ContractUploadSection({
    manufacturerId,
    contractFileId,
    exclusivityFileId,
    onUpdate
}: ContractUploadSectionProps) {
    const [uploading, setUploading] = useState<'contract' | 'exclusivity' | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'contract' | 'exclusivity') => {
        try {
            setUploading(type);
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${manufacturerId}/${type}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage 'documents' bucket
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Update manufacturer record with file path (using ID field for path for now)
            const updateData = type === 'contract'
                ? { contract_file_id: filePath }
                : { exclusivity_file_id: filePath };

            const { error: dbError } = await supabase
                .from('companies')
                .update(updateData)
                .eq('id', manufacturerId);

            if (dbError) throw dbError;

            onUpdate();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setUploading(null);
            // Reset input
            event.target.value = '';
        }
    };

    const handleDownload = async (path: string) => {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .createSignedUrl(path, 60); // 60 seconds valid

            if (error) throw error;
            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to generate download link.');
        }
    };

    const handleDelete = async (type: 'contract' | 'exclusivity', path: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            // Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([path]);

            if (storageError) console.error('Storage delete error (continuing to DB update):', storageError);

            // Update DB
            const updateData = type === 'contract'
                ? { contract_file_id: null }
                : { exclusivity_file_id: null };

            const { error: dbError } = await supabase
                .from('companies')
                .update(updateData)
                .eq('id', manufacturerId);

            if (dbError) throw dbError;

            onUpdate();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium">Documents & Contracts</h3>
            </div>

            {/* Contract File */}
            <div className="border rounded-md p-4 space-y-3 bg-gray-50/50">
                <div className="flex justify-between items-start">
                    <div>
                        <Label className="font-semibold text-gray-700">Service Contract</Label>
                        <p className="text-xs text-gray-500">Official service contract with valid signature.</p>
                    </div>
                    {contractFileId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Uploaded
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Missing
                        </span>
                    )}
                </div>

                {contractFileId ? (
                    <div className="flex items-center justify-between bg-white p-2 border rounded-md">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-700 truncate">{contractFileId.split('/').pop()}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(contractFileId)} title="Download">
                                <Download className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete('contract', contractFileId)} title="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <input
                            type="file"
                            id="upload-contract"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleUpload(e, 'contract')}
                            disabled={uploading === 'contract'}
                        />
                        <Label
                            htmlFor="upload-contract"
                            className={`flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-6 py-4 text-sm leading-6 text-gray-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer ${uploading === 'contract' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading === 'contract' ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Paperclip className="h-5 w-5 mr-2" />
                            )}
                            {uploading === 'contract' ? 'Uploading...' : 'Upload Contract (PDF/DOC)'}
                        </Label>
                    </div>
                )}
            </div>

            {/* Exclusivity Agreement */}
            <div className="border rounded-md p-4 space-y-3 bg-gray-50/50">
                <div className="flex justify-between items-start">
                    <div>
                        <Label className="font-semibold text-gray-700">Exclusivity Agreement</Label>
                        <p className="text-xs text-gray-500">Optional exclusivity terms agreement.</p>
                    </div>
                    {exclusivityFileId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Uploaded
                        </span>
                    ) : null}
                </div>

                {exclusivityFileId ? (
                    <div className="flex items-center justify-between bg-white p-2 border rounded-md">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="text-sm text-gray-700 truncate">{exclusivityFileId.split('/').pop()}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(exclusivityFileId)} title="Download">
                                <Download className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete('exclusivity', exclusivityFileId)} title="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <input
                            type="file"
                            id="upload-exclusivity"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleUpload(e, 'exclusivity')}
                            disabled={uploading === 'exclusivity'}
                        />
                        <Label
                            htmlFor="upload-exclusivity"
                            className={`flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-6 py-4 text-sm leading-6 text-gray-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer ${uploading === 'exclusivity' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading === 'exclusivity' ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Paperclip className="h-5 w-5 mr-2" />
                            )}
                            {uploading === 'exclusivity' ? 'Uploading...' : 'Upload Agreement (PDF/DOC)'}
                        </Label>
                    </div>
                )}
            </div>
        </div>
    );
}
