"""
Comprehensive upgrade script for TraineePortalDashboardPage.tsx typography and theme.
Replaces micro-fonts (text-[9px], text-[10px], text-[11px], cramped text-xs) with
readable, modern government standard font sizes (text-sm, text-base, text-lg, text-xl, text-2xl).
"""

with open('frontend/src/pages/TraineePortalDashboardPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

original_len = len(text)

# 1. Header typography & strength widget
text = text.replace(
    'text-sm tracking-tight">\n                    SkillTrackAI',
    'text-base sm:text-lg tracking-tight font-extrabold">\n                    SkillTrackAI'
)
text = text.replace(
    'text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 uppercase',
    'text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 uppercase'
)
text = text.replace(
    'text-[10px] text-slate-500 hidden sm:block',
    'text-xs text-slate-500 hidden sm:block'
)
text = text.replace(
    '<div className="text-xs font-bold text-slate-900">{profile.full_name}</div>',
    '<div className="text-sm font-bold text-slate-900">{profile.full_name}</div>'
)
text = text.replace(
    '<span className="text-[10px] text-slate-500">Skill ID:</span>',
    '<span className="text-xs text-slate-500 font-medium">Skill ID:</span>'
)
text = text.replace(
    '<code className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">',
    '<code className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">'
)
text = text.replace(
    'relative w-9 h-9 flex items-center justify-center',
    'relative w-11 h-11 flex items-center justify-center'
)
text = text.replace(
    'svg className="w-9 h-9 -rotate-90"',
    'svg className="w-11 h-11 -rotate-90"'
)
text = text.replace(
    '<span className="absolute text-[9px] font-extrabold text-teal-900">',
    '<span className="absolute text-xs font-black text-teal-900">'
)
text = text.replace(
    '<span className="text-[9px] text-slate-500 font-medium">Strength</span>',
    '<span className="text-[11px] text-slate-600 font-bold">Strength</span>'
)
text = text.replace(
    'px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 rounded-xl transition shadow-xs group',
    'px-3.5 py-2 text-sm font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition shadow-xs group'
)
text = text.replace(
    'navigate(\'/trainee/login\');',
    'navigate(\'/login?role=trainee\');'
)

# 2. Navigation ribbon: upgrade text size and padding
text = text.replace(
    '<nav className="flex space-x-1 py-1.5 min-w-max text-xs font-semibold">',
    '<nav className="flex space-x-1.5 py-2.5 min-w-max text-sm font-semibold">'
)
text = text.replace(
    'className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${',
    'className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition ${'
)
text = text.replace(
    '<Icon className={`w-3.5 h-3.5 ${active ? \'text-teal-700\' : \'text-slate-400\'}`} />',
    '<Icon className={`w-4 h-4 ${active ? \'text-teal-700\' : \'text-slate-400\'}`} />'
)

# 3. Main Dashboard cards and items
text = text.replace(
    '<h2 className="text-xl font-black text-slate-900">{profile.full_name}</h2>',
    '<h2 className="text-2xl font-black text-slate-900">{profile.full_name}</h2>'
)
text = text.replace(
    '<span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">',
    '<span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">'
)
text = text.replace(
    '<span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">',
    '<span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">'
)
text = text.replace(
    '<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">',
    '<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 mt-2">'
)
text = text.replace(
    '<p className="text-xs text-slate-600 mt-2 max-w-2xl">{profile.bio}</p>',
    '<p className="text-sm sm:text-base text-slate-700 mt-2.5 max-w-3xl leading-relaxed">{profile.bio}</p>'
)
text = text.replace(
    '<div className="flex items-center justify-between text-xs mb-1.5">',
    '<div className="flex items-center justify-between text-sm mb-1.5">'
)
text = text.replace(
    '<span className="font-extrabold text-teal-800">',
    '<span className="text-base font-black text-teal-800">'
)
text = text.replace(
    '<div className="mt-2 text-[11px] text-slate-500">',
    '<div className="mt-2.5 text-xs text-slate-600 font-medium">'
)

# 4. Longitudinal Career Journey
text = text.replace(
    '<h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">',
    '<h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">'
)
text = text.replace(
    '<span className="text-[11px] text-slate-500">Evidence-Backed Longitudinal Pipeline</span>',
    '<span className="text-xs text-slate-500 font-medium">Evidence-Backed Longitudinal Pipeline</span>'
)
text = text.replace(
    '<div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">',
    '<div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center text-sm">'
)
text = text.replace(
    '<div className="text-[11px] font-bold text-slate-700">{st.step}</div>',
    '<div className="text-xs font-bold text-slate-800">{st.step}</div>'
)
text = text.replace(
    'className={`text-[10px] font-bold px-2 py-0.5 rounded-full',
    'className={`text-xs font-bold px-2.5 py-0.5 rounded-full'
)
text = text.replace(
    '<div className="text-[10px] text-slate-500 truncate" title={st.count}>{st.count}</div>',
    '<div className="text-xs text-slate-600 truncate mt-0.5 font-medium" title={st.count}>{st.count}</div>'
)

# 5. Dashboard Summary Widgets: Strengths, Gaps, Next Steps
text = text.replace(
    '<div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-3">',
    '<div className="flex items-center gap-2 text-teal-900 font-bold text-base mb-3.5">'
)
text = text.replace(
    '<div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">',
    '<div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-3.5">'
)
text = text.replace(
    '<div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">',
    '<div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3.5">'
)
text = text.replace(
    '<div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">',
    '<div className="text-xs text-slate-600 mt-1 flex justify-between font-medium">'
)
text = text.replace(
    '<div className="text-[11px] text-amber-800 mt-1">',
    '<div className="text-xs text-amber-800 mt-1 font-medium">'
)
text = text.replace(
    '<p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{sg.recommended_action}</p>',
    '<p className="text-xs text-slate-700 mt-1.5 line-clamp-2 leading-relaxed">{sg.recommended_action}</p>'
)
text = text.replace(
    '<div className="text-[11px] text-slate-700 mt-1 font-medium">',
    '<div className="text-xs sm:text-sm text-slate-700 mt-1 font-medium leading-relaxed">'
)
text = text.replace(
    '<span className="text-[11px] text-slate-500">{j.employment_type}</span>',
    '<span className="text-xs text-slate-600 font-medium">{j.employment_type}</span>'
)

# 6. Profile tab
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Personal Information & Profile</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Personal Information & Profile</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Only verified data is shared with authorized ecosystem portals</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Only verified data is shared with authorized ecosystem portals</p>'
)
text = text.replace(
    'className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 transition"',
    'className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 hover:bg-slate-50 transition shadow-xs"'
)
text = text.replace(
    '<form onSubmit={handleSaveProfile} className="space-y-4 text-xs">',
    '<form onSubmit={handleSaveProfile} className="space-y-5 text-sm sm:text-base">'
)
text = text.replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">',
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">'
)
text = text.replace(
    '<span className="text-slate-500">Skill ID (Canonical):</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill ID (Canonical):</span>'
)
text = text.replace(
    '<span className="text-slate-500">Full Legal Name:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Legal Name:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Date of Birth:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Gender & Category:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender & Category:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Registered Contact:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Contact:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Address & District:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address & District:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Target Career Role:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Career Role:</span>'
)
text = text.replace(
    '<span className="text-slate-500">Outcome Verification Confidence:</span>',
    '<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome Verification Confidence:</span>'
)

