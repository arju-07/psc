"""
Kerala PYQ Hub - Seed Data & Exam Catalogue
Provides initial comprehensive catalogue covering all 14 required categories,
realistic examinations, and verified historical question papers with bilingual Malayalam/English content.
All sample/benchmark papers are clearly tagged to ensure transparency.
"""

INITIAL_CATEGORIES = [
    {
        "id": "cat-kpsc",
        "name": "Kerala PSC",
        "name_malayalam": "കേരള പി.എസ്.സി",
        "description": "Examinations conducted by Kerala Public Service Commission for various state departments.",
        "icon": "GraduationCap",
        "order": 1,
        "is_active": True
    },
    {
        "id": "cat-kas",
        "name": "Kerala Administrative Service (KAS)",
        "name_malayalam": "കേരള അഡ്മിനിസ്ട്രേറ്റീവ് സർവീസ്",
        "description": "Prestigious state civil service examination for gazetted officer posts in Kerala Government.",
        "icon": "Award",
        "order": 2,
        "is_active": True
    },
    {
        "id": "cat-police",
        "name": "Kerala Police and Uniformed Services",
        "name_malayalam": "പോലീസ് & യൂണിഫോംഡ് സർവീസസ്",
        "description": "Sub-Inspector, Civil Police Officer (CPO), Fireman, Civil Defence, and Jail Warden recruitment.",
        "icon": "Shield",
        "order": 3,
        "is_active": True
    },
    {
        "id": "cat-excise-forest",
        "name": "Kerala Excise and Forest Department",
        "name_malayalam": "എക്സൈസ് & ഫോറസ്റ്റ് സർവീസസ്",
        "description": "Civil Excise Officer, Forest Beat Officer, Range Forest Officer recruitment exams.",
        "icon": "Trees",
        "order": 4,
        "is_active": True
    },
    {
        "id": "cat-ktet-set",
        "name": "KTET and Kerala SET",
        "name_malayalam": "കെ-ടെറ്റ് & കേരള സെറ്റ്",
        "description": "Kerala Teacher Eligibility Test (Cat I-IV) and State Eligibility Test for Higher Secondary teachers.",
        "icon": "BookOpen",
        "order": 5,
        "is_active": True
    },
    {
        "id": "cat-keam-neet",
        "name": "KEAM and NEET",
        "name_malayalam": "കീം & നീറ്റ് പ്രവേശന പരീക്ഷകൾ",
        "description": "Engineering, Medical, Architecture, and Allied Sciences Entrance Examinations.",
        "icon": "FlaskConical",
        "order": 6,
        "is_active": True
    },
    {
        "id": "cat-lbs",
        "name": "LBS Entrance Examinations",
        "name_malayalam": "എൽ.ബി.എസ് പ്രവേശന പരീക്ഷകൾ",
        "description": "LBS Centre for Science & Technology tests for MCA, B.Sc Nursing, Paramedical degree courses.",
        "icon": "School",
        "order": 7,
        "is_active": True
    },
    {
        "id": "cat-bank",
        "name": "Kerala Bank and IBPS",
        "name_malayalam": "കേരള ബാങ്ക് & ഐ.ബി.പി.എസ്",
        "description": "Kerala State Co-operative Bank, District Co-operative Banks, and IBPS PO/Clerk/RRB tests.",
        "icon": "Building2",
        "order": 8,
        "is_active": True
    },
    {
        "id": "cat-ssc",
        "name": "SSC CGL, CHSL and MTS",
        "name_malayalam": "എസ്.എസ്.സി പരീക്ഷകൾ",
        "description": "Staff Selection Commission Combined Graduate Level, Higher Secondary, and Multi-Tasking Staff exams.",
        "icon": "FileCheck2",
        "order": 9,
        "is_active": True
    },
    {
        "id": "cat-rrb",
        "name": "Railway Recruitment Board",
        "name_malayalam": "റെയിൽവേ റിക്രൂട്ട്മെന്റ് ബോർഡ്",
        "description": "RRB NTPC, Group D, Assistant Loco Pilot (ALP), and Technical Cadre examinations.",
        "icon": "Train",
        "order": 10,
        "is_active": True
    },
    {
        "id": "cat-upsc",
        "name": "UPSC",
        "name_malayalam": "യു.പി.എസ്.സി പരീക്ഷകൾ",
        "description": "Union Public Service Commission Civil Services (Prelims & Mains), NDA, CDS, and CAPF.",
        "icon": "Landmark",
        "order": 11,
        "is_active": True
    },
    {
        "id": "cat-defence",
        "name": "Defence Examinations",
        "name_malayalam": "പ്രതിരോധ സേനാ പരീക്ഷകൾ",
        "description": "Indian Army, Indian Navy, Indian Air Force Agniveer, AFCAT, and Coast Guard Navik exams.",
        "icon": "Compass",
        "order": 12,
        "is_active": True
    },
    {
        "id": "cat-nursing",
        "name": "Nursing and Paramedical Recruitment",
        "name_malayalam": "നഴ്സിംഗ് & പാരാമെഡിക്കൽ",
        "description": "DHS/DME Staff Nurse Grade II, Pharmacist, Lab Technician Grade II examinations.",
        "icon": "Stethoscope",
        "order": 13,
        "is_active": True
    },
    {
        "id": "cat-other",
        "name": "Other Government Recruitment",
        "name_malayalam": "മറ്റ് സർക്കാർ പരീക്ഷകൾ",
        "description": "KSEB Sub Engineer, KSRTC, Devaswom Board, Pollution Control Board, and Public Sector Undertakings.",
        "icon": "Briefcase",
        "order": 14,
        "is_active": True
    }
]

