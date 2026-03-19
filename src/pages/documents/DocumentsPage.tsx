import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Download, Trash2, ShieldCheck, Eye, X, FileCheck, Clock, FileWarning } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SignaturePad } from '../../components/documents/SignaturePad';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: 'Draft' | 'In Review' | 'Signed';
  fileObject?: File; 
}

const initialDocuments: Document[] = [
  { id: 1, name: 'Nexus_Investment_Agreement.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2024-03-15', status: 'In Review' },
  { id: 2, name: 'Financial_Projections_Q1.xlsx', type: 'XLSX', size: '1.8 MB', lastModified: '2024-03-10', status: 'Signed' }
];

export const DocumentsPage: React.FC = () => {
  // 1. Initial Load from Local Storage
  const [documents, setDocuments] = useState<Document[]>(() => {
    const savedDocs = localStorage.getItem('nexus_docs');
    return savedDocs ? JSON.parse(savedDocs) : initialDocuments;
  });

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Save to Local Storage whenever documents change
  useEffect(() => {
    // Note: fileObject save nahi hota, isliye metadata save kar rahe hain
    const docsToSave = documents.map(({ fileObject, ...rest }) => rest);
    localStorage.setItem('nexus_docs', JSON.stringify(docsToSave));
  }, [documents]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: Date.now(),
        name: file.name,
        fileObject: file, 
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        lastModified: new Date().toISOString().split('T')[0],
        status: 'Draft'
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
  };

  const openPreview = (doc: Document) => {
    setSelectedDoc(doc);
    if (doc.fileObject) {
      const url = URL.createObjectURL(doc.fileObject);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null); 
    }
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const deleteDocument = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Kya aap waqai ye document delete karna chahte hain?")) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Signed': return <Badge variant="success" size="sm" leftIcon={<FileCheck size={12}/>}>Signed</Badge>;
      case 'In Review': return <Badge variant="warning" size="sm" leftIcon={<Clock size={12}/>}>In Review</Badge>;
      default: return <Badge variant="neutral" size="sm" leftIcon={<FileWarning size={12}/>}>Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-gray-50/50 min-h-screen">
      <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Chamber</h1>
          <p className="text-gray-500 mt-1">Files are now saved in local storage.</p>
        </div>
        <Button onClick={handleUploadClick} leftIcon={<Upload size={18} />} className="shadow-lg shadow-primary-600/20">
          Upload New PDF
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader><h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Storage Metrics</h2></CardHeader>
            <CardBody>
              <div className="flex justify-between items-end mb-3">
                <span className="text-2xl font-bold text-gray-900">{documents.length}</span>
                <span className="text-xs text-gray-500 mb-1">Total Files</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-primary-600 rounded-full transition-all" style={{ width: `${(documents.length / 10) * 100}%` }}></div>
              </div>
            </CardBody>
          </Card>
          
          <SignaturePad /> 

          <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-xl shadow-primary-600/20">
            <ShieldCheck size={32} className="mb-3 opacity-50" />
            <h3 className="font-bold text-lg italic text-white">Persistent Storage</h3>
            <p className="text-primary-100 text-xs text-white">Aapki document list reload par khatam nahi hogi.</p>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm min-h-[500px]">
            <CardBody className="p-0">
              <div className="divide-y divide-gray-50">
                {documents.map(doc => (
                  <div key={doc.id} className="group flex items-center p-5 hover:bg-primary-50/30 transition-all cursor-pointer" onClick={() => openPreview(doc)}>
                    <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl mr-5">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-gray-800 truncate">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1 uppercase">
                        {doc.size} • {doc.type} • {doc.lastModified}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openPreview(doc)}><Eye size={18} /></Button>
                      <Button variant="ghost" size="sm" className="text-red-400" onClick={(e) => deleteDocument(doc.id, e)}><Trash2 size={18} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && selectedDoc && (
        <div className="fixed inset-0 z-[2000] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8">
          <div className="bg-white w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            <div className="p-5 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3 text-black">
                <FileText size={24} className="text-primary-600" />
                <h3 className="font-bold text-lg">{selectedDoc.name}</h3>
              </div>
              <button onClick={closePreview} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={24} /></button>
            </div>
            
            <div className="flex-1 bg-gray-100 overflow-hidden relative">
              {previewUrl ? (
                <iframe src={previewUrl} className="w-full h-full border-none" title="PDF Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 italic p-10 text-center">
                  <FileWarning size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Reload ke baad original PDF preview available nahi hota kyunki local storage files save nahi karti.</p>
                  <p className="text-sm mt-2 font-bold">Preview dekhne ke liye file dubara upload karein.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;