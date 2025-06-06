import React, { useState, useEffect } from 'react';
import { FiCamera, FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, FiHome, FiSave, FiLoader } from 'react-icons/fi';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    profilePicture: '',
    // Firm details
    firmName: '',
    firmAddress: '',
    firmPhone: '',
    lawSocietyNumber: '',
    firmLogo: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Placeholder for API call to fetch user profile
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const mockData = {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@lawfirm.co.za',
          phoneNumber: '+27 11 123 4567',
          jobTitle: 'Senior Conveyancer',
          profilePicture: '',
          firmName: 'Smith & Associates Attorneys',
          firmAddress: '123 Main Street, Johannesburg, 2000',
          firmPhone: '+27 11 987 6543',
          lawSocietyNumber: 'LSA12345',
          firmLogo: ''
        };
        
        setProfile(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage('');
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({ ...prev, [fieldName]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Placeholder for API call to save user profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      }).catch(() => {
        // Mock successful response for demo
        return { ok: true };
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError(`Error saving profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h2>
        <p className="text-gray-600">Manage your personal information and firm details</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-blue-600" />
            Personal Information
          </h3>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  {profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profile-picture-upload" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <FiCamera className="w-4 h-4 text-white" />
                </label>
                <input 
                  type="file" 
                  id="profile-picture-upload"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profilePicture')} 
                  className="hidden" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a professional photo. Recommended size: 400x400px
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  value={profile.firstName} 
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  value={profile.lastName} 
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={profile.email} 
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  id="phoneNumber" 
                  value={profile.phoneNumber} 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+27 11 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div className="mb-6">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title / Position
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                name="jobTitle" 
                id="jobTitle" 
                value={profile.jobTitle} 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Senior Conveyancer, Partner"
              />
            </div>
          </div>
        </div>

        {/* Firm Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiHome className="w-5 h-5 mr-2 text-blue-600" />
            Firm Information
          </h3>

          {/* Firm Logo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Firm Logo</label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300">
                  {profile.firmLogo ? (
                    <img 
                      src={profile.firmLogo} 
                      alt="Firm Logo" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiHome className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="firm-logo-upload" 
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <FiCamera className="w-3 h-3 text-white" />
                </label>
                <input 
                  type="file" 
                  id="firm-logo-upload"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'firmLogo')} 
                  className="hidden" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  Upload your firm's logo for professional branding
                </p>
                <p className="text-xs text-gray-500">
                  Recommended: Square format, transparent background
                </p>
              </div>
            </div>
          </div>

          {/* Firm Details */}
          <div className="space-y-6">
            <div>
              <label htmlFor="firmName" className="block text-sm font-medium text-gray-700 mb-2">
                Firm Name
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  name="firmName" 
                  id="firmName" 
                  value={profile.firmName} 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your Law Firm Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="firmAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Firm Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea 
                  name="firmAddress" 
                  id="firmAddress" 
                  value={profile.firmAddress} 
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Street Address, City, Postal Code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firmPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Firm Phone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="tel" 
                    name="firmPhone" 
                    id="firmPhone" 
                    value={profile.firmPhone} 
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+27 11 987 6543"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lawSocietyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Law Society Registration
                </label>
                <input 
                  type="text" 
                  name="lawSocietyNumber" 
                  id="lawSocietyNumber" 
                  value={profile.lawSocietyNumber} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="LSA Registration Number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 