document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form-alignment');
  
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get input values
      const height = parseFloat(form.querySelector('input[placeholder="Height/cm"]').value);
      const weight = parseFloat(form.querySelector('input[placeholder="Weight/kg"]').value);
      const age = parseInt(form.querySelector('input[placeholder="Age"]').value);
      const sex = form.querySelector('#sex').value;
      const activity = form.querySelector('#activity').value;

      // Validate inputs
      if (!height || !weight || !age || height <= 0 || weight <= 0 || age <= 0) {
          alert('Please enter valid values for height, weight, and age');
          return;
      }
      
      // Convert height from cm to meters
      const heightInMeters = height / 100;
      
      // Calculate BMI
      const bmi = calculateBMI(weight, heightInMeters);
      
      // Calculate BMR (Basal Metabolic Rate)
      const bmr = calculateBMR(weight, height, age, sex);
      
      // Calculate daily calorie needs
      const dailyCalories = calculateDailyCalories(bmr, activity);
      
      // Get weight status
      const weightStatus = getWeightStatus(bmi);
      
      // Display results
      displayResults(bmi, weightStatus, dailyCalories);
  });
});

function calculateBMI(weight, heightInMeters) {
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function getWeightStatus(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi <= 24.9) return 'Healthy';
  if (bmi >= 25.0 && bmi <= 29.9) return 'Overweight';
  return 'Obese';
}

function calculateBMR(weight, height, age, sex) {
  if (sex === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
  } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
  }
}

function calculateDailyCalories(bmr, activity) {
  const activityFactors = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725
  };
  
  return Math.round(bmr * activityFactors[activity]);
}

function displayResults(bmi, weightStatus, dailyCalories) {
  // Create or get results container
  let resultsContainer = document.querySelector('.bmi-results');
  if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'bmi-results';
      document.querySelector('.bmi-form-container').appendChild(resultsContainer);
  }

  // Get status class
  const statusClass = `status-${weightStatus.toLowerCase()}`;
  
  // Update results
  resultsContainer.innerHTML = `
      <div class="results-content ${statusClass}">
          <h3>Your Results</h3>
          <p>Your BMI: <strong>${bmi}</strong></p>
          <p>Weight Status: <strong>${weightStatus}</strong></p>
          <p>Estimated Daily Calories: <strong>${dailyCalories}</strong> calories</p>
          <p class="result-explanation">
              ${getResultExplanation(weightStatus, dailyCalories)}
          </p>
      </div>
  `;
}

function getResultExplanation(weightStatus, dailyCalories) {
  let explanation = '';
  
  switch(weightStatus.toLowerCase()) {
      case 'underweight':
          explanation = `Tips: To reach a healthy weight, consider gradually increasing your caloric intake above ${dailyCalories} calories while maintaining a balanced diet.`;
          break;
      case 'healthy':
          explanation = `Tips: Great! Maintain your health by consuming around ${dailyCalories} calories daily with a balanced diet and regular exercise.`;
          break;
      case 'overweight':
          explanation = `Tips: To reach a healthy weight, consider a moderate calorie deficit from ${dailyCalories} calories while maintaining regular physical activity.`;
          break;
      case 'obese':
          explanation = `Tips: Consider consulting a healthcare provider for a personalized plan. A supervised reduction from ${dailyCalories} calories with regular exercise may help.`;
          break;
  }
  
  return explanation;
}