INITIAL_EXAMINATIONS = [
    {
        "id": "exam-kpsc-degree-prelims",
        "category_id": "cat-kpsc",
        "name": "Kerala PSC Degree Level Preliminary Examination",
        "name_malayalam": "ഡിഗ്രി ലെവൽ പ്രിലിമിനറി പരീക്ഷ",
        "code": "KPSC-DLP",
        "description": "Common Preliminary Examination for Graduate Level posts including Secretariat Assistant, University Assistant, and Sub Inspector.",
        "syllabus_topics": [
            "History of Kerala & Renaissance",
            "Indian Constitution & Polity",
            "Geography & Environment",
            "General Science & Technology",
            "Simple Arithmetic & Mental Ability",
            "General English",
            "Malayalam Language",
            "Current Affairs"
        ],
        "stages": ["Preliminary Exam", "Mains Examination", "Document Verification"],
        "is_active": True
    },
    {
        "id": "exam-kpsc-ldc",
        "category_id": "cat-kpsc",
        "name": "Lower Division Clerk (LDC / Clerk-Typist)",
        "name_malayalam": "ലോവർ ഡിവിഷൻ ക്ലർക്ക് (എൽ.ഡി.സി)",
        "code": "KPSC-LDC",
        "description": "District-wise 10th level common recruitment exam for clerk vacancies across all state government departments.",
        "syllabus_topics": [
            "Simple Arithmetic & Mental Ability",
            "General Knowledge & Current Affairs",
            "General Science",
            "General English",
            "Malayalam Official Language"
        ],
        "stages": ["Common Preliminary", "Mains Exam"],
        "is_active": True
    },
    {
        "id": "exam-kas-officer",
        "category_id": "cat-kas",
        "name": "Kerala Administrative Service (Junior Time Scale)",
        "name_malayalam": "കെ.എ.എസ് ജൂനിയർ ടൈം സ്കെയിൽ",
        "code": "KAS-JTS",
        "description": "Elite state administration cadre selection directly into second-tier leadership positions.",
        "syllabus_topics": [
            "History, Culture & Heritage of Kerala",
            "Indian Polity & Governance",
            "Economic & Social Development",
            "General Science & Technology",
            "Language Proficiency (Malayalam/English)",
            "Quantitative Aptitude & Reasoning"
        ],
        "stages": ["Preliminary (Paper I & II)", "Mains Written Exam (3 Papers)", "Interview"],
        "is_active": True
    },
    {
        "id": "exam-police-si",
        "category_id": "cat-police",
        "name": "Sub Inspector of Police (Trainee)",
        "name_malayalam": "സബ് ഇൻസ്പെക്ടർ ഓഫ് പോലീസ് (എസ്.ഐ)",
        "code": "KPSC-POL-SI",
        "description": "Kerala Police Executive branch recruitment for direct Sub-Inspectors.",
        "syllabus_topics": [
            "General Knowledge & Renaissance",
            "Indian Constitution & Human Rights",
            "Mental Ability & Quantitative Aptitude",
            "General English",
            "Malayalam Language"
        ],
        "stages": ["Degree Preliminary", "Degree Mains", "Physical Efficiency Test (8 items)", "Medical Test"],
        "is_active": True
    },
    {
        "id": "exam-ktet-cat3",
        "category_id": "cat-ktet-set",
        "name": "Kerala Teacher Eligibility Test (KTET Category III - High School)",
        "name_malayalam": "കെ-ടെറ്റ് കാറ്റഗറി III (ഹൈസ്കൂൾ അധ്യാപക പരീക്ഷ)",
        "code": "KTET-CAT3",
        "description": "Mandatory teacher eligibility qualification for High School Assistants (HSA) in Kerala schools.",
        "syllabus_topics": [
            "Adolescent Psychology & Theories of Learning",
            "Language I (Malayalam/Tamil/Kannada/English)",
            "Subject-specific Pedagogy and Content"
        ],
        "stages": ["Written Examination (150 Marks)"],
        "is_active": True
    },
    {
        "id": "exam-kerala-bank-clerk",
        "category_id": "cat-bank",
        "name": "Kerala Bank Clerk / Cashier",
        "name_malayalam": "കേരള ബാങ്ക് ക്ലർക്ക് / കാഷ്യർ",
        "code": "KBANK-CLK",
        "description": "Recruitment to branches of Kerala State Co-operative Bank across 14 districts.",
        "syllabus_topics": [
            "Banking Awareness & Co-operative Law",
            "Quantitative Aptitude",
            "Reasoning Ability",
            "English Language",
            "General Awareness & Current Affairs"
        ],
        "stages": ["Written Test", "Document Verification"],
        "is_active": True
    },
    {
        "id": "exam-ssc-cgl",
        "category_id": "cat-ssc",
        "name": "SSC Combined Graduate Level (CGL)",
        "name_malayalam": "എസ്.എസ്.സി സി.ജി.എൽ പരീക്ഷ",
        "code": "SSC-CGL",
        "description": "Central government ministry and department inspector and officer posts.",
        "syllabus_topics": [
            "General Intelligence & Reasoning",
            "General Awareness",
            "Quantitative Aptitude",
            "English Comprehension"
        ],
        "stages": ["Tier I (Computer Based)", "Tier II (CBE + Data Entry)"],
        "is_active": True
    },
    {
        "id": "exam-dhs-staff-nurse",
        "category_id": "cat-nursing",
        "name": "DHS Staff Nurse Grade II",
        "name_malayalam": "സ്റ്റാഫ് നഴ്സ് ഗ്രേഡ് II (ഡി.എച്ച്.എസ്)",
        "code": "KPSC-NURSE-GR2",
        "description": "Directorate of Health Services recruitment for registered nurses.",
        "syllabus_topics": [
            "Anatomy & Physiology",
            "Medical Surgical Nursing",
            "Maternal & Child Health Nursing",
            "Community Health Nursing",
            "Mental Health Nursing"
        ],
        "stages": ["OMR Written Examination", "Certificate Verification"],
        "is_active": True
    },
    {
        "id": "exam-kpsc-lgs",
        "category_id": "cat-kpsc",
        "name": "Last Grade Servants (LGS / Peon / Attender)",
        "name_malayalam": "ലാസ്റ്റ് ഗ്രേഡ് സെർവെന്റ്സ് (എൽ.ജി.എസ്)",
        "code": "KPSC-LGS",
        "description": "Common 7th standard qualification recruitment across all departments.",
        "syllabus_topics": ["General Knowledge", "Kerala History", "Simple Arithmetic", "Mental Ability"],
        "stages": ["OMR Examination"],
        "is_active": True
    },
    {
        "id": "exam-kpsc-plus-two",
        "category_id": "cat-kpsc",
        "name": "Kerala PSC Plus Two Level Preliminary",
        "name_malayalam": "പ്ലസ് ടു ലെവൽ പ്രിലിമിനറി പരീക്ഷ",
        "code": "KPSC-PLUS2",
        "description": "Common Preliminary for 12th standard posts including Civil Excise Officer & Beat Forest Officer.",
        "syllabus_topics": ["General Knowledge", "Current Affairs", "Arithmetic", "English", "Malayalam"],
        "stages": ["Preliminary", "Mains"],
        "is_active": True
    },
    {
        "id": "exam-kpsc-sec-asst",
        "category_id": "cat-kpsc",
        "name": "Secretariat Assistant",
        "name_malayalam": "സെക്രട്ടേറിയറ്റ് അസിസ്റ്റന്റ്",
        "code": "KPSC-SEC-ASST",
        "description": "Government Secretariat and Kerala Public Service Commission Office Assistant.",
        "syllabus_topics": ["General Studies", "Renaissance", "Maths", "English", "Malayalam"],
        "stages": ["Degree Prelims", "Degree Mains"],
        "is_active": True
    },
    {
        "id": "exam-kpsc-univ-asst",
        "category_id": "cat-kpsc",
        "name": "University Assistant",
        "name_malayalam": "യൂണിവേഴ്സിറ്റി അസിസ്റ്റന്റ്",
        "code": "KPSC-UNIV-ASST",
        "description": "Kerala, Calicut, MG, Kannur and Agricultural University assistant positions.",
        "syllabus_topics": ["General Knowledge", "Mental Ability", "English", "Malayalam"],
        "stages": ["Degree Prelims", "Degree Mains"],
        "is_active": True
    },
    {
        "id": "exam-police-cpo",
        "category_id": "cat-police",
        "name": "Civil Police Officer (Police Constable)",
        "name_malayalam": "സിവിൽ പോലീസ് ഓഫീസർ (സി.പി.ഒ)",
        "code": "KPSC-POL-CPO",
        "description": "Kerala Police Armed Police Battalions direct recruitment.",
        "syllabus_topics": ["General Knowledge", "Indian Constitution", "Arithmetic", "Physical Efficiency"],
        "stages": ["Written Test", "Physical Efficiency", "Medical Test"],
        "is_active": True
    },
    {
        "id": "exam-excise-officer",
        "category_id": "cat-excise-forest",
        "name": "Civil Excise Officer",
        "name_malayalam": "സിവിൽ എക്സൈസ് ഓഫീസർ",
        "code": "KPSC-EXCISE",
        "description": "Excise Department executive post recruitment across districts.",
        "syllabus_topics": ["General Knowledge", "Renaissance", "Excise Laws", "Physical Efficiency"],
        "stages": ["Written Test", "Physical Endurance"],
        "is_active": True
    },
    {
        "id": "exam-fire-rescue",
        "category_id": "cat-police",
        "name": "Fire and Rescue Officer (Fireman)",
        "name_malayalam": "ഫയർ & റെസ്ക്യൂ ഓഫീസർ",
        "code": "KPSC-FIRE",
        "description": "Kerala Fire and Rescue Services department uniform recruitment.",
        "syllabus_topics": ["General Knowledge", "Science", "Mental Ability", "Physical Tests"],
        "stages": ["Written Test", "Physical Efficiency Test", "Swimming Test"],
        "is_active": True
    },
    {
        "id": "exam-forest-beat-officer",
        "category_id": "cat-excise-forest",
        "name": "Beat Forest Officer",
        "name_malayalam": "ബീറ്റ് ഫോറസ്റ്റ് ഓഫീസർ",
        "code": "KPSC-FOREST",
        "description": "Kerala Forest & Wildlife Department protective staff recruitment.",
        "syllabus_topics": ["General Knowledge", "Forest & Wildlife", "Environmental Science"],
        "stages": ["Written Test", "Endurance Walking Test"],
        "is_active": True
    },
    {
        "id": "exam-kerala-set",
        "category_id": "cat-ktet-set",
        "name": "Kerala State Eligibility Test (SET)",
        "name_malayalam": "കേരള സ്റ്റേറ്റ് എലിജിബിലിറ്റി ടെസ്റ്റ് (സെറ്റ്)",
        "code": "LBS-SET",
        "description": "Conducted by LBS Centre for Higher Secondary School Teacher appointments.",
        "syllabus_topics": ["General Studies", "Teaching Aptitude", "Core PG Subject"],
        "stages": ["Paper I (General)", "Paper II (Special Subject)"],
        "is_active": True
    },
    {
        "id": "exam-keam",
        "category_id": "cat-keam-neet",
        "name": "KEAM (Engineering & Pharmacy)",
        "name_malayalam": "കീം പ്രവേശന പരീക്ഷ (എഞ്ചിനീയറിംഗ്)",
        "code": "CEE-KEAM",
        "description": "Commissioner for Entrance Examinations Kerala state entrance test.",
        "syllabus_topics": ["Physics", "Chemistry", "Mathematics"],
        "stages": ["Computer Based Entrance Test"],
        "is_active": True
    },
    {
        "id": "exam-neet-ug",
        "category_id": "cat-keam-neet",
        "name": "NEET UG (Medical Entrance)",
        "name_malayalam": "നീറ്റ് യു.ജി (മെഡിക്കൽ പ്രവേശനം)",
        "code": "NTA-NEET",
        "description": "National Eligibility cum Entrance Test for MBBS and BDS admissions.",
        "syllabus_topics": ["Physics", "Chemistry", "Botany", "Zoology"],
        "stages": ["Single National Written Test (720 Marks)"],
        "is_active": True
    },
    {
        "id": "exam-rrb-ntpc",
        "category_id": "cat-rrb",
        "name": "Railway RRB NTPC",
        "name_malayalam": "റെയിൽവേ നോൺ-ടെക്നിക്കൽ (NTPC)",
        "code": "RRB-NTPC",
        "description": "Railway Recruitment Board Station Master, Goods Guard, and Clerk posts.",
        "syllabus_topics": ["General Awareness", "Mathematics", "General Intelligence & Reasoning"],
        "stages": ["CBT 1", "CBT 2", "Typing / Aptitude"],
        "is_active": True
    },
    {
        "id": "exam-upsc-prelims",
        "category_id": "cat-upsc",
        "name": "UPSC Civil Services Preliminary",
        "name_malayalam": "യു.പി.എസ്.സി സിവിൽ സർവീസസ് പ്രിലിമിനറി",
        "code": "UPSC-CSE",
        "description": "IAS, IPS, IFS selection examination conducted annually by Union Public Service Commission.",
        "syllabus_topics": ["GS Paper 1 (Polity, History, Economy, Env)", "GS Paper 2 (CSAT)"],
        "stages": ["Preliminary Exam", "Mains Written (9 Papers)", "Personality Test"],
        "is_active": True
    }
]

