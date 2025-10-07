import React, { useState, useRef } from "react";
import { X, Camera, Shuffle, Upload, User, Mail, FileText } from "lucide-react";
import Avatar, { genConfig } from "react-nice-avatar";
import { useAuth } from "../context/useAuth";
import Input from "./UI/Input";
import Button from "./UI/Button";

const ProfileEditPage = ({ handleCloseEditProfile }) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarMode, setAvatarMode] = useState(
    user?.profile?.profilePicture?.startsWith("http") ? "upload" : "generated"
  );
  const [avatarConfig, setAvatarConfig] = useState(
    user?.profile?.avatarConfig || genConfig(user?.email)
  );
  const [uploadedAvatar, setUploadedAvatar] = useState(
    user?.profile?.profilePicture?.startsWith("http")
      ? user.profile.profilePicture
      : ""
  );
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    bio: user?.profile?.bio || "",
  });

  const fileRef = useRef(null);

  const handleGenerateNewAvatar = () => {
    const newConfig = genConfig();
    setAvatarConfig(newConfig);
    setAvatarMode("generated");
    setUploadedAvatar("");
  };

  const handlePickAvatar = () => {
    fileRef.current?.click();
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAvatar(reader.result);
        setAvatarMode("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Prepare update data
      const updateData = {
        profile: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          bio: formData.bio.trim(),
        },
      };

      // Add avatar data based on mode
      if (avatarMode === "upload" && uploadedAvatar) {
        updateData.profile.profilePicture = uploadedAvatar;
        updateData.profile.avatarConfig = null;
      } else if (avatarMode === "generated") {
        updateData.profile.avatarConfig = avatarConfig;
        updateData.profile.profilePicture = "";
      }

      const result = await updateProfile(updateData);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          handleCloseEditProfile();
        }, 1500);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-start justify-center p-4 py-8">
      {/* Card */}
      <div className="relative w-full max-w-[480px] rounded-3xl bg-white shadow-xl ring-1 ring-gray-200 px-6 pt-8 pb-6">
        {/* Close Button */}
        <button
          aria-label="Close edit profile"
          onClick={handleCloseEditProfile}
          className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
        >
          <X className="text-gray-600" size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your profile information
          </p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Avatar Display */}
            <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-orange-400 ring-offset-2 shadow-lg">
              {avatarMode === "upload" && uploadedAvatar ? (
                <img
                  src={uploadedAvatar}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Avatar
                  style={{ width: "100%", height: "100%" }}
                  {...avatarConfig}
                />
              )}
            </div>

            {/* Edit Avatar Button */}
            <button
              type="button"
              onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              className="absolute -bottom-1 -right-1 h-8 w-8 grid place-items-center rounded-full bg-orange-500 shadow-lg hover:bg-orange-600 active:scale-95 transition"
            >
              <Camera className="text-white" size={16} />
            </button>
          </div>

          {/* Avatar Options */}
          {showAvatarOptions && (
            <div className="mt-3 flex gap-2 bg-gray-100 rounded-xl p-2">
              <button
                type="button"
                onClick={handleGenerateNewAvatar}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm"
              >
                <Shuffle size={16} />
                Generate
              </button>
              <button
                type="button"
                onClick={handlePickAvatar}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 shadow-sm"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="sr-only"
          />

          {/* User Email */}
          <p className="mt-3 text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User className="text-gray-400" size={18} />
              </div>
              <Input
                value={formData.firstName}
                onChange={(value) => handleChange("firstName", value)}
                placeholder="Enter your first name"
                withIcon={true}
                disabled={loading}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User className="text-gray-400" size={18} />
              </div>
              <Input
                value={formData.lastName}
                onChange={(value) => handleChange("lastName", value)}
                placeholder="Enter your last name"
                withIcon={true}
                disabled={loading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-2">
              Bio
            </label>
            <div className="relative">
              <div className="absolute left-4 top-5 transform -translate-y-1/2">
                <FileText className="text-gray-400" size={18} />
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={loading}
                rows="3"
                className="w-full pl-14 pr-4 py-4 bg-gray-300 border-0 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
