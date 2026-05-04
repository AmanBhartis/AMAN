const API_BASE_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:10000/api' : '/api';

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  const authToken = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (!authToken || !userData.id) {
    window.location.href = 'login.html';
    return;
  }

  const profileForm = document.getElementById('profileForm');
  const profileDisplaySection = document.getElementById('profile-display-section');
  const profileFormSection = document.getElementById('profile-form-section');
  const editProfileBtn = document.getElementById('editProfileBtn');

  // Load existing profile from localStorage
  let existingProfile = JSON.parse(localStorage.getItem('farmerProfile') || '{}');

  // Prefill form with existing data
  function prefillForm(profile) {
    document.getElementById('fullName').value = profile.fullName || userData.name || '';
    document.getElementById('farmerId').value = profile.farmerId || userData.id || '';
    document.getElementById('age').value = profile.age || '';
    document.getElementById('gender').value = profile.gender || '';
    document.getElementById('phone').value = profile.phone || userData.phone || '';
    document.getElementById('aadhar').value = profile.aadhar || '';
    document.getElementById('address').value = profile.address || '';
    document.getElementById('landSize').value = profile.landSize || '';
    document.getElementById('farmingType').value = profile.farmingType || '';
    document.getElementById('crops').value = profile.crops || '';
    document.getElementById('livestock').value = profile.livestock || '';
    document.getElementById('bankLinked').value = profile.bankLinked || '';
    document.getElementById('loanDetails').value = profile.loanDetails || '';
    document.getElementById('fertilizers').value = profile.fertilizers || '';
    document.getElementById('pesticides').value = profile.pesticides || '';
    document.getElementById('organicPractices').value = profile.organicPractices || '';
    document.getElementById('machinery').value = profile.machinery || '';

    // If profile exists, show display section
    if (Object.keys(profile).length > 0) {
      displayProfile(profile);
    }
  }

  // Load initial profile
  prefillForm(existingProfile);

  // Form submission handler
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileData = {
      fullName: document.getElementById('fullName').value,
      farmerId: document.getElementById('farmerId').value || userData.id,
      age: document.getElementById('age').value,
      gender: document.getElementById('gender').value,
      phone: document.getElementById('phone').value,
      aadhar: document.getElementById('aadhar').value,
      address: document.getElementById('address').value,
      landSize: document.getElementById('landSize').value,
      farmingType: document.getElementById('farmingType').value,
      crops: document.getElementById('crops').value,
      livestock: document.getElementById('livestock').value,
      bankLinked: document.getElementById('bankLinked').value,
      loanDetails: document.getElementById('loanDetails').value,
      fertilizers: document.getElementById('fertilizers').value,
      pesticides: document.getElementById('pesticides').value,
      organicPractices: document.getElementById('organicPractices').value,
      machinery: document.getElementById('machinery').value,
    };

    // Save to localStorage first
    localStorage.setItem('farmerProfile', JSON.stringify(profileData));
    console.log('✅ Profile saved to localStorage');

    // Try to save to database (with timeout)
    let savedToDatabase = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/farm/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        savedToDatabase = true;
        console.log('✅ Profile also saved to MongoDB Atlas');
      }
    } catch (err) {
      console.log('⚠️ Database save skipped (using localStorage only):', err.message);
    }

    alert('✅ Profile saved successfully!');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });

  // Edit button handler
  editProfileBtn.addEventListener('click', () => {
    profileFormSection.style.display = 'block';
    profileDisplaySection.style.display = 'none';
  });

  // Display profile function
  function displayProfile(profile) {
    document.getElementById('displayFullName').textContent = profile.fullName || 'Not set';
    document.getElementById('displayFarmerId').textContent = profile.farmerId || 'N/A';
    document.getElementById('displayAge').textContent = profile.age || '-';
    document.getElementById('displayGender').textContent = profile.gender || '-';
    document.getElementById('displayPhone').textContent = profile.phone || '-';
    document.getElementById('displayAadhar').textContent = profile.aadhar || '-';
    document.getElementById('displayAddress').textContent = profile.address || '-';
    document.getElementById('displayLandSize').textContent = profile.landSize ? `${profile.landSize} acres` : '-';
    document.getElementById('displayFarmingType').textContent = profile.farmingType || '-';
    document.getElementById('displayCrops').textContent = profile.crops || '-';
    document.getElementById('displayLivestock').textContent = profile.livestock || '-';
    document.getElementById('displayBankLinked').textContent = profile.bankLinked || '-';
    document.getElementById('displayLoanDetails').textContent = profile.loanDetails || '-';
    document.getElementById('displayFertilizers').textContent = profile.fertilizers || '-';
    document.getElementById('displayPesticides').textContent = profile.pesticides || '-';
    document.getElementById('displayOrganicPractices').textContent = profile.organicPractices || '-';
    document.getElementById('displayMachinery').textContent = profile.machinery || '-';

    profileFormSection.style.display = 'none';
    profileDisplaySection.style.display = 'block';
  }
});