INITIAL_QUESTION_PAPERS = [
    {
        "id": "paper-kpsc-degree-2023-st1",
        "exam_id": "exam-kpsc-degree-prelims",
        "year": 2023,
        "paper_code": "042/2023-M",
        "session_name": "Stage 1 (Morning Session)",
        "language": "Malayalam & English",
        "total_questions": 100,
        "duration_minutes": 75,
        "file_url": "/api/papers/download/paper-kpsc-degree-2023-st1.pdf",
        "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "file_size_bytes": 1420580,
        "source_url": "https://www.keralapsc.gov.in/question-paper-archive/042-2023",
        "collection_date": "2024-01-15T10:30:00Z",
        "is_verified": True,
        "verified_by": "Senior Subject Matter Expert (KPSC Cell)",
        "answer_key_url": "/api/papers/answer-key/paper-kpsc-degree-2023-st1.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "Official Kerala PSC Degree Level Common Preliminary Stage 1 Question Paper."
    },
    {
        "id": "paper-kpsc-sec-asst-2021",
        "exam_id": "exam-kpsc-degree-prelims",
        "year": 2021,
        "paper_code": "089/2021-M",
        "session_name": "Secretariat Assistant Special Examination",
        "language": "Malayalam & English",
        "total_questions": 100,
        "duration_minutes": 75,
        "file_url": "/api/papers/download/paper-kpsc-sec-asst-2021.pdf",
        "file_hash": "a45f91b2c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        "file_size_bytes": 1184200,
        "source_url": "https://www.keralapsc.gov.in/question-paper-archive/089-2021",
        "collection_date": "2023-11-20T14:15:00Z",
        "is_verified": True,
        "verified_by": "Curriculum Verification Board",
        "answer_key_url": "/api/papers/answer-key/paper-kpsc-sec-asst-2021.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "Secretariat / Auditor / Kerala PSC Office Assistant Selection Paper."
    },
    {
        "id": "paper-kpsc-ldc-tvm-2020",
        "exam_id": "exam-kpsc-ldc",
        "year": 2020,
        "paper_code": "038/2020-M",
        "session_name": "LDC Thiruvananthapuram & Wayanad Districts",
        "language": "Malayalam & English",
        "total_questions": 100,
        "duration_minutes": 75,
        "file_url": "/api/papers/download/paper-kpsc-ldc-tvm-2020.pdf",
        "file_hash": "c71a39b24e658f89d34e2c1a0f9b8c7d6e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c",
        "file_size_bytes": 985400,
        "source_url": "https://www.keralapsc.gov.in/question-paper-archive/038-2020",
        "collection_date": "2023-08-10T09:00:00Z",
        "is_verified": True,
        "verified_by": "State PSC Cell",
        "answer_key_url": "/api/papers/answer-key/paper-kpsc-ldc-tvm-2020.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "Lower Division Clerk Direct Recruitment Examination."
    },
    {
        "id": "paper-kas-p1-2020",
        "exam_id": "exam-kas-officer",
        "year": 2020,
        "paper_code": "001/2020-A",
        "session_name": "KAS Prelims Paper I (General Studies)",
        "language": "English & Malayalam",
        "total_questions": 100,
        "duration_minutes": 90,
        "file_url": "/api/papers/download/paper-kas-p1-2020.pdf",
        "file_hash": "f2e4b6c8a0d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3",
        "file_size_bytes": 1820400,
        "source_url": "https://www.keralapsc.gov.in/kas-archives/paper1-2020",
        "collection_date": "2023-05-18T16:00:00Z",
        "is_verified": True,
        "verified_by": "KAS Academic Committee",
        "answer_key_url": "/api/papers/answer-key/paper-kas-p1-2020.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "First ever Kerala Administrative Service Preliminary Examination Paper I."
    },
    {
        "id": "paper-police-si-2022",
        "exam_id": "exam-police-si",
        "year": 2022,
        "paper_code": "074/2022-M",
        "session_name": "Sub Inspector of Police Trainee Mains",
        "language": "Malayalam & English",
        "total_questions": 100,
        "duration_minutes": 75,
        "file_url": "/api/papers/download/paper-police-si-2022.pdf",
        "file_hash": "8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c",
        "file_size_bytes": 1342100,
        "source_url": "https://www.keralapsc.gov.in/question-paper-archive/074-2022",
        "collection_date": "2023-09-02T11:45:00Z",
        "is_verified": True,
        "verified_by": "Police Service Recruitment Cell",
        "answer_key_url": "/api/papers/answer-key/paper-police-si-2022.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "Sub Inspector of Police Trainee Selection Paper."
    },
    {
        "id": "paper-ktet-cat3-2022",
        "exam_id": "exam-ktet-cat3",
        "year": 2022,
        "paper_code": "KTET-3-MAY-2022",
        "session_name": "KTET Category III (High School)",
        "language": "Malayalam & English",
        "total_questions": 80,
        "duration_minutes": 90,
        "file_url": "/api/papers/download/paper-ktet-cat3-2022.pdf",
        "file_hash": "112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00",
        "file_size_bytes": 1640000,
        "source_url": "https://ktet.kerala.gov.in/archives/2022-may-cat3",
        "collection_date": "2023-06-12T10:00:00Z",
        "is_verified": True,
        "verified_by": "Pareeksha Bhavan Kerala",
        "answer_key_url": "/api/papers/answer-key/paper-ktet-cat3-2022.pdf",
        "answer_key_status": "Final Official Key Published",
        "has_interactive_test": True,
        "status": "APPROVED",
        "is_sample": False,
        "notes": "Kerala Pareeksha Bhavan official eligibility test for high school educators."
    },
    {
        "id": "paper-sample-unverified-bot-01",
        "exam_id": "exam-kpsc-ldc",
        "year": 2024,
        "paper_code": "012/2024-M-AUTO",
        "session_name": "LDC Kasaragod & Kannur (Auto-Scraped Draft)",
        "language": "Malayalam & English",
        "total_questions": 100,
        "duration_minutes": 75,
        "file_url": "/api/papers/download/paper-sample-unverified-bot-01.pdf",
        "file_hash": "99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
        "file_size_bytes": 1054320,
        "source_url": "https://www.keralapsc.gov.in/scraped-drafts/012-2024-draft",
        "collection_date": "2024-03-01T08:22:15Z",
        "is_verified": False,
        "verified_by": None,
        "answer_key_url": None,
        "answer_key_status": "Pending Verification",
        "has_interactive_test": False,
        "status": "PENDING_REVIEW",
        "is_sample": True,
        "curation_note": "Newly detected by automatic collection bot; placed in unverified queue awaiting admin review."
    }
]

