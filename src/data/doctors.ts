/**
 * Doctor Data Module
 * This file contains the doctor data loaded from the CSV file
 * and utility functions to work with it
 */

import { Doctor } from '@/types';

// Locations available in the system
export const LOCATIONS = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
];

// Default available timings for doctors
const DEFAULT_TIMINGS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

// Raw doctor data from CSV
const rawDoctorData = [
  { name: "John Smith", specialization: "Stroke", rating: 4.3 },
  { name: "Sarah Lee", specialization: "Epilepsy", rating: 4.7 },
  { name: "Michael Chen", specialization: "Pediatrics", rating: 4.5 },
  { name: "Emily Davis", specialization: "Dermatitis", rating: 4.1 },
  { name: "Jason Kim", specialization: "Orthopedic injuries", rating: 4.4 },
  { name: "Lisa Brown", specialization: "Depression", rating: 4.2 },
  { name: "David Park", specialization: "Diabetes", rating: 4.6 },
  { name: "Jennifer Chen", specialization: "Cataracts", rating: 4.3 },
  { name: "Kevin Lee", specialization: "Kidney stones", rating: 4.7 },
  { name: "Karen Nguyen", specialization: "Ulcerative colitis", rating: 4.5 },
  { name: "Ryan Johnson", specialization: "Asthma", rating: 4.1 },
  { name: "Samantha Kim", specialization: "Anemia", rating: 4.4 },
  { name: "Eric Wilson", specialization: "Cancer", rating: 4.2 },
  { name: "Michelle Lee", specialization: "Migraines", rating: 4.6 },
  { name: "Brian Davis", specialization: "Parkinson's disease", rating: 4.3 },
  { name: "Daniel Rodriguez", specialization: "Alzheimer's disease", rating: 4.7 },
  { name: "Catherine Chen", specialization: "High blood pressure", rating: 4.5 },
  { name: "Mark Lee", specialization: "Heart disease", rating: 4.1 },
  { name: "Alex Kim", specialization: "Chronic pain", rating: 4.4 },
  { name: "Julie Smith", specialization: "Sleep disorders", rating: 4.2 },
  { name: "Andrew Johnson", specialization: "Arthritis", rating: 4.6 },
  { name: "Stephanie Lee", specialization: "Allergies", rating: 4.3 },
  { name: "Robert Brown", specialization: "Obesity", rating: 4.7 },
  { name: "Laura Davis", specialization: "Autoimmune diseases", rating: 4.5 },
  { name: "Jasmine Park", specialization: "HIV/AIDS", rating: 4.1 },
  { name: "Thomas Chen", specialization: "Infectious diseases", rating: 4.4 },
  { name: "Natalie Nguyen", specialization: "Sexually transmitted diseases", rating: 4.2 },
  { name: "Brandon Johnson", specialization: "Addiction", rating: 4.6 },
  { name: "Linda Kim", specialization: "Anxiety disorders", rating: 4.3 },
  { name: "Adam Wong", specialization: "Prostate cancer", rating: 4.3 },
  { name: "Stephanie Chen", specialization: "Obstetrics and gynecology", rating: 4.7 },
  { name: "Nathan Lee", specialization: "Hypertension", rating: 4.5 },
  { name: "Karen Davis", specialization: "Lung cancer", rating: 4.1 },
  { name: "Patrick Kim", specialization: "Joint replacement surgery", rating: 4.4 },
  { name: "Michelle Brown", specialization: "Anorectal disorders", rating: 4.2 },
  { name: "Victor Park", specialization: "Autoimmune hepatitis", rating: 4.6 },
  { name: "Ashley Chen", specialization: "Coronary artery disease", rating: 4.3 },
  { name: "Justin Lee", specialization: "Bladder cancer", rating: 4.7 },
  { name: "Linda Nguyen", specialization: "Thyroid disorders", rating: 4.5 },
  { name: "Robert Johnson", specialization: "Obstructive sleep apnea", rating: 4.1 },
  { name: "Lauren Kim", specialization: "Liver disease", rating: 4.4 },
  { name: "Daniel Wilson", specialization: "Colorectal cancer", rating: 4.2 },
  { name: "Erica Lee", specialization: "Laryngology", rating: 4.6 },
  { name: "Rachel Davis", specialization: "Inflammatory bowel disease", rating: 4.3 },
  { name: "Peter Park", specialization: "Hypoglycemia", rating: 4.7 },
  { name: "Christine Chen", specialization: "End-stage renal disease", rating: 4.5 },
  { name: "David Lee", specialization: "Cystic fibrosis", rating: 4.1 },
  { name: "Julia Nguyen", specialization: "Cervical cancer", rating: 4.4 },
  { name: "William Johnson", specialization: "Neurodegenerative disorders", rating: 4.2 },
  { name: "Megan Kim", specialization: "Hearing loss", rating: 4.6 },
  { name: "Ryan Brown", specialization: "Psoriasis", rating: 4.3 },
  { name: "Hannah Park", specialization: "Pancreatic cancer", rating: 4.7 },
  { name: "Jacob Chen", specialization: "Hepatitis B", rating: 4.5 },
  { name: "Avery Lee", specialization: "Blindness and visual impairment", rating: 4.1 },
  { name: "Sophia Nguyen", specialization: "Chronic kidney disease", rating: 4.4 },
  { name: "Austin Johnson", specialization: "Schizophrenia", rating: 4.2 },
  { name: "Olivia Kim", specialization: "Obstructive lung disease", rating: 4.6 },
  { name: "Ethan Davis", specialization: "Chronic fatigue syndrome", rating: 4.3 },
  { name: "Jacob Wilson", specialization: "Prostate disorders", rating: 4.3 },
  { name: "Emma Lee", specialization: "Cardiovascular diseases", rating: 4.7 },
  { name: "Tyler Davis", specialization: "Pulmonary hypertension", rating: 4.5 },
  { name: "Amanda Park", specialization: "Osteoporosis", rating: 4.1 },
  { name: "Gabriel Chen", specialization: "Head and neck cancers", rating: 4.4 },
  { name: "Brianna Brown", specialization: "Rheumatoid arthritis", rating: 4.2 },
  { name: "Matthew Kim", specialization: "Lung diseases", rating: 4.6 },
  { name: "Sophie Nguyen", specialization: "Eating disorders", rating: 4.3 },
  { name: "Anthony Johnson", specialization: "Multiple sclerosis", rating: 4.7 },
  { name: "Melanie Kim", specialization: "Gastrointestinal disorders", rating: 4.5 },
  { name: "Alexander Smith", specialization: "Hematological disorders", rating: 4.1 },
  { name: "Isabella Lee", specialization: "Reproductive disorders", rating: 4.4 },
  { name: "Elijah Davis", specialization: "Addison's disease", rating: 4.2 },
  { name: "Grace Park", specialization: "Infectious diseases", rating: 4.6 },
  { name: "Nicholas Chen", specialization: "Heart failure", rating: 4.3 },
  { name: "Abigail Lee", specialization: "Leukemia", rating: 4.7 },
  { name: "Samuel Johnson", specialization: "Spinal cord injuries", rating: 4.5 },
  { name: "Victoria Kim", specialization: "Brain tumors", rating: 4.1 },
  { name: "Joseph Brown", specialization: "Stroke rehabilitation", rating: 4.4 },
  { name: "Natalia Park", specialization: "Mental health disorders", rating: 4.2 },
  { name: "Christopher Chen", specialization: "Cardiovascular surgery", rating: 4.6 },
  { name: "Madison Lee", specialization: "Sleep apnea", rating: 4.3 },
  { name: "Jonathan Davis", specialization: "Lymphoma", rating: 4.7 },
  { name: "Elizabeth Kim", specialization: "Autoimmune disorders", rating: 4.5 },
  { name: "Andrew Park", specialization: "Digestive disorders", rating: 4.1 },
  { name: "Samantha Chen", specialization: "Skin cancer", rating: 4.4 },
  { name: "Benjamin Brown", specialization: "Bone fractures", rating: 4.2 },
  { name: "Olivia Johnson", specialization: "Pregnancy complications", rating: 4.6 },
  { name: "Daniel Kim", specialization: "Pediatric diseases", rating: 4.3 },
  { name: "Sophia Davis", specialization: "Breast cancer", rating: 4.7 },
  { name: "William Chen", specialization: "Eye diseases", rating: 4.5 },
  { name: "Emily Brown", specialization: "Ear infections", rating: 4.1 },
];

