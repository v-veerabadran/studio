
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

export const hospitalData: { [key: string]: Hospital[] } = {
  cardiology: [
    {
      id: '1',
      name: 'Apollo Hospital',
      location: 'Delhi, India',
      rating: 4.8,
      price: 20000,
      specialty: 'Cardiology',
      emergency: true,
      imageUrl: 'https://picsum.photos/seed/apollo-delhi/600/400',
      imageHint: 'modern hospital exterior',
      pros: ['Renowned cardiac surgeons', 'Advanced cardiac catheterization lab', 'Comprehensive post-operative care'],
      cons: ['Higher cost', 'Can have long wait times for non-emergency procedures']
    },
    {
      id: '2',
      name: 'Fortis Escorts Heart Institute',
      location: 'Delhi, India',
      rating: 4.7,
      price: 18000,
      specialty: 'Cardiology',
      emergency: true,
      imageUrl: 'https://picsum.photos/seed/fortis-delhi/600/400',
      imageHint: 'hospital building',
      pros: ['Specialized in cardiac care', 'High success rate in complex heart surgeries', 'Patient-centric approach'],
      cons: ['Very busy facility', 'Premium pricing for certain procedures']
    },
     {
      id: '3',
      name: 'Max Healthcare',
      location: 'Delhi, India',
      rating: 4.6,
      price: 16000,
      specialty: 'Cardiology',
      emergency: true,
      imageUrl: 'https://picsum.photos/seed/max-delhi/600/400',
      imageHint: 'large hospital front',
      pros: ['State-of-the-art technology', 'Experienced team of cardiologists', 'Multiple locations'],
      cons: ['Variable patient experience across branches', 'Billing can be complex']
    }
  ],
  pulmonology: [],
  nephrology: [],
  neurology: [
    {
      id: '4',
      name: 'Medanta - The Medicity',
      location: 'Gurgaon, India',
      rating: 4.9,
      price: 15000,
      specialty: 'Neurology',
      emergency: true,
      imageUrl: 'https://picsum.photos/seed/medanta-gurgaon/600/400',
      imageHint: 'futuristic hospital building',
      pros: ['Leader in neurological sciences', 'Advanced neuro-imaging facilities', 'Robotic surgery options'],
      cons: ['Located outside of central Delhi', 'High demand for top surgeons']
    }
  ],
  dermatology: [
     {
      id: '5',
      name: 'Indraprastha Apollo Hospital',
      location: 'Delhi, India',
      rating: 4.5,
      price: 8000,
      specialty: 'Dermatology',
      emergency: false,
      imageUrl: 'https://picsum.photos/seed/indraprastha-apollo/600/400',
      imageHint: 'sleek clinic reception',
      pros: ['Comprehensive skin and hair treatments', 'Latest laser technologies', 'Experienced dermatologists'],
      cons: ['Cosmetic procedures are expensive', 'Appointment scheduling can be tight']
    }
  ],
  orthopedics: [
      {
      id: '6',
      name: 'Artemis Hospital',
      location: 'Gurgaon, India',
      rating: 4.8,
      price: 12000,
      specialty: 'Orthopedics',
      emergency: true,
      imageUrl: 'https://picsum.photos/seed/artemis-gurgaon/600/400',
      imageHint: 'modern glass building',
      pros: ['Specialized in joint replacement', 'Advanced physiotherapy and rehab unit', 'International patient services'],
      cons: ['Can be costly', 'High volume of patients']
    }
  ],
  dentistry: [
     {
        id: '7',
        name: 'Clove Dental',
        location: 'Delhi, India',
        rating: 4.7,
        price: 4000,
        specialty: 'Dentistry',
        emergency: false,
        imageUrl: 'https://picsum.photos/seed/clove-dental/600/400',
        imageHint: 'modern dental office',
        pros: ['Largest dental chain in India', 'Standardized procedures and pricing', 'Modern equipment'],
        cons: ['Experience can vary by clinic', 'Focus on common procedures']
     },
     {
        id: '8',
        name: 'Axiss Dental',
        location: 'Delhi, India',
        rating: 4.6,
        price: 5000,
        specialty: 'Dentistry',
        emergency: false,
        imageUrl: 'https://picsum.photos/seed/axiss-dental/600/400',
        imageHint: 'bright dental room',
        pros: ['Good for cosmetic dentistry', 'Experienced team of specialists', 'Flexible appointments'],
        cons: ['Slightly higher pricing', 'Some clinics are small']
     }
  ]
};

export const doctorData: { [key: string]: Doctor[] } = {
  cardiology: [
    {
      id: '1',
      name: 'Dr. Ashok Seth',
      specialty: 'Cardiology',
      hospital: 'Fortis Escorts Heart Institute',
      rating: 4.9,
      experience: 30,
      boardCertified: true,
      imageUrl: 'https://picsum.photos/seed/dr-seth/400/400',
      imageHint: 'male doctor portrait',
      pros: ['Performed over 50,000 angiograms', 'Pioneer in angioplasty', 'Highly respected internationally'],
      cons: ['Extremely busy', 'Consultation fee is high']
    },
    {
      id: '2',
      name: 'Dr. Naresh Trehan',
      specialty: 'Cardiology',
      hospital: 'Medanta - The Medicity',
      rating: 4.9,
      experience: 40,
      boardCertified: true,
      imageUrl: 'https://picsum.photos/seed/dr-trehan/400/400',
      imageHint: 'senior doctor smiling',
      pros: ['Renowned cardiovascular surgeon', 'Founder of Medanta', 'Vast experience'],
      cons: ['Difficult to get an appointment', 'Focuses on complex cases']
    }
  ],
  pulmonology: [],
  nephrology: [],
  neurology: [],
  dermatology: [],
  orthopedics: [],
  dentistry: []
};