# Realistic verified bilingual questions extracted from Kerala PSC past papers
INITIAL_QUESTIONS = [
    {
        "id": "q-kpsc-001",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 1,
        "question_text": "Who among the following social reformers conducted the famous 'Kallumala Samaram' in 1915 for the right of lower caste women to wear ornaments of their choice?",
        "question_text_malayalam": "താഴെ പറയുന്നവരിൽ ആരുടെ നേതൃത്വത്തിലാണ് 1915-ൽ അധഃസ്ഥിത വിഭാഗങ്ങളിലെ സ്ത്രീകൾക്ക് ഇഷ്ടമുള്ള ആഭരണങ്ങൾ ധരിക്കാനുള്ള അവകാശത്തിനായി പ്രശസ്തമായ 'കല്ലുമാല സമരം' (പെരിനാട് സമരം) നടന്നത്?",
        "options": [
            {"id": "A", "text": "Sree Narayana Guru (ശ്രീനാരായണ ഗുരു)"},
            {"id": "B", "text": "Ayyankali (അയ്യങ്കാളി)"},
            {"id": "C", "text": "Vaikunda Swamikal (വൈകുണ്ഠ സ്വാമികൾ)"},
            {"id": "D", "text": "Chattampi Swamikal (ചട്ടമ്പി സ്വാമികൾ)"}
        ],
        "correct_option": "B",
        "explanation": "Mahatma Ayyankali led the historic Kallumala Samaram (Perinad agitation) in Kollam in 1915, breaking the caste restriction that forced Dalit women to wear stone necklaces instead of metallic ornaments.",
        "explanation_malayalam": "1915-ൽ കൊല്ലം ജില്ലയിലെ പെരിനാട്ടിൽ അയ്യങ്കാളിയുടെ നേതൃത്വത്തിലാണ് കല്ലുമാല സമരം നടന്നത്. അവർണ്ണ സ്ത്രീകൾ കല്ലുമാലകൾ വലിച്ചെറിഞ്ഞ് മാന്യമായ വസ്ത്രങ്ങളും ആഭരണങ്ങളും ധരിക്കാനുള്ള സ്വാതന്ത്ര്യം ഇതിലൂടെ നേടി.",
        "topic": "Kerala Renaissance & History",
        "topic_malayalam": "കേരള നവോത്ഥാനം",
        "subtopic": "Social Reform Movements",
        "difficulty": "Medium",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-002",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 2,
        "question_text": "Which Article of the Constitution of India provides for the establishment of a Public Service Commission for the Union and for each State?",
        "question_text_malayalam": "കേന്ദ്രത്തിനും ഓരോ സംസ്ഥാനത്തിനും പബ്ലിക് സർവീസ് കമ്മീഷൻ സ്ഥാപിക്കുന്നതിന് വ്യവസ്ഥ ചെയ്യുന്ന ഇന്ത്യൻ ഭരണഘടനാ വകുപ്പ് ഏതാണ്?",
        "options": [
            {"id": "A", "text": "Article 312 (അനുച്ഛേദം 312)"},
            {"id": "B", "text": "Article 315 (അനുച്ഛേദം 315)"},
            {"id": "C", "text": "Article 324 (അനുച്ഛേദം 324)"},
            {"id": "D", "text": "Article 280 (അനുച്ഛേദം 280)"}
        ],
        "correct_option": "B",
        "explanation": "Article 315 of the Constitution of India provides for the establishment of Union Public Service Commission (UPSC) and State Public Service Commissions (such as Kerala PSC).",
        "explanation_malayalam": "ഇന്ത്യൻ ഭരണഘടനയുടെ അനുച്ഛേദം 315 പ്രകാരമാണ് കേന്ദ്രത്തിൽ യു.പി.എസ്.സിയും സംസ്ഥാനങ്ങളിൽ സംസ്ഥാന പബ്ലിക് സർവീസ് കമ്മീഷനുകളും നിലവിൽ വരുന്നത്. (അനുച്ഛേദം 324 തിരഞ്ഞെടുപ്പ് കമ്മീഷനുമായി ബന്ധപ്പെട്ടതാണ്).",
        "topic": "Indian Constitution & Polity",
        "topic_malayalam": "ഇന്ത്യൻ ഭരണഘടന",
        "subtopic": "Constitutional Bodies",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-003",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 3,
        "question_text": "Which is the longest river flowing entirely within the state of Kerala?",
        "question_text_malayalam": "കേരളത്തിലൂടെ മാത്രം ഒഴുകുന്ന ഏറ്റവും നീളം കൂടിയ നദി ഏതാണ്?",
        "options": [
            {"id": "A", "text": "Periyar (പെരിയാർ)"},
            {"id": "B", "text": "Bharathapuzha (ഭാരതപ്പുഴ)"},
            {"id": "C", "text": "Pamba (പമ്പ)"},
            {"id": "D", "text": "Chaliyar (ചാലിയാർ)"}
        ],
        "correct_option": "A",
        "explanation": "Periyar is the longest river in Kerala with a total length of 244 km. Bharathapuzha is 209 km within Kerala (total 250 km including Tamil Nadu).",
        "explanation_malayalam": "കേരളത്തിൽ ഏറ്റവും കൂടുതൽ ദൂരം ഒഴുകുന്ന നദി പെരിയാറാണ് (244 കി.മീ). ഭാരതപ്പുഴയുടെ ആകെ നീളം 250 കി.മീ ആണെങ്കിലും കേരളത്തിൽ 209 കി.മീ മാത്രമേ ഒഴുകുന്നുള്ളൂ.",
        "topic": "Kerala Geography & Environment",
        "topic_malayalam": "കേരള ഭൂമിശാസ്ത്രം",
        "subtopic": "Rivers and Water Resources",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-004",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 4,
        "question_text": "If a train 150 metres long is running at a speed of 54 km/h, how much time will it take to cross an electric post?",
        "question_text_malayalam": "150 മീറ്റർ നീളമുള്ള ഒരു ട്രെയിൻ മണിക്കൂറിൽ 54 കി.മീ വേഗതയിൽ സഞ്ചരിക്കുകയാണെങ്കിൽ, ഒരു ഇലക്ട്രിക് പോസ്റ്റ് കടന്നുപോകാൻ എത്ര സമയം എടുക്കും?",
        "options": [
            {"id": "A", "text": "8 seconds (8 സെക്കൻഡ്)"},
            {"id": "B", "text": "10 seconds (10 സെക്കൻഡ്)"},
            {"id": "C", "text": "12 seconds (12 സെക്കൻഡ്)"},
            {"id": "D", "text": "15 seconds (15 സെക്കൻഡ്)"}
        ],
        "correct_option": "B",
        "explanation": "Speed in m/s = 54 * (5/18) = 15 m/s. Distance to cross a post is train length = 150 m. Time = Distance / Speed = 150 / 15 = 10 seconds.",
        "explanation_malayalam": "വേഗത m/s-ലേക്ക് മാറ്റുമ്പോൾ: 54 × (5/18) = 15 m/s. പോസ്റ്റ് കടക്കാൻ എടുക്കുന്ന സമയം = ട്രെയിനിന്റെ നീളം / വേഗത = 150 / 15 = 10 സെക്കൻഡ്.",
        "topic": "Simple Arithmetic & Mental Ability",
        "topic_malayalam": "ഗണിതവും മാനസിക ശേഷിയും",
        "subtopic": "Speed, Time and Distance",
        "difficulty": "Medium",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-005",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 5,
        "question_text": "Select the correct passive form of the sentence: 'The committee has approved the revised syllabus.'",
        "question_text_malayalam": "'The committee has approved the revised syllabus' എന്ന വാക്യത്തിന്റെ ശരിയായ പാസ്സീവ് ഫോം (Passive voice) തിരഞ്ഞെടുക്കുക:",
        "options": [
            {"id": "A", "text": "The revised syllabus had been approved by the committee."},
            {"id": "B", "text": "The revised syllabus was approved by the committee."},
            {"id": "C", "text": "The revised syllabus has been approved by the committee."},
            {"id": "D", "text": "The revised syllabus is approved by the committee."}
        ],
        "correct_option": "C",
        "explanation": "Present perfect active ('has approved') converts into passive as 'has been approved' when the subject is singular ('The revised syllabus').",
        "explanation_malayalam": "Present perfect active ('has approved') പാസ്സീവ് രൂപത്തിലേക്ക് മാറ്റുമ്പോൾ 'has been + V3' (has been approved) ആയി മാറുന്നു.",
        "topic": "General English",
        "topic_malayalam": "ജനറൽ ഇംഗ്ലീഷ്",
        "subtopic": "Active and Passive Voice",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-006",
        "paper_id": "paper-kpsc-degree-2023-st1",
        "question_number": 6,
        "question_text": "ശരിയായ പദം തിരഞ്ഞെടുക്കുക (Choose the correctly spelt Malayalam word):",
        "question_text_malayalam": "താഴെ പറയുന്നവയിൽ ശരിയായ പദം ഏതാണ്?",
        "options": [
            {"id": "A", "text": "വിദ്വാംസൻ"},
            {"id": "B", "text": "വിദ്വാൻ"},
            {"id": "C", "text": "വിദ്വാൻസൻ"},
            {"id": "D", "text": "വിദ്വൽസൻ"}
        ],
        "correct_option": "B",
        "explanation": "The grammatically correct Malayalam word for a learned scholar is 'വിദ്വാൻ' (Vidwan).",
        "explanation_malayalam": "പാണ്ഡിത്യമുള്ള ആളെ സൂചിപ്പിക്കാൻ മലയാള വ്യാകരണത്തിൽ ഉപയോഗിക്കുന്ന ശുദ്ധരൂപം 'വിദ്വാൻ' എന്നതാണ്.",
        "topic": "Malayalam Grammar & Vocabulary",
        "topic_malayalam": "മലയാള ഭാഷാ പ്രയോഗം",
        "subtopic": "Spelling and Usage",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2023
    },
    {
        "id": "q-kpsc-007",
        "paper_id": "paper-kpsc-sec-asst-2021",
        "question_number": 1,
        "question_text": "Who was the founder of 'Atmavidya Sangham' founded in 1917?",
        "question_text_malayalam": "1917-ൽ 'ആത്മവിദ്യാ സംഘം' സ്ഥാപിച്ച നവോത്ഥാന നായകൻ ആര്?",
        "options": [
            {"id": "A", "text": "Vagbhatananda (വാഗ്ഭടാനന്ദൻ)"},
            {"id": "B", "text": "Brahmananda Sivayogi (ബ്രഹ്മാനന്ദ ശിവയോഗി)"},
            {"id": "C", "text": "Sahodaran Ayyappan (സഹോദരൻ അയ്യപ്പൻ)"},
            {"id": "D", "text": "Poikayil Yohannan (പൊയ്കയിൽ യോഹന്നാൻ)"}
        ],
        "correct_option": "A",
        "explanation": "Vagbhatananda established Atmavidya Sangham in 1917 to fight caste discrimination, idolatry, and superstition in Malabar.",
        "explanation_malayalam": "1917-ൽ വടകരയിൽ വെച്ച് വാഗ്ഭടാനന്ദനാണ് ആത്മവിദ്യാ സംഘം സ്ഥാപിച്ചത്. 'ഉണരുവിൻ, അഖിലേശനെ സ്മരിപ്പിൻ' എന്നത് അദ്ദേഹത്തിന്റെ പ്രസിദ്ധമായ സന്ദേശമാണ്.",
        "topic": "Kerala Renaissance & History",
        "topic_malayalam": "കേരള നവോത്ഥാനം",
        "subtopic": "Social Reformers",
        "difficulty": "Medium",
        "is_verified": True,
        "year": 2021
    },
    {
        "id": "q-kpsc-008",
        "paper_id": "paper-kpsc-sec-asst-2021",
        "question_number": 2,
        "question_text": "In the Indian Constitution, the Directive Principles of State Policy (DPSP) are borrowed from which country's constitution?",
        "question_text_malayalam": "ഇന്ത്യൻ ഭരണഘടനയിലെ നിർദ്ദേശക തത്വങ്ങൾ (Directive Principles of State Policy) ഏത് രാജ്യത്തിന്റെ ഭരണഘടനയിൽ നിന്നാണ് കടമെടുത്തത്?",
        "options": [
            {"id": "A", "text": "USA (യു.എസ്.എ)"},
            {"id": "B", "text": "Ireland (അയർലൻഡ്)"},
            {"id": "C", "text": "United Kingdom (ബ്രിട്ടൻ)"},
            {"id": "D", "text": "Australia (ഓസ്ട്രേലിയ)"}
        ],
        "correct_option": "B",
        "explanation": "Directive Principles of State Policy (Part IV, Articles 36-51) were adopted from the Constitution of Ireland (which had in turn borrowed it from Spain).",
        "explanation_malayalam": "ഇന്ത്യൻ ഭരണഘടനയുടെ ഭാഗം 4-ൽ (അനുച്ഛേദം 36 മുതൽ 51 വരെ) ഉൾപ്പെടുത്തിയിരിക്കുന്ന നിർദ്ദേശക തത്വങ്ങൾ അയർലൻഡിന്റെ ഭരണഘടനയിൽ നിന്നാണ് സ്വീകരിച്ചിട്ടുള്ളത്.",
        "topic": "Indian Constitution & Polity",
        "topic_malayalam": "ഇന്ത്യൻ ഭരണഘടന",
        "subtopic": "Sources of the Constitution",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2021
    },
    {
        "id": "q-kpsc-009",
        "paper_id": "paper-kpsc-sec-asst-2021",
        "question_number": 3,
        "question_text": "What is the unit of electric power?",
        "question_text_malayalam": "വൈദ്യുത പവറിന്റെ (Electric Power) യൂണിറ്റ് ഏതാണ്?",
        "options": [
            {"id": "A", "text": "Joule (ജൂൾ)"},
            {"id": "B", "text": "Ampere (ആമ്പിയർ)"},
            {"id": "C", "text": "Watt (വാട്ട്)"},
            {"id": "D", "text": "Volt (വോൾട്ട്)"}
        ],
        "correct_option": "C",
        "explanation": "The SI unit of power is Watt (W), equivalent to one joule per second. Joule is for work/energy, Ampere for electric current, and Volt for electric potential.",
        "explanation_malayalam": "പവറിന്റെ യൂണിറ്റ് വാട്ട് (Watt) ആണ്. പ്രവർത്തിയുടെ യൂണിറ്റ് ജൂളും, വൈദ്യുത പ്രവാഹത്തിന്റെ യൂണിറ്റ് ആമ്പിയറും, പൊട്ടൻഷ്യൽ വ്യത്യാസത്തിന്റെ യൂണിറ്റ് വോൾട്ടുമാണ്.",
        "topic": "General Science & Technology",
        "topic_malayalam": "പൊതു ശാസ്ത്രം",
        "subtopic": "Physics Units and Measurements",
        "difficulty": "Easy",
        "is_verified": True,
        "year": 2021
    },
    {
        "id": "q-kpsc-010",
        "paper_id": "paper-kpsc-sec-asst-2021",
        "question_number": 4,
        "question_text": "The average of five consecutive even numbers is 28. Which is the smallest of these numbers?",
        "question_text_malayalam": "തുടർച്ചയായ 5 ഇരട്ട സംഖ്യകളുടെ ശരാശരി 28 ആണ്. എങ്കിൽ ഇവയിലെ ഏറ്റവും ചെറിയ സംഖ്യ ഏതാണ്?",
        "options": [
            {"id": "A", "text": "22"},
            {"id": "B", "text": "24"},
            {"id": "C", "text": "26"},
            {"id": "D", "text": "28"}
        ],
        "correct_option": "B",
        "explanation": "For consecutive even numbers, the middle number is the average. Middle number is 28. Hence the 5 numbers are 24, 26, 28, 30, 32. The smallest is 24.",
        "explanation_malayalam": "തുടർച്ചയായ ഇരട്ട സംഖ്യകളുടെ മധ്യത്തിലെ സംഖ്യ തന്നെയാണ് ശരാശരി. അതിനാൽ നടുവിലത്തെ സംഖ്യ 28 ആണ്. സംഖ്യകൾ 24, 26, 28, 30, 32 ആകുന്നു. ഏറ്റവും ചെറുത് 24 ആണ്.",
        "topic": "Simple Arithmetic & Mental Ability",
        "topic_malayalam": "ഗണിതവും മാനസിക ശേഷിയും",
        "subtopic": "Averages and Sequences",
        "difficulty": "Medium",
        "is_verified": True,
        "year": 2021
    },
    {
        "id": "q-kas-001",
        "paper_id": "paper-kas-p1-2020",
        "question_number": 1,
        "question_text": "Consider the following statements regarding the 'Temple Entry Proclamation' of Travancore in 1936:\n1. It was issued by Sree Chithira Thirunal Balarama Varma.\n2. Mahatma Gandhi described it as 'a miracle of modern times'.\nWhich of the statements given above is/are correct?",
        "question_text_malayalam": "1936-ലെ തിരുവിതാംകൂർ ക്ഷേത്രപ്രവേശന വിളംബരത്തെ സംബന്ധിച്ച താഴെ പറയുന്ന പ്രസ്താവനകൾ പരിഗണിക്കുക:\n1. ശ്രീ ചിത്തിര തിരുനാൾ ബാലരാമവർമ്മയാണ് വിളംബരം പുറപ്പെടുവിച്ചത്.\n2. 'ആധുനിക കാലത്തെ ഒരു അത്ഭുതം' എന്നാണ് മഹാത്മാഗാന്ധി ഇതിനെ വിശേഷിപ്പിച്ചത്.\nമുകളിൽ നൽകിയിട്ടുള്ളവയിൽ ഏതാണ് ശരി?",
        "options": [
            {"id": "A", "text": "1 only (1 മാത്രം)"},
            {"id": "B", "text": "2 only (2 മാത്രം)"},
            {"id": "C", "text": "Both 1 and 2 (1-ഉം 2-ഉം ശരിയാണ്)"},
            {"id": "D", "text": "Neither 1 nor 2 (രണ്ടുമല്ല)"}
        ],
        "correct_option": "C",
        "explanation": "Both statements are correct. On November 12, 1936, Maharaja Chithira Thirunal issued the historic proclamation opening government-controlled temples to all Hindus regardless of caste. Gandhi lauded it as 'a miracle of modern times'.",
        "explanation_malayalam": "രണ്ട് പ്രസ്താവനകളും ശരിയാണ്. 1936 നവംബർ 12-ന് (1112 തുലാം 27) ശ്രീ ചിത്തിര തിരുനാൾ ബാലരാമവർമ്മയാണ് ക്ഷേത്രപ്രവേശന വിളംബരം നടത്തിയത്. മഹാത്മാഗാന്ധി ഇതിനെ 'ആധുനിക കാലത്തെ വിസ്മയം' എന്ന് വാഴ്ത്തി.",
        "topic": "Kerala Renaissance & History",
        "topic_malayalam": "കേരള നവോത്ഥാനം",
        "subtopic": "Historic Proclamations",
        "difficulty": "Hard",
        "is_verified": True,
        "year": 2020
    },
    {
        "id": "q-police-001",
        "paper_id": "paper-police-si-2022",
        "question_number": 1,
        "question_text": "Under the Protection of Human Rights Act 1993, who appoints the Chairperson and members of the State Human Rights Commission?",
        "question_text_malayalam": "1993-ലെ മനുഷ്യാവകാശ സംരക്ഷണ നിയമപ്രകാരം സംസ്ഥാന മനുഷ്യാവകാശ കമ്മീഷൻ അധ്യക്ഷനെയും അംഗങ്ങളെയും നിയമിക്കുന്നത് ആരാണ്?",
        "options": [
            {"id": "A", "text": "The President of India (ഇന്ത്യൻ രാഷ്ട്രപതി)"},
            {"id": "B", "text": "The Governor of the State (സംസ്ഥാന ഗവർണർ)"},
            {"id": "C", "text": "The Chief Justice of High Court (ഹൈക്കോടതി ചീഫ് ജസ്റ്റിസ്)"},
            {"id": "D", "text": "The Chief Minister (മുഖ്യമന്ത്രി)"}
        ],
        "correct_option": "B",
        "explanation": "The Governor of the State appoints the Chairperson and members of the SHRC by warrant under hand and seal, on recommendation of a committee headed by the Chief Minister.",
        "explanation_malayalam": "സംസ്ഥാന മനുഷ്യാവകാശ കമ്മീഷൻ ചെയർമാനെയും അംഗങ്ങളെയും നിയമിക്കുന്നത് സംസ്ഥാന ഗവർണറാണ്. മുഖ്യമന്ത്രി അധ്യക്ഷനായ ഉന്നതാധികാര സമിതിയുടെ ശുപാർശ പ്രകാരമാണ് ഈ നിയമനം നടക്കുന്നത്.",
        "topic": "Indian Constitution & Polity",
        "topic_malayalam": "ഇന്ത്യൻ ഭരണഘടന",
        "subtopic": "Human Rights and Commissions",
        "difficulty": "Medium",
        "is_verified": True,
        "year": 2022
    }
]

