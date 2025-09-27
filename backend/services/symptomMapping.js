// Symptom to specialization mapping for triage system
const symptomMapping = {
  // General symptoms
  'fever': ['General Physician', 'Internal Medicine'],
  'headache': ['General Physician', 'Neurologist'],
  'fatigue': ['General Physician', 'Internal Medicine'],
  'nausea': ['General Physician', 'Internal Medicine'],
  'vomiting': ['General Physician', 'Internal Medicine'],
  'dizziness': ['General Physician', 'Neurologist'],
  'weakness': ['General Physician', 'Internal Medicine'],
  'weight loss': ['General Physician', 'Internal Medicine'],
  'weight gain': ['General Physician', 'Internal Medicine'],
  'loss of appetite': ['General Physician', 'Internal Medicine'],
  
  // Respiratory symptoms
  'cough': ['General Physician', 'Internal Medicine'],
  'chest pain': ['Cardiologist', 'General Physician'],
  'shortness of breath': ['Cardiologist', 'General Physician', 'Internal Medicine'],
  'wheezing': ['General Physician', 'Internal Medicine'],
  'sore throat': ['General Physician', 'ENT'],
  'runny nose': ['General Physician', 'ENT'],
  'congestion': ['General Physician', 'ENT'],
  'sneezing': ['General Physician', 'ENT'],
  
  // Cardiovascular symptoms
  'heart palpitations': ['Cardiologist'],
  'chest tightness': ['Cardiologist'],
  'irregular heartbeat': ['Cardiologist'],
  'high blood pressure': ['Cardiologist', 'General Physician'],
  'low blood pressure': ['Cardiologist', 'General Physician'],
  'swelling in legs': ['Cardiologist', 'General Physician'],
  
  // Neurological symptoms
  'seizures': ['Neurologist'],
  'memory problems': ['Neurologist', 'Psychiatrist'],
  'confusion': ['Neurologist', 'General Physician'],
  'numbness': ['Neurologist'],
  'tingling': ['Neurologist'],
  'muscle weakness': ['Neurologist', 'Orthopedist'],
  'tremors': ['Neurologist'],
  'difficulty speaking': ['Neurologist'],
  'vision problems': ['Ophthalmology', 'Neurologist'],
  'hearing problems': ['ENT', 'Neurologist'],
  
  // Gastrointestinal symptoms
  'abdominal pain': ['General Physician', 'Internal Medicine'],
  'stomach ache': ['General Physician', 'Internal Medicine'],
  'diarrhea': ['General Physician', 'Internal Medicine'],
  'constipation': ['General Physician', 'Internal Medicine'],
  'bloating': ['General Physician', 'Internal Medicine'],
  'indigestion': ['General Physician', 'Internal Medicine'],
  'heartburn': ['General Physician', 'Internal Medicine'],
  'blood in stool': ['General Physician', 'Internal Medicine'],
  'blood in vomit': ['General Physician', 'Internal Medicine'],
  
  // Musculoskeletal symptoms
  'joint pain': ['Orthopedist', 'General Physician'],
  'back pain': ['Orthopedist', 'General Physician'],
  'neck pain': ['Orthopedist', 'General Physician'],
  'muscle pain': ['Orthopedist', 'General Physician'],
  'stiffness': ['Orthopedist', 'General Physician'],
  'swelling in joints': ['Orthopedist', 'General Physician'],
  'limited mobility': ['Orthopedist', 'General Physician'],
  
  // Skin symptoms
  'rash': ['Dermatologist', 'General Physician'],
  'itching': ['Dermatologist', 'General Physician'],
  'skin discoloration': ['Dermatologist'],
  'moles': ['Dermatologist'],
  'acne': ['Dermatologist'],
  'dry skin': ['Dermatologist', 'General Physician'],
  'skin lesions': ['Dermatologist'],
  
  // Mental health symptoms
  'anxiety': ['Psychiatrist', 'General Physician'],
  'depression': ['Psychiatrist', 'General Physician'],
  'mood swings': ['Psychiatrist', 'General Physician'],
  'insomnia': ['Psychiatrist', 'General Physician'],
  'panic attacks': ['Psychiatrist'],
  'stress': ['Psychiatrist', 'General Physician'],
  'irritability': ['Psychiatrist', 'General Physician'],
  
  // Women's health symptoms
  'irregular periods': ['Gynecologist'],
  'heavy periods': ['Gynecologist'],
  'missed periods': ['Gynecologist'],
  'pelvic pain': ['Gynecologist'],
  'breast pain': ['Gynecologist', 'General Physician'],
  'vaginal discharge': ['Gynecologist'],
  'pregnancy concerns': ['Gynecologist'],
  
  // Children's symptoms
  'child fever': ['Pediatrician'],
  'child cough': ['Pediatrician'],
  'child rash': ['Pediatrician'],
  'child vomiting': ['Pediatrician'],
  'child diarrhea': ['Pediatrician'],
  'developmental concerns': ['Pediatrician'],
  
  // Emergency symptoms
  'severe chest pain': ['Emergency Medicine', 'Cardiologist'],
  'difficulty breathing': ['Emergency Medicine', 'General Physician'],
  'severe headache': ['Emergency Medicine', 'Neurologist'],
  'loss of consciousness': ['Emergency Medicine'],
  'severe bleeding': ['Emergency Medicine'],
  'severe abdominal pain': ['Emergency Medicine', 'General Physician'],
  'stroke symptoms': ['Emergency Medicine', 'Neurologist'],
  'heart attack symptoms': ['Emergency Medicine', 'Cardiologist']
};

