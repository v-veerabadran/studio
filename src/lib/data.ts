

export type Hospital = {
    id: number;
    name: string;
    location: string;
    rating: number;
    price: number;
    specialty: string;
    emergency: boolean;
    imageUrl: string;
    imageHint: string;
    pros: string[];
    cons:string[];
};

export type Doctor = {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    rating: number;
    experience: number;
    boardCertified: boolean;
    imageUrl: string;
    imageHint: string;
    pros: string[];
    cons: string[];
}

export const hospitalData = {
    cardiology: [
        { id: 1, name: "City Heart Institute", location: "Metropolis", rating: 4.8, price: 28000, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital1/600/400", imageHint: "hospital building", pros: ["Top-rated cardiac unit", "Latest technology"], cons: ["Can be expensive", "Long wait times"] },
        { id: 2, name: "St. Jude's Cardiac Center", location: "Metropolis", rating: 4.5, price: 25000, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital2/600/400", imageHint: "modern hospital", pros: ["Renowned specialists", "Accepts most insurance"], cons: ["Older facility"] },
        { id: 3, name: "General Hospital - Cardiology", location: "Metropolis", rating: 4.2, price: 19000, specialty: "Cardiology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital3/600/400", imageHint: "hospital exterior", pros: ["Affordable care", "Good for routine check-ups"], cons: ["No emergency services", "Limited specialist availability"] },
    ],
    pulmonology: [
        { id: 4, name: "Breathe Easy Clinic", location: "Metropolis", rating: 4.9, price: 22000, specialty: "Pulmonology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital4/600/400", imageHint: "clinic building", pros: ["Highly specialized care", "Excellent patient reviews"], cons: ["Limited operating hours"] },
        { id: 5, name: "Metropolis Lung Center", location: "Metropolis", rating: 4.6, price: 18000, specialty: "Pulmonology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital5/600/400", imageHint: "large hospital", pros: ["24/7 emergency care", "In-house diagnostics"], cons: ["Located downtown, heavy traffic"] },
    ],
    nephrology: [
        { id: 6, name: "Kidney Care Associates", location: "Metropolis", rating: 4.7, price: 32000, specialty: "Nephrology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital6/600/400", imageHint: "medical building", pros: ["Focus on chronic kidney disease", "Holistic approach"], cons: ["By referral only"] },
        { id: 7, name: "St. Jude's Renal Unit", location: "Metropolis", rating: 4.4, price: 29000, specialty: "Nephrology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital7/600/400", imageHint: "hospital entrance", pros: ["Advanced dialysis services", "Tied to a major hospital"], cons: ["Can feel impersonal"] },
    ],
    neurology: [
        { id: 8, name: "Metro Neurosciences", location: "Metropolis", rating: 4.8, price: 45000, specialty: "Neurology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital8/600/400", imageHint: "modern clinic", pros: ["Comprehensive stroke center", "Research-driven"], cons: ["High demand for specialists"] },
        { id: 9, name: "Brain & Spine Center", location: "Uptown", rating: 4.6, price: 41000, specialty: "Neurology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital9/600/400", imageHint: "specialty hospital", pros: ["Specializes in spine disorders", "Integrative therapies"], cons: ["Limited insurance network"] },
    ],
    dermatology: [
        { id: 10, name: "The Skin Institute", location: "Downtown", rating: 4.9, price: 5000, specialty: "Dermatology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital10/600/400", imageHint: "modern building", pros: ["Cosmetic & medical services", "State-of-the-art equipment"], cons: ["Mostly private pay"] },
    ],
    orthopedics: [
        { id: 11, name: "Joint & Bone Clinic", location: "Suburbia", rating: 4.7, price: 12000, specialty: "Orthopedics", emergency: true, imageUrl: "https://picsum.photos/seed/hospital11/600/400", imageHint: "clinic exterior", pros: ["Top sports medicine docs", "On-site physical therapy"], cons: ["Busy on weekends"] },
    ],
    dentistry: [
        { id: 12, name: "Bright Smile Dental", location: "City Center", rating: 4.9, price: 2000, specialty: "Dentistry", emergency: true, imageUrl: "https://picsum.photos/seed/hospital12/600/400", imageHint: "dental office", pros: ["Family & cosmetic dentistry", "Open on Saturdays"], cons: ["Can be noisy"] },
    ]
}

export const doctorData = {
    cardiology: [
        { id: 1, name: "Dr. Evelyn Reed", specialty: "Cardiology", hospital: "City Heart Institute", rating: 4.9, experience: 15, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc1/400/400", imageHint: "female doctor", pros: ["Leader in the field", "Great bedside manner"], cons: ["Difficult to get an appointment"] },
        { id: 2, name: "Dr. Marcus Thorne", specialty: "Cardiology", hospital: "St. Jude's Cardiac Center", rating: 4.7, experience: 12, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc2/400/400", imageHint: "male doctor", pros: ["Expert in surgical procedures", "Very thorough"], cons: ["Can be blunt"] },
    ],
    pulmonology: [
        { id: 3, name: "Dr. Sofia Rossi", specialty: "Pulmonology", hospital: "Breathe Easy Clinic", rating: 4.8, experience: 10, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc3/400/400", imageHint: "woman doctor", pros: ["Specializes in asthma", "Listens to patients"], cons: ["Books up fast"] },
    ],
    nephrology: [
         { id: 4, name: "Dr. Kenji Tanaka", specialty: "Nephrology", hospital: "Kidney Care Associates", rating: 4.6, experience: 18, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc4/400/400", imageHint: "asian doctor", pros: ["Vast experience", "Focus on patient education"], cons: ["Clinic has limited parking"] },
    ],
    neurology: [
        { id: 5, name: "Dr. Alistair Finch", specialty: "Neurology", hospital: "Metro Neurosciences", rating: 4.8, experience: 20, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc5/400/400", imageHint: "senior doctor", pros: ["Expert in epilepsy", "Calm and reassuring"], cons: ["Long waiting list"] },
    ],
    dermatology: [
        { id: 6, name: "Dr. Chloe Bennett", specialty: "Dermatology", hospital: "The Skin Institute", rating: 4.9, experience: 8, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc6/400/400", imageHint: "professional woman", pros: ["Excellent cosmetic results", "Friendly and approachable"], cons: ["High consultation fee"] },
    ],
    orthopedics: [
        { id: 7, name: "Dr. Liam Gallagher", specialty: "Orthopedics", hospital: "Joint & Bone Clinic", rating: 4.7, experience: 14, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc7/400/400", imageHint: "friendly man", pros: ["Top knee surgeon", "Works with athletes"], cons: ["Surgical-first approach"] },
    ],
    dentistry: [
        { id: 8, name: "Dr. Isabella Chen", specialty: "Dentistry", hospital: "Bright Smile Dental", rating: 4.9, experience: 11, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc8/400/400", imageHint: "smiling woman", pros: ["Painless procedures", "Great with kids"], cons: ["Limited evening appointments"] },
    ]
};

export const allDoctors: Doctor[] = Object.values(doctorData).flat();
export const allHospitals: Hospital[] = Object.values(hospitalData).flat();

export type MedicalPackage = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    price: string;
    features: string[];
    inclusions: { item: string; details: string }[];
    itinerary: { day: string; activity: string }[];
    hospital: Hospital;
    surgeon: Doctor;
}

export const packages: MedicalPackage[] = [
  {
    id: 1,
    title: 'Diamond Package',
    description: 'The ultimate, all-inclusive experience with unparalleled luxury and personal care in cardiac surgery.',
    imageUrl: 'https://picsum.photos/seed/luxury-suite/600/400',
    imageHint: 'luxury hospital suite',
    price: '$25,000',
    features: [
      'VIP hospital suite',
      'Dedicated 24/7 personal concierge',
      'Chauffeur-driven luxury car',
      'Gourmet dining',
      'Exclusive wellness retreat access'
    ],
    inclusions: [
        { item: "Surgery", details: "Coronary Artery Bypass Grafting (CABG) or Valve Replacement" },
        { item: "Hospital Stay", details: "7-day stay in a private, air-conditioned room" },
        { item: "Coordinator", details: "Dedicated care coordinator available 24/7" },
        { item: "Transport", details: "Airport pickup/drop-off and all hospital transfers" },
        { item: "Meals", details: "All meals for the patient as per dietary plan" }
    ],
    itinerary: [
        { day: "1-2", activity: "Arrival, consultation with surgeon, and pre-operative tests." },
        { day: "3", activity: "Surgery day." },
        { day: "4-7", activity: "Post-operative ICU and hospital room recovery." },
        { day: "8-10", activity: "Recovery at hotel with follow-up consultation." },
        { day: "11", activity: "Departure." },
    ],
    hospital: hospitalData.cardiology[0],
    surgeon: doctorData.cardiology[0],
  },
  {
    id: 2,
    title: 'Platinum Package',
    description: 'A premium package offering superior comfort and comprehensive orthopedic services.',
    imageUrl: 'https://picsum.photos/seed/private-room/600/400',
    imageHint: 'modern private hospital',
    price: '$18,000',
    features: [
      'Private hospital room',
      'Personal care coordinator',
      'Airport & local transfers',
      'Post-operative therapy sessions'
    ],
     inclusions: [
        { item: "Surgery", details: "Total Knee or Hip Replacement with top-tier implants" },
        { item: "Hospital Stay", details: "5-day stay in a specialized orthopedic suite" },
        { item: "Physiotherapy", details: "10 sessions of personalized post-op physiotherapy" },
        { item: "Transport", details: "Airport pickup/drop-off and all hospital transfers" },
        { item: "Accommodation", details: "5-night hotel stay for post-discharge recovery" }
    ],
    itinerary: [
        { day: "1", activity: "Arrival and consultation with orthopedic surgeon." },
        { day: "2", activity: "Surgery day." },
        { day: "3-5", activity: "In-patient recovery and start of physiotherapy." },
        { day: "6-10", activity: "Continued physiotherapy and recovery at hotel." },
        { day: "11", activity: "Final check-up and departure." },
    ],
    hospital: hospitalData.orthopedics[0],
    surgeon: doctorData.orthopedics[0],
  },
  {
    id: 3,
    title: 'Gold Package',
    description: 'Our most popular package, balancing excellent neurological care with great value.',
    imageUrl: 'https://picsum.photos/seed/modern-clinic/600/400',
    imageHint: 'modern clinic',
    price: '$12,000',
    features: [
      'Semi-private hospital room',
      'Shared care coordinator',
      'Scheduled shuttle services',
      'Standard post-operative care'
    ],
     inclusions: [
        { item: "Health Check", details: "Full-body preventive health screening and diagnostics" },
        { item: "Wellness Therapies", details: "Daily personalized Ayurveda and Yoga sessions" },
        { item: "Accommodation", details: "7-night stay in a luxury wellness resort with all amenities" },
        { item: "Meals", details: "All gourmet wellness meals and detox juices included" },
        { item: "Activities", details: "Guided meditation, nature walks, and wellness workshops" }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, wellness consultation, and relaxation." },
        { day: "2-6", activity: "Daily Yoga, Ayurveda therapies, and wellness activities." },
        { day: "7", activity: "Final health review and departure planning." },
    ],
    hospital: hospitalData.neurology[0],
    surgeon: doctorData.neurology[0]
  },
  {
    id: 4,
    title: 'Silver Package',
    description: 'An essential care package covering all fundamental dermatology and travel needs.',
    imageUrl: 'https://picsum.photos/seed/hospital-ward/600/400',
    imageHint: 'clean hospital ward',
    price: '$8,000',
    features: [
      'General ward accommodation',
      'On-call support staff',
      'Basic travel assistance',
      'Essential medical care'
    ],
    inclusions: [
        { item: "Procedure", details: "Advanced dermatological procedure as required." },
        { item: "Hospital Stay", details: "2-day stay in a general ward." },
        { item: "Consultation", details: "Pre and post-procedure consultations." },
        { item: "Transport", details: "Scheduled shuttle for hospital visits." },
        { item: "Medication", details: "Post-procedure medication kit." }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, consultation, and procedure." },
        { day: "2", activity: "Post-procedure care and observation." },
        { day: "3", activity: "Discharge and final instructions." },
        { day: "4", activity: "Departure." }
    ],
    hospital: hospitalData.dermatology[0],
    surgeon: doctorData.dermatology[0],
  },
   {
    id: 5,
    title: 'Dental Dreams Package',
    description: 'A complete dental makeover package including cosmetic procedures and essential care.',
    imageUrl: 'https://picsum.photos/seed/dental-clinic/600/400',
    imageHint: 'dental clinic',
    price: '$5,000',
    features: [
      'Cosmetic Dentistry (Veneers/Whitening)',
      'Full mouth check-up & cleaning',
      'Painless procedures with modern tech',
      'Includes 3-star hotel stay'
    ],
    inclusions: [
        { item: "Procedure", details: "Dental veneers (up to 8 teeth) and professional whitening." },
        { item: "Accommodation", details: "5-night stay in a comfortable 3-star hotel." },
        { item: "Consultation", details: "Comprehensive dental assessment and planning." },
        { item: "Transport", details: "Airport transfers and transport for all dental appointments." },
        { item: "Aftercare", details: "Follow-up check-up before departure." }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, consultation, and initial prep work." },
        { day: "2-4", activity: "Main dental procedures and adjustments." },
        { day: "5", activity: "Final fitting, polishing, and final check-up." },
        { day: "6", activity: "Departure." }
    ],
    hospital: hospitalData.dentistry[0],
    surgeon: doctorData.dentistry[0],
  }
];

    