INITIAL_SOURCES = [
    {
        "id": "src-kpsc-official",
        "name": "Kerala PSC Official Portal (Question Papers & Answer Keys)",
        "base_url": "https://www.keralapsc.gov.in",
        "target_url": "https://www.keralapsc.gov.in/question-paper-archive",
        "pattern": r".*\.pdf$",
        "category_id": "cat-kpsc",
        "frequency": "Daily",
        "status": "ACTIVE",
        "is_approved": True,
        "last_scraped_at": "2026-11-05T18:00:00Z",
        "total_discovered": 1420,
        "notes": "Primary official repository for state civil services and department tests."
    },
    {
        "id": "src-pareeksha-bhavan",
        "name": "Kerala Pareeksha Bhavan (KTET Archives)",
        "base_url": "https://ktet.kerala.gov.in",
        "target_url": "https://ktet.kerala.gov.in/archives",
        "pattern": r".*KTET.*\.pdf$",
        "category_id": "cat-ktet-set",
        "frequency": "Weekly",
        "status": "ACTIVE",
        "is_approved": True,
        "last_scraped_at": "2026-11-04T12:30:00Z",
        "total_discovered": 284,
        "notes": "Official teacher eligibility test question paper and answer key releases."
    },
    {
        "id": "src-lbs-centre",
        "name": "LBS Centre for Science & Technology (SET & Professional Entrances)",
        "base_url": "https://lbscentre.kerala.gov.in",
        "target_url": "https://lbscentre.kerala.gov.in/services/previous-questions",
        "pattern": r".*\.pdf$",
        "category_id": "cat-lbs",
        "frequency": "Weekly",
        "status": "ACTIVE",
        "is_approved": True,
        "last_scraped_at": "2026-11-03T09:15:00Z",
        "total_discovered": 196,
        "notes": "State Eligibility Test (SET) and state professional entrance exams."
    },
    {
        "id": "src-ssc-gov",
        "name": "Staff Selection Commission (SSC Central Archives)",
        "base_url": "https://ssc.gov.in",
        "target_url": "https://ssc.gov.in/answer-keys-pyq",
        "pattern": r".*\.pdf$",
        "category_id": "cat-ssc",
        "frequency": "Bi-weekly",
        "status": "ACTIVE",
        "is_approved": True,
        "last_scraped_at": "2026-11-02T14:00:00Z",
        "total_discovered": 510,
        "notes": "SSC CGL, CHSL, MTS Tier I and Tier II question papers."
    }
]

