
import type { Hospital, Doctor, MedicalPackage } from './types';

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

// This is a mock list. In a real app, you might fetch this from a CMS or database.
export const mockPackages: MedicalPackage[] = [
  {
    id: '1',
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
    specialty: 'Cardiology'
  },
  {
    id: '2',
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
    specialty: 'Orthopedics',
  },
  {
    id: '3',
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
    specialty: 'Neurology'
  },
  {
    id: '4',
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
    specialty: 'Dermatology'
  },
   {
    id: '5',
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
    specialty: 'Dentistry'
  }
];
