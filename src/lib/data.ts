export type Hospital = {
    id: number;
    name: string;
    location: string;
    rating: number;
    specialty: string;
    emergency: boolean;
    imageUrl: string;
    imageHint: string;
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
}

export const hospitalData = {
    cardiology: [
        { id: 1, name: "City Heart Institute", location: "Metropolis", rating: 4.8, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital1/600/400", imageHint: "hospital building" },
        { id: 2, name: "St. Jude's Cardiac Center", location: "Metropolis", rating: 4.5, specialty: "Cardiology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital2/600/400", imageHint: "modern hospital" },
        { id: 3, name: "General Hospital - Cardiology", location: "Metropolis", rating: 4.2, specialty: "Cardiology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital3/600/400", imageHint: "hospital exterior" },
    ],
    pulmonology: [
        { id: 4, name: "Breathe Easy Clinic", location: "Metropolis", rating: 4.9, specialty: "Pulmonology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital4/600/400", imageHint: "clinic building" },
        { id: 5, name: "Metropolis Lung Center", location: "Metropolis", rating: 4.6, specialty: "Pulmonology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital5/600/400", imageHint: "large hospital" },
    ],
    nephrology: [
        { id: 6, name: "Kidney Care Associates", location: "Metropolis", rating: 4.7, specialty: "Nephrology", emergency: false, imageUrl: "https://picsum.photos/seed/hospital6/600/400", imageHint: "medical building" },
        { id: 7, name: "St. Jude's Renal Unit", location: "Metropolis", rating: 4.4, specialty: "Nephrology", emergency: true, imageUrl: "https://picsum.photos/seed/hospital7/600/400", imageHint: "hospital entrance" },
    ]
}

export const doctorData = {
    cardiology: [
        { id: 1, name: "Dr. Evelyn Reed", specialty: "Cardiology", hospital: "City Heart Institute", rating: 4.9, experience: 15, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc1/400/400", imageHint: "female doctor" },
        { id: 2, name: "Dr. Marcus Thorne", specialty: "Cardiology", hospital: "St. Jude's Cardiac Center", rating: 4.7, experience: 12, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc2/400/400", imageHint: "male doctor" },
    ],
    pulmonology: [
        { id: 3, name: "Dr. Sofia Rossi", specialty: "Pulmonology", hospital: "Breathe Easy Clinic", rating: 4.8, experience: 10, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc3/400/400", imageHint: "woman doctor" },
    ],
    nephrology: [
         { id: 4, name: "Dr. Kenji Tanaka", specialty: "Nephrology", hospital: "Kidney Care Associates", rating: 4.6, experience: 18, boardCertified: true, imageUrl: "https://picsum.photos/seed/doc4/400/400", imageHint: "asian doctor" },
    ]
};