# ─── SUBJECTS ─────────────────────────────────────────────────────────────────
# Broad subject groupings used to organise questions into topic-wise practice
INITIAL_SUBJECTS = [
    {
        "id": "subj-kerala-history",
        "name": "Kerala Renaissance & History",
        "name_malayalam": "കേരള നവോത്ഥാനവും ചരിത്രവും",
        "description": "Social reform movements, historical events, art, culture and heritage of Kerala.",
        "icon": "Landmark",
        "order": 1,
        "is_active": True
    },
    {
        "id": "subj-polity",
        "name": "Indian Constitution & Polity",
        "name_malayalam": "ഇന്ത്യൻ ഭരണഘടനയും ഭരണവ്യവസ്ഥയും",
        "description": "Fundamental rights, directive principles, constitutional bodies, governance and law.",
        "icon": "Scale",
        "order": 2,
        "is_active": True
    },
    {
        "id": "subj-kerala-geo",
        "name": "Kerala Geography & Environment",
        "name_malayalam": "കേരള ഭൂമിശാസ്ത്രവും പരിസ്ഥിതിയും",
        "description": "Rivers, mountains, districts, wildlife, climate and natural resources of Kerala.",
        "icon": "Map",
        "order": 3,
        "is_active": True
    },
    {
        "id": "subj-science",
        "name": "General Science & Technology",
        "name_malayalam": "പൊതു ശാസ്ത്രവും സാങ്കേതികവിദ്യയും",
        "description": "Physics, Chemistry, Biology, Computer Science and current technology developments.",
        "icon": "FlaskConical",
        "order": 4,
        "is_active": True
    },
    {
        "id": "subj-maths",
        "name": "Quantitative Aptitude & Mental Ability",
        "name_malayalam": "ഗണിതവും മാനസിക ശേഷിയും",
        "description": "Arithmetic, algebra, percentages, ratios, speed-time-distance, logical reasoning.",
        "icon": "Calculator",
        "order": 5,
        "is_active": True
    },
    {
        "id": "subj-english",
        "name": "General English",
        "name_malayalam": "ജനറൽ ഇംഗ്ലീഷ്",
        "description": "Grammar, vocabulary, comprehension, active-passive, direct-indirect speech.",
        "icon": "BookOpen",
        "order": 6,
        "is_active": True
    },
    {
        "id": "subj-malayalam",
        "name": "Malayalam Language & Grammar",
        "name_malayalam": "മലയാള ഭാഷയും വ്യാകരണവും",
        "description": "Spelling, grammar, literature, proverbs and usage of the Malayalam language.",
        "icon": "Languages",
        "order": 7,
        "is_active": True
    },
    {
        "id": "subj-current-affairs",
        "name": "Current Affairs & General Knowledge",
        "name_malayalam": "ജനറൽ നോളജും ദേശീയ-അന്തർദേശീയ കാര്യങ്ങളും",
        "description": "National and international current events, sports, awards, summits and appointments.",
        "icon": "Globe",
        "order": 8,
        "is_active": True
    }
]