/**
 * Assign random locations to doctors
 * In a real app, this would come from the database
 */
function assignLocation(index: number): string {
  return LOCATIONS[index % LOCATIONS.length];
}

/**
 * Generate unique ID for each doctor
 */
function generateId(name: string, index: number): string {
  return `doc-${name.toLowerCase().replace(/\s+/g, '-')}-${index}`;
}

/**
 * Process raw data into Doctor objects
 */
export const doctors: Doctor[] = rawDoctorData.map((doc, index) => ({
  id: generateId(doc.name, index),
  name: doc.name,
  specialization: doc.specialization,
  rating: doc.rating,
  location: assignLocation(index),
  availableTimings: DEFAULT_TIMINGS,
}));

/**
 * Common symptom to specialization mapping
 * Helps users find the right doctor based on symptoms
 */
export const symptomMapping: Record<string, string[]> = {
  'headache': ['Migraines', 'Stroke', 'Brain tumors', 'High blood pressure'],
  'chest pain': ['Heart disease', 'Cardiovascular diseases', 'Heart failure', 'Coronary artery disease'],
  'breathing': ['Asthma', 'Lung diseases', 'Obstructive lung disease', 'Pulmonary hypertension'],
  'skin': ['Dermatitis', 'Psoriasis', 'Skin cancer', 'Allergies'],
  'joint pain': ['Arthritis', 'Rheumatoid arthritis', 'Orthopedic injuries', 'Bone fractures'],
  'stomach': ['Ulcerative colitis', 'Inflammatory bowel disease', 'Gastrointestinal disorders', 'Digestive disorders'],
  'fatigue': ['Chronic fatigue syndrome', 'Anemia', 'Thyroid disorders', 'Sleep disorders'],
  'anxiety': ['Anxiety disorders', 'Depression', 'Mental health disorders', 'Sleep disorders'],
  'depression': ['Depression', 'Anxiety disorders', 'Mental health disorders', 'Eating disorders'],
  'fever': ['Infectious diseases', 'Pediatrics', 'HIV/AIDS'],
  'back pain': ['Spinal cord injuries', 'Orthopedic injuries', 'Chronic pain'],
  'eye': ['Cataracts', 'Blindness and visual impairment', 'Eye diseases'],
  'ear': ['Hearing loss', 'Ear infections', 'Laryngology'],
  'diabetes': ['Diabetes', 'Hypoglycemia', 'Obesity'],
  'heart': ['Heart disease', 'Heart failure', 'Cardiovascular diseases', 'Cardiovascular surgery'],
  'kidney': ['Kidney stones', 'Chronic kidney disease', 'End-stage renal disease'],
  'liver': ['Liver disease', 'Hepatitis B', 'Autoimmune hepatitis'],
  'cancer': ['Cancer', 'Breast cancer', 'Lung cancer', 'Prostate cancer', 'Leukemia'],
  'pregnancy': ['Obstetrics and gynecology', 'Pregnancy complications', 'Reproductive disorders'],
  'child': ['Pediatrics', 'Pediatric diseases'],
  'memory': ["Alzheimer's disease", "Parkinson's disease", 'Neurodegenerative disorders'],
  'weight': ['Obesity', 'Eating disorders', 'Thyroid disorders'],
  'blood pressure': ['High blood pressure', 'Hypertension', 'Cardiovascular diseases'],
  'sleep': ['Sleep disorders', 'Sleep apnea', 'Obstructive sleep apnea'],
};