# 7. Education tab
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Educational Qualifications</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Educational Qualifications</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Class 10, Class 12, ITI, Diploma, Undergraduate & Professional Qualifications</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Class 10, Class 12, ITI, Diploma, Undergraduate & Professional Qualifications</p>'
)
text = text.replace(
    'className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs"',
    'className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"'
)
text = text.replace(
    '<div className="text-[10px] text-slate-400">Source: {edu.source}</div>',
    '<div className="text-xs text-slate-500 font-medium">Source: {edu.source}</div>'
)

# 8. Document Vault
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Document Vault</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Document Vault</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Categorized verifiable marksheets, trade certificates & experience documents</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Categorized verifiable marksheets, trade certificates & experience documents</p>'
)
text = text.replace(
    '<h4 className="text-sm font-bold text-slate-900">National Academic Depository / DigiLocker</h4>',
    '<h4 className="text-base font-bold text-slate-900">National Academic Depository / DigiLocker</h4>'
)
text = text.replace(
    '<p className="text-xs text-slate-500 mt-0.5">',
    '<p className="text-sm text-slate-600 mt-0.5">'
)
text = text.replace(
    '<div className="text-[11px] text-slate-600 mt-1">',
    '<div className="text-xs text-slate-600 mt-1.5 font-medium">'
)
text = text.replace(
    'className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"',
    'className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"'
)
text = text.replace(
    '<span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 px-2 py-0.5 bg-teal-50 rounded border border-teal-200">',
    '<span className="text-xs font-bold uppercase tracking-wider text-teal-800 px-2.5 py-1 bg-teal-50 rounded border border-teal-200">'
)
text = text.replace(
    '<div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">',
    '<div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">'
)
text = text.replace(
    '<pre className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 overflow-x-auto">',
    '<pre className="text-xs font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">'
)
text = text.replace(
    '<div className="text-[9px] text-slate-400 mt-1">Source: {doc.evidence_source}</div>',
    '<div className="text-xs text-slate-500 mt-1 font-medium">Source: {doc.evidence_source}</div>'
)