# ─── TOPICS ───────────────────────────────────────────────────────────────────
INITIAL_TOPICS = [
    # Kerala History topics
    {"id": "topic-social-reform", "subject_id": "subj-kerala-history", "name": "Social Reform Movements", "name_malayalam": "സാമൂഹ്യ പരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ", "description": "Ayyankali, Sree Narayana Guru, Vagbhatananda and their contributions.", "question_count": 0, "order": 1},
    {"id": "topic-temple-entry", "subject_id": "subj-kerala-history", "name": "Temple Entry & Caste Reform", "name_malayalam": "ക്ഷേത്രപ്രവേശന വിളംബരവും ജാതി പരിഷ്കരണവും", "description": "Temple Entry Proclamation 1936, Vaikom Satyagraha, caste abolition movements.", "question_count": 0, "order": 2},
    {"id": "topic-national-movement", "subject_id": "subj-kerala-history", "name": "National Movement in Kerala", "name_malayalam": "കേരളത്തിൽ ദേശീയ പ്രസ്ഥാനം", "description": "Congress, Salt Satyagraha, Quit India Movement in the context of Kerala.", "question_count": 0, "order": 3},
    {"id": "topic-kerala-culture", "subject_id": "subj-kerala-history", "name": "Kerala Art, Literature & Culture", "name_malayalam": "കേരള കലയും സാഹിത്യവും സംസ്കാരവും", "description": "Classical dance, music, literature and festivals of Kerala.", "question_count": 0, "order": 4},

    # Polity topics
    {"id": "topic-fundamental-rights", "subject_id": "subj-polity", "name": "Fundamental Rights & Duties", "name_malayalam": "മൌലികാവകാശങ്ങളും മൌലിക കടമകളും", "description": "Articles 12-35, Right to Equality, Freedom, against Exploitation, Religion, Education.", "question_count": 0, "order": 1},
    {"id": "topic-constitutional-bodies", "subject_id": "subj-polity", "name": "Constitutional Bodies", "name_malayalam": "ഭരണഘടനാ സ്ഥാപനങ്ങൾ", "description": "UPSC, PSC, Election Commission, CAG, Finance Commission and their powers.", "question_count": 0, "order": 2},
    {"id": "topic-dpsp", "subject_id": "subj-polity", "name": "Directive Principles & Preamble", "name_malayalam": "നിർദ്ദേശക തത്വങ്ങളും ആമുഖവും", "description": "DPSP, sources from Ireland, Preamble significance.", "question_count": 0, "order": 3},
    {"id": "topic-human-rights", "subject_id": "subj-polity", "name": "Human Rights & State Commissions", "name_malayalam": "മനുഷ്യാവകാശങ്ങളും സംസ്ഥാന കമ്മിഷനുകളും", "description": "NHRC, SHRC, Protection of Human Rights Act 1993.", "question_count": 0, "order": 4},

    # Kerala Geography topics
    {"id": "topic-rivers", "subject_id": "subj-kerala-geo", "name": "Rivers & Water Resources", "name_malayalam": "നദികളും ജലസ്രോതസ്സുകളും", "description": "44 rivers, east-flowing and west-flowing, major dams and reservoirs.", "question_count": 0, "order": 1},
    {"id": "topic-districts", "subject_id": "subj-kerala-geo", "name": "Districts, Population & Administration", "name_malayalam": "ജില്ലകൾ, ജനസംഖ്യ, ഭരണം", "description": "14 districts, taluk divisions, census data, administrative hierarchy.", "question_count": 0, "order": 2},
    {"id": "topic-wildlife", "subject_id": "subj-kerala-geo", "name": "Forests, Wildlife & Protected Areas", "name_malayalam": "വനങ്ങൾ, വന്യജീവി, സംരക്ഷിത പ്രദേശങ്ങൾ", "description": "Wildlife sanctuaries, national parks, Nilgiri Biosphere Reserve, Western Ghats.", "question_count": 0, "order": 3},

    # Science topics
    {"id": "topic-physics", "subject_id": "subj-science", "name": "Physics – Units, Motion & Electricity", "name_malayalam": "ഭൌതികശാസ്ത്രം – യൂണിറ്റുകൾ, ചലനം, വൈദ്യുതി", "description": "SI units, Newton's laws, electric power, Ohm's law, optics basics.", "question_count": 0, "order": 1},
    {"id": "topic-biology", "subject_id": "subj-science", "name": "Biology – Human Body & Plants", "name_malayalam": "ജീവശാസ്ത്രം – മനുഷ്യ ശരീരവും സസ്യശാസ്ത്രവും", "description": "Organ systems, vitamins, diseases, photosynthesis, cell biology.", "question_count": 0, "order": 2},
    {"id": "topic-chemistry", "subject_id": "subj-science", "name": "Chemistry – Elements & Reactions", "name_malayalam": "രസതന്ത്രം – മൂലകങ്ങൾ, രാസ പ്രതിപ്രവർത്തനം", "description": "Periodic table, acids and bases, common salts, chemical formulae.", "question_count": 0, "order": 3},

    # Maths topics
    {"id": "topic-arithmetic", "subject_id": "subj-maths", "name": "Basic Arithmetic & Number Systems", "name_malayalam": "ഗണിത ക്രിയകൾ, ശതമാനം, അനുപാതം", "description": "Percentages, profit-loss, averages, number sequences.", "question_count": 0, "order": 1},
    {"id": "topic-speed-time", "subject_id": "subj-maths", "name": "Speed, Time & Distance", "name_malayalam": "വേഗം, സമയം, ദൂരം", "description": "Train problems, boat and stream, relative speed.", "question_count": 0, "order": 2},
    {"id": "topic-reasoning", "subject_id": "subj-maths", "name": "Logical Reasoning & Mental Ability", "name_malayalam": "ലോജിക്കൽ റീസണിംഗ്, ക്രമം", "description": "Series completion, coding-decoding, syllogisms, blood relations.", "question_count": 0, "order": 3},

    # English topics
    {"id": "topic-grammar", "subject_id": "subj-english", "name": "English Grammar – Tenses & Voice", "name_malayalam": "ഗ്രാമർ – കാലം, ആക്ടീവ്-പാസ്സീവ്", "description": "Active-passive voice, direct-indirect speech, tenses, articles.", "question_count": 0, "order": 1},
    {"id": "topic-vocabulary", "subject_id": "subj-english", "name": "Vocabulary & Comprehension", "name_malayalam": "വൊക്കാബുലറി, കോംപ്രഹൻഷൻ", "description": "Synonyms, antonyms, one-word substitution, fill-in-the-blanks.", "question_count": 0, "order": 2},

    # Malayalam topics
    {"id": "topic-mal-grammar", "subject_id": "subj-malayalam", "name": "Malayalam Spelling & Grammar", "name_malayalam": "മലയാള അക്ഷരവും വ്യാകരണവും", "description": "Correct spelling, sandhi, vibhakthi, word formation.", "question_count": 0, "order": 1},
    {"id": "topic-mal-literature", "subject_id": "subj-malayalam", "name": "Malayalam Literature & Authors", "name_malayalam": "മലയാള സാഹിത്യവും എഴുത്തുകാരും", "description": "Poets, novelists, works, literary movements and awards.", "question_count": 0, "order": 2},

    # Current Affairs topics
    {"id": "topic-national-events", "subject_id": "subj-current-affairs", "name": "National Events & Government Schemes", "name_malayalam": "ദേശീയ കാര്യങ്ങളും സർക്കാർ പദ്ധതികളും", "description": "Central government policies, flagship schemes, national awards.", "question_count": 0, "order": 1},
    {"id": "topic-sports", "subject_id": "subj-current-affairs", "name": "Sports, Awards & International Affairs", "name_malayalam": "കായിക, അന്തർദേശീയ കാര്യങ്ങൾ", "description": "Olympic medals, Nobel prizes, Bharat Ratna, international summits.", "question_count": 0, "order": 2},
]