// Function to map symptoms to specializations
const mapSymptomsToSpecialization = (symptoms) => {
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return [];
  }

  const specializations = new Set();
  
  symptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase().trim();
    if (symptomMapping[normalizedSymptom]) {
      symptomMapping[normalizedSymptom].forEach(spec => specializations.add(spec));
    }
  });

  return Array.from(specializations);
};

// Function to get priority level based on symptoms
const getPriorityLevel = (symptoms) => {
  const emergencySymptoms = [
    'severe chest pain',
    'difficulty breathing',
    'severe headache',
    'loss of consciousness',
    'severe bleeding',
    'severe abdominal pain',
    'stroke symptoms',
    'heart attack symptoms'
  ];

  const urgentSymptoms = [
    'chest pain',
    'shortness of breath',
    'seizures',
    'severe pain',
    'high fever',
    'severe vomiting',
    'severe diarrhea'
  ];

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
  
  if (normalizedSymptoms.some(symptom => emergencySymptoms.includes(symptom))) {
    return 'emergency';
  }
  
  if (normalizedSymptoms.some(symptom => urgentSymptoms.includes(symptom))) {
    return 'urgent';
  }
  
  return 'routine';
};

// Function to suggest additional symptoms based on current symptoms
const suggestRelatedSymptoms = (currentSymptoms) => {
  const relatedSymptoms = {
    'fever': ['headache', 'fatigue', 'body aches', 'chills'],
    'chest pain': ['shortness of breath', 'heart palpitations', 'nausea'],
    'headache': ['nausea', 'sensitivity to light', 'dizziness'],
    'abdominal pain': ['nausea', 'vomiting', 'diarrhea', 'bloating'],
    'cough': ['chest pain', 'shortness of breath', 'fever'],
    'rash': ['itching', 'fever', 'swelling']
  };

  const suggestions = new Set();
  currentSymptoms.forEach(symptom => {
    const normalizedSymptom = symptom.toLowerCase().trim();
    if (relatedSymptoms[normalizedSymptom]) {
      relatedSymptoms[normalizedSymptom].forEach(suggestion => suggestions.add(suggestion));
    }
  });

  return Array.from(suggestions);
};

export {
  symptomMapping,
  mapSymptomsToSpecialization,
  getPriorityLevel,
  suggestRelatedSymptoms
};