# 9. Skill Profile tab
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Skill Profile</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Skill Profile</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Verified, Training-derived, Assessment-derived, Self-reported & AI-inferred skills</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Verified, Training-derived, Assessment-derived, Self-reported & AI-inferred skills</p>'
)
text = text.replace(
    '<span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-teal-800">',
    '<span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white border border-slate-200 text-teal-800">'
)
text = text.replace(
    '<div className="text-[11px] text-slate-500 mt-1">Proficiency: {s.proficiency}</div>',
    '<div className="text-xs text-slate-600 mt-1 font-medium">Proficiency: {s.proficiency}</div>'
)
text = text.replace(
    '<div className="text-[11px] text-slate-600 mt-1.5 p-2 bg-white rounded border border-slate-200/80">',
    '<div className="text-xs text-slate-700 mt-1.5 p-2.5 bg-white rounded-lg border border-slate-200/80 leading-relaxed">'
)

# 10. Skill Gaps tab
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">My Skill Gaps</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">My Skill Gaps</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">\n                    Mathematically detected gaps between your verified profile and target career requirements',
    '<p className="text-sm text-slate-600 mt-0.5">\n                    Mathematically detected gaps between your verified profile and target career requirements'
)
text = text.replace(
    '<span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Target Role</span>',
    '<span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Target Role</span>'
)
text = text.replace(
    '<h4 className="text-base font-bold text-slate-900">{sg.target_role}</h4>',
    '<h4 className="text-lg font-black text-slate-900">{sg.target_role}</h4>'
)

# 11. Jobs & Explainable Matching
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Explainable Job Matching</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Explainable Job Matching</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Real vacancies from authorized industry partners with mathematical fit breakdown</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Real vacancies from authorized industry partners with mathematical fit breakdown</p>'
)
text = text.replace(
    '<div className="text-[11px] font-mono text-slate-600 mt-1">{job.salary_range}</div>',
    '<div className="text-xs sm:text-sm font-mono font-bold text-slate-700 mt-1">{job.salary_range}</div>'
)
text = text.replace(
    '<span className="text-slate-400 text-[11px]">Source: {job.source} · Posted: {job.posted_date}</span>',
    '<span className="text-slate-500 text-xs font-medium">Source: {job.source} · Posted: {job.posted_date}</span>'
)
text = text.replace(
    'className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs transition shadow-xs"',
    'className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition shadow-xs"'
)

# 12. Career Recommendations & Roadmap
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Personalized Career Recommendations</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Personalized Career Recommendations</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Every recommendation specifies the exact data evidence and WHY it was generated</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Every recommendation specifies the exact data evidence and WHY it was generated</p>'
)
text = text.replace(
    '<span className="text-[10px] text-slate-400">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>',
    '<span className="text-xs font-semibold text-slate-500">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>'
)
text = text.replace(
    '<div className="text-[9px] text-slate-400">Model Lineage: {rec.lineage_model}</div>',
    '<div className="text-xs text-slate-500 font-medium">Model Lineage: {rec.lineage_model}</div>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">My Career Roadmap</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">My Career Roadmap</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Longitudinal progression from vocational foundation to supervisory specialist</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Longitudinal progression from vocational foundation to supervisory specialist</p>'
)
text = text.replace(
    '<p className="text-slate-600 text-[11px]">{st.desc}</p>',
    '<p className="text-slate-600 text-xs leading-relaxed">{st.desc}</p>'
)

# 13. Training Provider, Assessments, Certifications, Employment
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Connected Training Provider Record</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Connected Training Provider Record</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Authoritative records synchronized from the Training Provider Portal</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Authoritative records synchronized from the Training Provider Portal</p>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Authorized Assessments</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Authorized Assessments</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Competency assessments certified by State Assessment Bodies</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Competency assessments certified by State Assessment Bodies</p>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Verifiable Digital Certifications</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Verifiable Digital Certifications</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Connected credentials from DVET, NCVT, and accredited bodies</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Connected credentials from DVET, NCVT, and accredited bodies</p>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Employment Status & Job Relevance</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Employment Status & Job Relevance</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Tracks longitudinal placement, job relevance, and retention</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Tracks longitudinal placement, job relevance, and retention</p>'
)
text = text.replace(
    'className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs"',
    'className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition shadow-xs"'
)
text = text.replace(
    '<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">',
    '<span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">'
)
text = text.replace(
    '<span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">',
    '<span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium">'
)
text = text.replace(
    '<div className="text-[10px] text-slate-400">Source: {c.source}</div>',
    '<div className="text-xs text-slate-500 font-medium">Source: {c.source}</div>'
)