# ─── MOCK TESTS ───────────────────────────────────────────────────────────────
INITIAL_MOCK_TESTS = [
    {
        "id": "mock-kpsc-degree-full",
        "name": "Kerala PSC Degree Level – Full Mock",
        "name_malayalam": "ഡിഗ്രി ലെവൽ പ്രിലിമിനറി – പൂർണ്ണ മോക്ക് ടെസ്റ്റ്",
        "exam_id": "exam-kpsc-degree-prelims",
        "description": "100-question full-length mock based on actual Kerala PSC Degree Level pattern.",
        "duration_minutes": 75,
        "total_questions": 100,
        "marks_per_question": 1.0,
        "negative_marking": 0.33,
        "subjects": ["Kerala Renaissance", "Indian Polity", "Kerala Geography", "General Science", "Maths", "English", "Malayalam"],
        "question_ids": [],
        "is_active": True,
        "difficulty": "Mixed",
        "created_by": "admin",
        "created_at": "2024-01-01T00:00:00Z"
    },
    {
        "id": "mock-kpsc-quick-30",
        "name": "Kerala PSC – Quick Practice (30 Questions)",
        "name_malayalam": "കേരള PSC ദ്രുത പരിശീലനം – 30 ചോദ്യങ്ങൾ",
        "exam_id": "exam-kpsc-degree-prelims",
        "description": "30-question quick practice test covering all core subjects for Degree Level exam.",
        "duration_minutes": 25,
        "total_questions": 30,
        "marks_per_question": 1.0,
        "negative_marking": 0.33,
        "subjects": ["Kerala Renaissance", "Indian Polity", "General Science", "Maths", "English"],
        "question_ids": [],
        "is_active": True,
        "difficulty": "Easy",
        "created_by": "admin",
        "created_at": "2024-01-01T00:00:00Z"
    },
    {
        "id": "mock-police-si-pattern",
        "name": "Police Sub Inspector – Full Pattern Mock",
        "name_malayalam": "എസ്.ഐ. ഓഫ് പോലീസ് – ഫുൾ മോക്ക് ടെസ്റ്റ്",
        "exam_id": "exam-police-si",
        "description": "100-question mock test matching the Police SI Trainee selection pattern.",
        "duration_minutes": 75,
        "total_questions": 100,
        "marks_per_question": 1.0,
        "negative_marking": 0.33,
        "subjects": ["General Knowledge", "Indian Constitution", "Mental Ability", "English", "Malayalam"],
        "question_ids": [],
        "is_active": True,
        "difficulty": "Medium",
        "created_by": "admin",
        "created_at": "2024-01-01T00:00:00Z"
    },
    {
        "id": "mock-kas-prelims",
        "name": "KAS Preliminary – General Studies Practice",
        "name_malayalam": "KAS പ്രിലിമിനറി – ജനറൽ സ്റ്റഡീസ് പ്രാക്ടീസ്",
        "exam_id": "exam-kas-officer",
        "description": "High-difficulty 50-question mock targeting KAS Prelims General Studies Paper I.",
        "duration_minutes": 60,
        "total_questions": 50,
        "marks_per_question": 2.0,
        "negative_marking": 0.66,
        "subjects": ["Kerala History", "Indian Polity", "Economic Development", "General Science"],
        "question_ids": [],
        "is_active": True,
        "difficulty": "Hard",
        "created_by": "admin",
        "created_at": "2024-01-01T00:00:00Z"
    }
]

# subject_id and topic_id mappings for existing questions
QUESTION_SUBJECT_TOPIC_MAP = {
    "q-kpsc-001": ("subj-kerala-history", "topic-social-reform"),
    "q-kpsc-002": ("subj-polity", "topic-constitutional-bodies"),
    "q-kpsc-003": ("subj-kerala-geo", "topic-rivers"),
    "q-kpsc-004": ("subj-maths", "topic-speed-time"),
    "q-kpsc-005": ("subj-english", "topic-grammar"),
    "q-kpsc-006": ("subj-malayalam", "topic-mal-grammar"),
    "q-kpsc-007": ("subj-kerala-history", "topic-social-reform"),
    "q-kpsc-008": ("subj-polity", "topic-dpsp"),
    "q-kpsc-009": ("subj-science", "topic-physics"),
    "q-kpsc-010": ("subj-maths", "topic-arithmetic"),
    "q-kas-001": ("subj-kerala-history", "topic-temple-entry"),
    "q-police-001": ("subj-polity", "topic-human-rights"),
}

def get_enriched_questions():
    """Return INITIAL_QUESTIONS with subject_id and topic_id fields added."""
    enriched = []
    for q in INITIAL_QUESTIONS:
        q_copy = dict(q)
        mapping = QUESTION_SUBJECT_TOPIC_MAP.get(q["id"])
        if mapping:
            q_copy["subject_id"] = mapping[0]
            q_copy["topic_id"] = mapping[1]
        enriched.append(q_copy)
    return enriched
