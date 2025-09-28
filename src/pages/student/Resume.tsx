import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Sparkles, Check, X, Download, Eye, Trash2, Plus, Brain, Zap, Star, Trophy, Target } from 'lucide-react';
import { useStudent } from '@/contexts/StudentContext';
import { toast } from '@/components/ui/sonner';

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

  const { profile, addSkill: addSkillCtx, removeSkill: removeSkillCtx, setSkills: setSkillsCtx, uploadResume, extractSkillsFromText } = useStudent();

  useEffect(() => {
    // Initialize local skills from context profile if available, else defaults
    if (profile?.skills && profile.skills.length) {
      setSkills(profile.skills);
    } else {
      setSkills(['React', 'TypeScript', 'Node.js', 'Python']);
    }
  }, [profile?.skills]);

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

  const onExtract = async () => {
    // Prefer pasted text; if none, try to read uploaded file if it is text/*
    let sourceText = text.trim();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Resume & Skills Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let AI extract your skills automatically. Build your professional profile with intelligent insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
                <p className="text-gray-600">Skills Added</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{extractionHistory.length}</p>
                <p className="text-gray-600">Extractions Done</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">AI</p>
                <p className="text-gray-600">Powered</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>
              </div>
              
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
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
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Choose File
                      </button>
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

              {uploadSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">Resume uploaded successfully!</p>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-red-800">{uploadError}</p>
                  </div>
                </div>
              )}

              {profile?.resumeUrl && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
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
                      <button
                        onClick={() => window.open(profile?.resumeUrl as string, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Resume"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = profile?.resumeUrl as string;
                          a.download = profile?.resumeName as string;
                          a.click();
                        }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={removeResumeFile}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Your Skills</h3>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {skills.length} skills
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div 
                    key={skill}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl px-4 py-2 hover:shadow-md transition-all duration-300 animate-fadeIn"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <span className="font-medium text-gray-700">{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500 italic">No skills added yet. Extract some from your resume text!</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Extraction Section */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI Skills Extraction</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Paste your resume text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your resume content here... I'll intelligently detect all your skills and technologies!"
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onExtract}
                    disabled={!text.trim() || extracting}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {extracting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Extract Skills</span>
                      </>
                    )}
                  </button>
                  
                  {extracted.length > 0 && (
                    <button
                      onClick={addAll}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add All ({extracted.length})</span>
                    </button>
                  )}
                </div>
                
                {extracted.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Detected Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {extracted.map((skill, index) => (
                        <div 
                          key={skill}
                          className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-4 py-2 shadow-sm animate-bounceIn"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <span className="font-medium text-purple-700">{skill}</span>
                          <button
                            onClick={() => {
                              addSkill(skill);
                              setExtracted(prev => prev.filter(s => s !== skill));
                            }}
                            className="text-green-500 hover:text-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extraction History */}
            {extractionHistory.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Extraction History</h3>
                </div>
                
                <div className="space-y-4">
                  {extractionHistory.slice(-3).reverse().map((entry, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {entry.skillCount} skills extracted
                        </span>
                        <span className="text-sm text-gray-500">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Resume;
