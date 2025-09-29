import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Upload, FileText, Sparkles, Check, X, Download, Eye, Trash2, Plus, Brain, Zap, Star, Trophy, Target, Copy, Activity, BarChart3 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useStudent } from '@/contexts/StudentContext';
import { extractTextFromBlob, extractTextFromFile } from '@/lib/fileExtractors';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Analytics Panel Component (following Applications pattern)
function AnalyticsPanel({ skills, extractionHistory, ratings }: { 
  skills: string[]; 
  extractionHistory: any[]; 
  ratings: Record<string, number> 
}) {
  const stats = useMemo(() => {
    const avgRating = skills.length ? 
      Object.values(ratings).reduce((sum, rating) => sum + (rating || 0), 0) / skills.length : 0;
    
    return [
      { 
        label: 'Skills Added', 
        value: skills.length, 
        icon: Target, 
        description: 'Total skills in profile'
      },
      { 
        label: 'Extractions Done', 
        value: extractionHistory.length, 
        icon: BarChart3, 
        description: 'AI analysis completed'
      },
      { 
        label: 'Avg Rating', 
        value: Math.round(avgRating * 10) / 10, 
        icon: Star, 
        description: 'Average skill rating'
      },
      { 
        label: 'Profile Strength', 
        value: Math.min(100, skills.length * 5), 
        icon: Activity, 
        description: 'Based on skills count'
      }
    ];
  }, [skills, extractionHistory, ratings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

const Resume = () => {
  const fileRef = useRef(null);
  const [text, setText] = useState('');
  const [extracted, setExtracted] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractionHistory, setExtractionHistory] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('skillRatings') || '{}'); } catch { return {}; }
  });
  const [previewText, setPreviewText] = useState<string>('');

  const { profile, addSkill: addSkillCtx, removeSkill: removeSkillCtx, setSkills: setSkillsCtx, uploadResume, extractSkillsFromText } = useStudent();
  const [appendMode, setAppendMode] = useState(false);
  const [extractionBanner, setExtractionBanner] = useState<string | null>(null);

  useEffect(() => {
    // Initialize local skills from context profile if available, else defaults
    if (profile?.skills && profile.skills.length) {
      setSkills(profile.skills);
    } else {
      setSkills(['React', 'TypeScript', 'Node.js', 'Python']);
    }
  }, [profile?.skills]);

  useEffect(() => {
    try { localStorage.setItem('skillRatings', JSON.stringify(ratings)); } catch {}
  }, [ratings]);

  useEffect(() => {
    // Try to load text preview from uploaded resume and optionally auto-paste
    const loadPreview = async () => {
      setPreviewText('');
      if (!profile?.resumeUrl) return;
      try {
        const res = await fetch(profile.resumeUrl);
        const blob = await res.blob();
        const txt = await extractTextFromBlob(blob, profile?.resumeName || '');
        if (txt) {
          const snippet = txt.slice(0, 4000);
          setPreviewText(snippet);
          const name = String(profile?.resumeName || '').toLowerCase();
          const isPdf = name.endsWith('.pdf') || blob.type === 'application/pdf';
          const isDocx = name.endsWith('.docx') || blob.type.includes('officedocument');
          if (appendMode) {
            setText(prev => (prev ? prev + "\n\n" : '') + snippet);
            if (isPdf || isDocx) setExtractionBanner(`Text extracted from your ${isPdf ? 'PDF' : 'DOCX'} and appended below.`);
          } else if (!text.trim()) {
            setText(snippet);
            if (isPdf || isDocx) setExtractionBanner(`Text extracted from your ${isPdf ? 'PDF' : 'DOCX'} and pasted below.`);
          }
        }
      } catch {}
    };
    loadPreview();
  }, [profile?.resumeUrl, appendMode]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    // Simulate upload delay
    setTimeout(async () => {
      setResumeFile(file);
      try {
        await uploadResume(file);
      } catch {}
      setUploading(false);
      setUploadSuccess(true);
      
      // Auto-paste extracted text (supports TXT/PDF/DOCX)
      try {
        const txt = await extractTextFromFile(file);
        if (txt) {
          const snippet = txt.slice(0, 4000);
          const lower = (file.name || '').toLowerCase();
          const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf';
          const isDocx = lower.endsWith('.docx') || file.type.includes('officedocument');
          if (appendMode) {
            setText(prev => (prev ? prev + "\n\n" : '') + snippet);
            if (isPdf || isDocx) setExtractionBanner(`Text extracted from your ${isPdf ? 'PDF' : 'DOCX'} and appended below.`);
          } else {
            setText(snippet);
            if (isPdf || isDocx) setExtractionBanner(`Text extracted from your ${isPdf ? 'PDF' : 'DOCX'} and pasted below.`);
          }
        }
      } catch {}
      
      // Auto-hide success message
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 500);
  };

  const onUpload = async (e: any) => {
    const file = e.target.files?.[0] as File;
    if (file) {
      handleFileUpload(file);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const updateRating = (skill: string, value: number) => {
    setRatings(prev => ({ ...prev, [skill]: value }));
  };

  const onExtract = async () => {
    // Use pasted text if available; otherwise prefer previewText; otherwise read uploaded text file.
    let sourceText = text.trim();

    if (!sourceText && previewText) {
      sourceText = previewText.trim();
    }

    if (!sourceText && resumeFile) {
      if (resumeFile.type.startsWith('text/')) {
        try {
          sourceText = await readFileAsText(resumeFile);
        } catch {
          toast('Could not read uploaded file', { description: 'Please paste text and click Extract.' });
        }
      } else {
        toast('File extraction not supported', { description: 'For PDF/DOCX, please paste text into the box and click Extract.' });
      }
    }

    if (!sourceText) return;

    // Reflect the resume text in the AI extraction textarea to make it visible to the user
    if (!text.trim()) setText(sourceText);

    setExtracting(true);

    // Simulate processing delay
    setTimeout(() => {
      const found = extractSkillsFromText(sourceText);
      setExtracted(found);
      setExtractionHistory(prev => [...prev, { 
        timestamp: new Date(), 
        skillCount: found.length,
        text: sourceText.substring(0, 100) + '...'
      }]);
      setExtracting(false);
      if (!found.length) toast('No skills detected', { description: 'Try refining the text or add keywords.' });
    }, 700);
  };

  const onExtractFromPreview = async () => {
    if (!previewText) {
      toast('No preview text available', { description: 'Upload a TXT resume or paste text into the box.' });
      return;
    }
    const found = extractSkillsFromText(previewText);
    setExtracted(found);
    setExtractionHistory(prev => [...prev, {
      timestamp: new Date(),
      skillCount: found.length,
      text: previewText.substring(0, 100) + '...'
    }]);
    if (!found.length) toast('No skills detected', { description: 'Try refining the text or add keywords.' });
  };

  const copyExtracted = async () => {
    try {
      await navigator.clipboard.writeText(extracted.join(', '));
      toast('Copied extracted skills');
    } catch {
      toast('Copy failed', { description: 'Your browser blocked clipboard access.' });
    }
  };

  const addNewOnly = () => {
    const news = extracted.filter(s => !skills.includes(s));
    news.forEach(addSkill);
    setExtracted(extracted.filter(s => skills.includes(s)));
  };

  const clearExtracted = () => setExtracted([]);

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(prev => {
        const next = [...prev, skill];
        try { setSkillsCtx(next); } catch {}
        try { addSkillCtx(skill); } catch {}
        return next;
      });
    }
  };

  const addAll = () => {
    extracted.forEach(skill => addSkill(skill));
    setExtracted([]);
    setText('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
    try { removeSkillCtx(skillToRemove); } catch {}
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    setUploadSuccess(false);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleDragEvents = (e) => handleDrag(e);
    
    document.addEventListener("dragenter", handleDragEvents);
    document.addEventListener("dragleave", handleDragEvents);
    document.addEventListener("dragover", handleDragEvents);
    document.addEventListener("drop", handleDrop);
    
    return () => {
      document.removeEventListener("dragenter", handleDragEvents);
      document.removeEventListener("dragleave", handleDragEvents);
      document.removeEventListener("dragover", handleDragEvents);
      document.removeEventListener("drop", handleDrop);
    };
  }, [handleDrag, handleDrop]);

  // Auto-hide banner after a few seconds
  useEffect(() => {
    if (!extractionBanner) return;
    const t = setTimeout(() => setExtractionBanner(null), 4000);
    return () => clearTimeout(t);
  }, [extractionBanner]);

  return (
    <DashboardLayout title="Resume & Skills Hub">
      <div className="space-y-6">
        {/* Analytics Panel */}
        <AnalyticsPanel skills={skills} extractionHistory={extractionHistory} ratings={ratings} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Resume Upload Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Upload Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume to automatically extract skills and build your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : uploading 
                        ? 'border-blue-300 bg-blue-25' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  {uploading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-lg font-medium text-gray-700">Uploading your resume...</p>
                      <Progress value={60} className="h-2" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag & drop your resume here
                        </p>
                        <p className="text-gray-500 mb-4">or click to browse files</p>
                        <Button
                          onClick={() => fileRef.current?.click()}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Choose File
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={onUpload}
                    accept=".pdf,.doc,.docx,.txt,text/plain"
                    className="hidden"
                  />
                </div>

                <AnimatePresence>
                  {uploadSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-medium">Resume uploaded successfully!</p>
                      </div>
                    </motion.div>
                  )}

                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{uploadError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {profile?.resumeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{profile?.resumeName}</p>
                          <p className="text-sm text-gray-600">Resume uploaded</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(profile?.resumeUrl as string, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = profile?.resumeUrl as string;
                            a.download = profile?.resumeName as string;
                            a.click();
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={removeResumeFile}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Inline preview for PDFs or text */}
                    {String(profile?.resumeName || '').toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-96 rounded-lg overflow-hidden border">
                        <iframe src={profile?.resumeUrl as string} title="Resume PDF Preview" className="w-full h-full" />
                      </div>
                    ) : (
                      previewText && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">Text Preview</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onExtractFromPreview}
                            >
                              <Sparkles className="w-4 h-4 mr-1" />
                              Extract from Preview
                            </Button>
                          </div>
                          <pre className="max-h-64 overflow-auto p-3 bg-white/70 rounded-lg border text-xs whitespace-pre-wrap">{previewText}</pre>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Current Skills Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <span>Your Skills</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {skills.length} skills
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {skills.map((skill, index) => (
                      <motion.div 
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl px-4 py-2 hover:shadow-md transition-all duration-300"
                      >
                        <span className="font-medium text-gray-700">{skill}</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(n => (
                            <button 
                              key={n} 
                              onClick={() => updateRating(skill, n)} 
                              className={`${n <= (ratings[skill] || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`} 
                              title={`Set ${skill} to ${n} star${n>1?'s':''}`}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {skills.length === 0 && (
                    <p className="text-gray-500 italic">No skills added yet. Extract some from your resume text!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Extraction Section */}
          <div className="space-y-6">
            {/* AI Skills Extraction Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <span>AI Skills Extraction</span>
                </CardTitle>
                <CardDescription>
                  Paste your resume text and let AI identify your skills automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {extractionBanner && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800 text-sm"
                    >
                      {extractionBanner}
                    </motion.div>
                  </AnimatePresence>
                )}
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Paste your resume text
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Switch checked={appendMode} onCheckedChange={(v) => setAppendMode(v === true)} id="append-mode" />
                    <label htmlFor="append-mode">Append when auto-pasting</label>
                  </div>
                </div>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your resume content here... I'll intelligently detect all your skills and technologies!"
                    rows={8}
                    className="resize-none"
                  />
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={onExtract}
                    disabled={extracting || (!text.trim() && !resumeFile)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {extracting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        <span>Extract Skills</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onExtractFromPreview}
                    disabled={!previewText}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    From Preview
                  </Button>

                  {extracted.length > 0 && (
                    <>
                      <Button
                        onClick={addAll}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add All ({extracted.length})
                      </Button>
                      <Button variant="outline" onClick={addNewOnly}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Only
                      </Button>
                      <Button variant="outline" onClick={copyExtracted}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" onClick={clearExtracted}>
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </>
                  )}
                </div>
                
                <AnimatePresence>
                  {extracted.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-semibold text-gray-900">Detected Skills</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {extracted.map((skill, index) => (
                          <motion.div 
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-4 py-2 shadow-sm"
                          >
                            <span className="font-medium text-purple-700">{skill}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                addSkill(skill);
                                setExtracted(prev => prev.filter(s => s !== skill));
                              }}
                              className="text-green-500 hover:text-green-600 h-auto p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Smart Suggestions Card (shows after first extraction) */}
            {extractionHistory.length > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="border-0 shadow-2xl overflow-hidden">
                    <CardHeader className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
                      <div className="relative z-10 flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <span>Smart Suggestions</span>
                        </CardTitle>
                        <Badge className="bg-white/20 text-white border-white/30">Personalized</Badge>
                      </div>
                      <CardDescription className="relative z-10 text-white/90 pt-2">
                        Popular skills across categories to quickly enhance your profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[
                          { title: 'Frontend', items: ['React','TypeScript','HTML','CSS','Tailwind CSS'], gradient: 'from-blue-50 to-cyan-50', chip: 'hover:bg-blue-50', ring: 'ring-blue-100' },
                          { title: 'Backend', items: ['Node.js','Express','SQL','REST'], gradient: 'from-emerald-50 to-green-50', chip: 'hover:bg-emerald-50', ring: 'ring-emerald-100' },
                          { title: 'Data & AI', items: ['Python','Pandas','Machine Learning','Data Analysis'], gradient: 'from-purple-50 to-fuchsia-50', chip: 'hover:bg-purple-50', ring: 'ring-purple-100' },
                          { title: 'Cloud & DevOps', items: ['Docker','AWS','Git','CI/CD'], gradient: 'from-amber-50 to-yellow-50', chip: 'hover:bg-amber-50', ring: 'ring-amber-100' },
                          { title: 'Soft Skills', items: ['Communication','Teamwork','Leadership','Problem Solving'], gradient: 'from-pink-50 to-rose-50', chip: 'hover:bg-pink-50', ring: 'ring-rose-100' },
                        ].map((group) => (
                          <div key={group.title} className={`p-5 rounded-xl border border-gray-200 bg-gradient-to-br ${group.gradient} ring-1 ${group.ring}`}>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{group.title}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => group.items.filter(s => !skills.includes(s)).forEach(addSkill)}
                                className="border-gray-300 hover:border-gray-400"
                              >
                                Add All
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.items.map(s => (
                                <button
                                  key={s}
                                  onClick={() => !skills.includes(s) && addSkill(s)}
                                  disabled={skills.includes(s)}
                                  className={`px-3 h-8 rounded-full border text-xs font-medium transition-colors ${skills.includes(s) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : `bg-white/80 text-gray-700 border-gray-200 ${group.chip}`}`}
                                  title={skills.includes(s) ? 'Already added' : 'Add skill'}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Extraction History Card */}
            {extractionHistory.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <span>Extraction History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extractionHistory.slice(-3).reverse().map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {entry.skillCount} skills extracted
                          </span>
                          <span className="text-sm text-gray-500">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{entry.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Resume;