/**
 * Search doctors by symptoms and location
 * Returns matching doctors based on symptom-to-specialization mapping
 */
export function searchDoctors(symptoms: string, location: string): Doctor[] {
  const symptomsLower = symptoms.toLowerCase().trim();
  const locationLower = location.toLowerCase().trim();

  // Find matching specializations based on symptoms
  let matchingSpecializations: string[] = [];
  
  for (const [symptom, specs] of Object.entries(symptomMapping)) {
    if (symptomsLower.includes(symptom)) {
      matchingSpecializations.push(...specs);
    }
  }

  // If no mapping found, search directly in specializations
  if (matchingSpecializations.length === 0) {
    matchingSpecializations = doctors
      .filter(doc => doc.specialization.toLowerCase().includes(symptomsLower))
      .map(doc => doc.specialization);
  }

  // Filter doctors by specialization and location
  return doctors.filter(doc => {
    const matchesSpecialization = 
      matchingSpecializations.some(spec => 
        doc.specialization.toLowerCase().includes(spec.toLowerCase())
      ) ||
      doc.specialization.toLowerCase().includes(symptomsLower);
    
    const matchesLocation = 
      !locationLower || 
      doc.location.toLowerCase().includes(locationLower);

    return matchesSpecialization && matchesLocation;
  });
}

/**
 * Get a doctor by ID
 */
export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find(doc => doc.id === id);
}

/**
 * Get all unique specializations
 */
export function getSpecializations(): string[] {
  return [...new Set(doctors.map(doc => doc.specialization))].sort();
}
