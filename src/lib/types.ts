
export type Hospital = {
    id: string;
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
    id: string;
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

export type MedicalPackage = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    price: string;
    features: string[];
    inclusions: { item: string; details: string }[];
    itinerary: { day: string; activity: string }[];
    specialty: string;
}
