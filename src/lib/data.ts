export type Hospital = {
    id: number;
    name: string;
    location: string;
    rating: number;
    specialty: string;
    emergency: boolean;
    imageUrl: string;
    imageHint: string;
    pros: string[];
    cons: string[];
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
        { id: 1, name: "City Heart Institute", location: "Metropolis", rating: 4.8, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital1/600/400", imageHint: "hospital building", pros: ["Top-rated cardiac unit", "Latest technology"], cons: ["Can be expensive", "Long wait times"] },
        { id: 2, name: "St. Jude's Cardiac Center", location: "Metropolis", rating: 4.5, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital2/600/400", imageHint: "modern hospital", pros: ["Renowned specialists", "Accepts most insurance"], cons: ["Older facility"] },
        { id: 3, name: "General Hospital - Cardiology", location: "Metropolis", rating: 4.2, specialty: "Cardiology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital3/600/400", imageHint: "hospital exterior", pros: ["Affordable care", "Good for routine check-ups"], cons: ["No emergency services", "Limited specialist availability"] },
    ],
    pulmonology: [
        { id: 4, name: "Breathe Easy Clinic", location: "Metropolis", rating: 4.9, specialty: "Pulmonology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital4/600/400", imageHint: "clinic building", pros: ["Highly specialized care", "Excellent patient reviews"], cons: ["Limited operating hours"] },
        { id: 5, name: "Metropolis Lung Center", location: "Metropolis", rating: 4.6, specialty: "Pulmonology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital5/600/400", imageHint: "large hospital", pros: ["24/7 emergency care", "In-house diagnostics"], cons: ["Located downtown, heavy traffic"] },
    ],
    nephrology: [
        { id: 6, name: "Kidney Care Associates", location: "Metropolis", rating: 4.7, specialty: "Nephrology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital6/600/400", imageHint: "medical building", pros: ["Focus on chronic kidney disease", "Holistic approach"], cons: ["By referral only"] },
        { id: 7, name: "St. Jude's Renal Unit", location: "Metropolis", rating: 4.4, specialty: "Nephrology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital7/600/400", imageHint: "hospital entrance", pros: ["Advanced dialysis services", "Tied to a major hospital"], cons: ["Can feel impersonal"] },
    ],
    neurology: [
        { id: 8, name: "Metro Neurosciences", location: "Metropolis", rating: 4.8, specialty: "Neurology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital8/600/400", imageHint: "modern clinic", pros: ["Comprehensive stroke center", "Research-driven"], cons: ["High demand for specialists"] },
        { id: 9, name: "Brain & Spine Center", location: "Uptown", rating: 4.6, specialty: "Neurology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital9/600/400", imageHint: "specialty hospital", pros: ["Specializes in spine disorders", "Integrative therapies"], cons: ["Limited insurance network"] },
    ],
    dermatology: [
        { id: 10, name: "The Skin Institute", location: "Downtown", rating: 4.9, specialty: "Dermatology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital10/600/400", imageHint: "modern building", pros: ["Cosmetic & medical services", "State-of-the-art equipment"], cons: ["Mostly private pay"] },
    ],
    orthopedics: [
        { id: 11, name: "Joint & Bone Clinic", location: "Suburbia", rating: 4.7, specialty: "Orthopedics", emergency: true, imageUrl: "https://picsum.photos/seed/hospital11/600/400", imageHint: "clinic exterior", pros: ["Top sports medicine docs", "On-site physical therapy"], cons: ["Busy on weekends"] },
    ],
    dentistry: [
        { id: 12, name: "Bright Smile Dental", location: "City Center", rating: 4.9, specialty: "Dentistry", emergency: true, imageUrl: "https://picsum.photos/seed/hospital12/600/400", imageHint: "dental office", pros: ["Family & cosmetic dentistry", "Open on Saturdays"], cons: ["Can be noisy"] },
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