# 14. Follow-up & Wage Progression
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Longitudinal Follow-Up Engine</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Longitudinal Follow-Up Engine</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Multi-channel post-certification checkpoints at 30, 90, 180, and 365 days</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Multi-channel post-certification checkpoints at 30, 90, 180, and 365 days</p>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Wage Progression Timeline</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Wage Progression Timeline</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Only verified values displayed. Zero invented salary figures.</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Only verified values displayed. Zero invented salary figures.</p>'
)
text = text.replace(
    '<div className="text-[10px] text-slate-400">{chk.scheduled}</div>',
    '<div className="text-xs text-slate-500 font-medium">{chk.scheduled}</div>'
)
text = text.replace(
    '<div className="text-[11px] text-slate-500">{stg.source} · {stg.effective_date}</div>',
    '<div className="text-xs text-slate-600 font-medium">{stg.source} · {stg.effective_date}</div>'
)
text = text.replace(
    '<span className="text-[10px] font-bold text-emerald-800">{stg.verification_status}</span>',
    '<span className="text-xs font-bold text-emerald-800">{stg.verification_status}</span>'
)

# 15. Opportunities & Privacy Center
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Opportunity Discovery</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Opportunity Discovery</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Real vacancies and authorized vocational programmes with zero mock records</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Real vacancies and authorized vocational programmes with zero mock records</p>'
)
text = text.replace(
    '<span className="text-[11px] font-mono text-slate-600">{opp.compensation}</span>',
    '<span className="text-xs font-mono font-bold text-slate-700">{opp.compensation}</span>'
)
text = text.replace(
    '<span className="text-[10px] text-slate-400">{opp.source}</span>',
    '<span className="text-xs text-slate-500 font-medium">{opp.source}</span>'
)
text = text.replace(
    '<h3 className="text-lg font-bold text-slate-900">Privacy Center</h3>',
    '<h3 className="text-xl sm:text-2xl font-black text-slate-900">Privacy Center</h3>'
)
text = text.replace(
    '<p className="text-xs text-slate-500">Compliance with India\'s Digital Personal Data Protection (DPDP) Act 2023</p>',
    '<p className="text-sm text-slate-600 mt-0.5">Compliance with India\'s Digital Personal Data Protection (DPDP) Act 2023</p>'
)
text = text.replace(
    'className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs"',
    'className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition shadow-xs"'
)
text = text.replace(
    '<div className="text-[10px] text-teal-800 font-medium">Legal Basis: {w.legal_basis}</div>',
    '<div className="text-xs text-teal-800 font-semibold">Legal Basis: {w.legal_basis}</div>'
)

# 16. AI Assistant Drawer
text = text.replace(
    '<p className="text-[10px] text-teal-800 font-medium">Zero-Hallucination · Strictly Grounded in Profile</p>',
    '<p className="text-xs text-teal-800 font-semibold">Zero-Hallucination · Strictly Grounded in Profile</p>'
)
text = text.replace(
    'className="flex-1 overflow-y-auto p-4 space-y-3 text-xs"',
    'className="flex-1 overflow-y-auto p-5 space-y-4 text-sm"'
)
text = text.replace(
    'className="block w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-teal-800 transition text-[11px]"',
    'className="block w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-teal-900 font-medium transition text-xs sm:text-sm"'
)
text = text.replace(
    'className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500"',
    'className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600"'
)
text = text.replace(
    'className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"',
    'className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"'
)
text = text.replace(
    'className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"',
    'className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center gap-1"'
)

# 17. Modals: increase input and text sizes
modal_replaces = [
    ('<h3 className="font-bold text-base text-slate-900 mb-1">Add Educational Qualification</h3>', '<h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Add Educational Qualification</h3>'),
    ('<h3 className="font-bold text-base text-slate-900 mb-1">Deposit Document into Vault</h3>', '<h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Deposit Document into Vault</h3>'),
    ('<h3 className="font-bold text-base text-slate-900 mb-1">Report a Competency</h3>', '<h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Report a Competency</h3>'),
    ('<h3 className="font-bold text-base text-slate-900 mb-1">Request Official Record Correction</h3>', '<h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Request Official Record Correction</h3>'),
    ('<h3 className="font-bold text-base text-slate-900 mb-1">Update Employment Milestone</h3>', '<h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">Update Employment Milestone</h3>'),
    ('className="space-y-3 text-xs"', 'className="space-y-4 text-sm"'),
    ('px-4 py-2 border border-slate-300 rounded-xl font-bold"', 'px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-sm"'),
    ('px-4 py-2 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition"', 'px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition text-sm"'),
    ('className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"', 'className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"')
]

for old, new in modal_replaces:
    text = text.replace(old, new)

with open('frontend/src/pages/TraineePortalDashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Successfully updated TraineePortalDashboardPage.tsx! File size changed: {original_len} -> {len(text)} bytes.")
