const password = document.getElementById('password');
const email = document.getElementById('email'); // Add this line to get the email input
const background = document.getElementById('background');
const validationRules = document.querySelectorAll('.requirement-list li');

const requirements = [
  { regex: /.{8,}/, index: 0 },
  { regex: /[0-9]/, index: 1 },
  { regex: /[a-z]/, index: 2 },
  { regex: /[^A-Za-z0-9]/, index: 3 },
  { regex: /[A-Z]/, index: 4 },
  // Add the new requirement for dissimilarity to email
  { dissimilarity: true, index: 5 }
];

let strengthCount = [];

// Array of background images
const backgroundImages = [
  'url("https://images.alphacoders.com/134/1341520.jpeg")',
  'url("https://images.mid-day.com/images/images/2022/dec/messicoverrr-a_d.jpg")',
  'url("https://media.newyorker.com/photos/624143a04121dd98d3b8b3d9/master/w_1920,c_limit/Cunningham-Rock-Smith-Slap.jpg")',
  'url("https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/ap-brady-hoists-super-bowl-trophy-1612758000.jpg?crop=1.00xw:0.846xh;0,0.137xh&resize=900:*")',
  'url("https://wallpapercave.com/wp/wp3671612.jpg")',
  'url("https://wallpapercave.com/wp/wp6425940.jpg")',
  'url("https://wallpapers.com/images/hd/wimbledon-championship-roger-federer-i6ob3eq32fc6xe6x.jpg")',
  'url("https://image-cdn.essentiallysports.com/wp-content/uploads/20200702223509/kobe-2001-1-800x534.jpg")',
  'url("https://img.buzzfeed.com/buzzfeed-static/static/2017-01/8/21/asset/buzzfeed-prod-fastlane-01/sub-buzz-8089-1483929202-7.png")',
  'url("https://images.static-bluray.com/reviews/17404_1.jpg")',
];

// Function to set a random background image
function setRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  background.style.backgroundImage = backgroundImages[randomIndex];
}

// Set initial random background
setRandomBackground();

password.addEventListener('input', (event) => {
  const input = event.target.value;
  validation(input, email.value); // Pass both password and email for dissimilarity check
});

email.addEventListener('input', (event) => {
  const input = event.target.value;
  validation(password.value, input); // Pass both password and email for dissimilarity check
});

function validation(passwordInput, emailInput) {
  let strengthCount = []; // Move this declaration here

  requirements.forEach((rule) => {
    let blurValue; // Declare blurValue here

    if (rule.dissimilarity) {
      // Check for dissimilarity to email
      const isDissimilar = checkDissimilarity(passwordInput, emailInput);
      if (isDissimilar) {
        const validRule = validationRules[rule.index];
        validRule.classList.add('valid');
        if (!strengthCount.includes(rule)) {
          strengthCount.push(rule);
        }
      } else {
        validationRules[rule.index].classList.remove('valid');
        const findElement = strengthCount.indexOf(rule);
        if (findElement !== -1) {
          strengthCount.splice(findElement, 1);
        }
      }
    } else {
      const isValid = rule.regex.test(passwordInput);

      if (isValid) {
        const validRule = validationRules[rule.index];
        validRule.classList.add('valid');
        if (!strengthCount.includes(rule)) {
          strengthCount.push(rule);
        }
      } else {
        validationRules[rule.index].classList.remove('valid');
        const findElement = strengthCount.indexOf(rule);
        if (findElement !== -1) {
          strengthCount.splice(findElement, 1);
        }
      }
    }

    blurValue = 20 - strengthCount.length * 4; // Calculate blurValue here

    console.log('Blur Value:', blurValue);
    console.log('Strength Count:', strengthCount);
  });

  const length = strengthCount.length;
  const blurValue = 20 - length * 4;
  background.style.filter = `blur(${blurValue}px)`;
} 

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    distanceMatrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j - 1][i] + 1, // Deletion
        distanceMatrix[j][i - 1] + 1, // Insertion
        distanceMatrix[j - 1][i - 1] + cost // Substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}

// Function to check dissimilarity between password and email
function checkDissimilarity(password, email) {
  // Calculate the length of the longer string
  const maxLength = Math.max(password.length, email.length);

  // Determine a threshold for common substring count (adjust as needed)
  const commonSubstringThreshold = 3; // Adjust this threshold based on your requirements

  // Calculate the number of common substrings of length 3
  let commonSubstringCount = 0;

  for (let i = 0; i < maxLength - 2; i++) {
    const substring = password.substr(i, 3);
    if (email.includes(substring)) {
      commonSubstringCount++;
    }
  }

  // Return true if the common substring count is below the threshold
  return commonSubstringCount < commonSubstringThreshold;
}