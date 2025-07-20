import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Bell, BellOff, Eye, EyeOff } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";
import { notificationManager } from "../lib/notifications";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const {
    notificationsEnabled,
    showSenderName,
    showMessagePreview,
    setNotificationsEnabled,
    setShowSenderName,
    setShowMessagePreview,
  } = useNotificationStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleNotificationToggle = async (enabled) => {
    if (enabled && !notificationManager.isPermissionGranted()) {
      const granted = await notificationManager.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        // Show test notification
        notificationManager.showNotification("Notifications Enabled!", {
          body: "You will now receive message notifications.",
          icon: "/avatar.png"
        });
      }
    } else {
      setNotificationsEnabled(enabled);
    }
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              {/* Enable/Disable Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                <div className="flex items-center gap-3">
                  {notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-success" />
                  ) : (
                    <BellOff className="w-5 h-5 text-base-content/60" />
                  )}
                  <div>
                    <span className="font-medium">Allow Notifications</span>
                    <p className="text-sm text-base-content/60">
                      Receive notifications when you get new messages
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notificationsEnabled}
                  onChange={(e) => handleNotificationToggle(e.target.checked)}
                />
              </div>

              {/* Show Sender Name */}
              <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-medium">Show Sender Name</span>
                    <p className="text-sm text-base-content/60">
                      {showSenderName 
                        ? 'Display "New message from [Name]"' 
                        : 'Display "New message" only'
                      }
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={showSenderName}
                  onChange={(e) => setShowSenderName(e.target.checked)}
                  disabled={!notificationsEnabled}
                />
              </div>

              {/* Show Message Preview */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {showMessagePreview ? (
                    <Eye className="w-5 h-5 text-primary" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-base-content/60" />
                  )}
                  <div>
                    <span className="font-medium">Preview Message</span>
                    <p className="text-sm text-base-content/60">
                      {showMessagePreview 
                        ? 'Show message content in notifications' 
                        : 'Hide message content for privacy'
                      }
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={showMessagePreview}
                  onChange={(e) => setShowMessagePreview(e.target.checked)}
                  disabled={!notificationsEnabled}
                />
              </div>
            </div>

            {/* Notification Preview */}
            {notificationsEnabled && (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Notification Preview:</h3>
                <div className="text-sm">
                  <div className="font-medium">
                    {showSenderName ? "New message from John Doe" : "New message"}
                  </div>
                  <div className="text-base-content/70 mt-1">
                    {showMessagePreview ? "Hey! How are you doing?" : "You have a new message"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
