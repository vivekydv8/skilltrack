with open('frontend/src/pages/TraineePortalDashboardPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace remaining text-[10px]
text = text.replace(
    'className={`px-2 py-0.5 rounded text-[10px] font-bold ${',
    'className={`px-2.5 py-1 rounded-full text-xs font-bold ${'
)

# Upgrade education card
text = text.replace(
    'className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">',
    'className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">'
)
text = text.replace(
    '<span className="font-bold text-slate-900 text-sm">{edu.qualification}</span>',
    '<span className="font-bold text-slate-900 text-base">{edu.qualification}</span>'
)

# Upgrade document card
text = text.replace(
    'className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">',
    'className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-3">'
)
text = text.replace(
    '<h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>',
    '<h4 className="font-bold text-slate-900 text-base">{doc.title}</h4>'
)

# Upgrade follow-up cards
text = text.replace(
    'className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">',
    'className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-sm space-y-2.5">'
)

# Upgrade certifications card
text = text.replace(
    '<span className="font-bold text-slate-900 text-sm">{c.certificate_name}</span>',
    '<span className="font-bold text-slate-900 text-base">{c.certificate_name}</span>'
)

# Upgrade employment card
text = text.replace(
    '<span className="font-bold text-slate-900 text-sm">{p.employer_name}</span>',
    '<span className="font-bold text-slate-900 text-base">{p.employer_name}</span>'
)

# Upgrade opportunities card
text = text.replace(
    '<h4 className="font-bold text-slate-900 text-sm mt-1">{opp.title}</h4>',
    '<h4 className="font-bold text-slate-900 text-base mt-1">{opp.title}</h4>'
)

with open('frontend/src/pages/TraineePortalDashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated remaining cards!')
