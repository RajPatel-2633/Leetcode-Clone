import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image, Edit, CheckCircle2, Code2, BookOpen, ThumbsUp } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";

const Profile = () => {
  const { authUser } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: authUser?.name || "",
    image: authUser?.image || ""
  });
  
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center py-10 px-4 md:px-8 w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                  {authUser?.image ? (
                    <img src={authUser.image} alt={authUser?.name || "User"} className="rounded-full" />
                  ) : (
                    <span className="text-3xl">{authUser?.name ? authUser.name.charAt(0).toUpperCase() : "U"}</span>
                  )}
                </div>
              </div>
              
              {/* Name and Role Badge */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{authUser?.name || "User"}</h2>
                <div className="badge badge-primary mt-2">{authUser?.role || "USER"}</div>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="divider">Statistics</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="stat-title">Problems Solved</div>
                <div className="stat-value text-2xl">0</div>
                <div className="stat-desc">Keep solving!</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="stat-title">Total Submissions</div>
                <div className="stat-value text-2xl">0</div>
                <div className="stat-desc">Submissions made</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="stat-title">Playlists Created</div>
                <div className="stat-value text-2xl">0</div>
                <div className="stat-desc">Your collections</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <div className="stat-title">Success Rate</div>
                <div className="stat-value text-2xl">0%</div>
                <div className="stat-desc">Submission accuracy</div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="stat-title">Email</div>
                <div className="stat-value text-lg break-all">{authUser?.email || "No email"}</div>
              </div>
              
              {/* User ID */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title">User ID</div>
                <div className="stat-value text-sm break-all">{authUser?.id || "No ID"}</div>
              </div>
              
              {/* Role Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="stat-title">Role</div>
                <div className="stat-value text-lg">{authUser?.role || "USER"}</div>
                <div className="stat-desc">
                  {authUser?.role === "ADMIN" ? "Full system access" : "Limited access"}
                </div>
              </div>
              
              {/* Profile Image Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Image className="w-8 h-8" />
                </div>
                <div className="stat-title">Profile Image</div>
                <div className="stat-value text-lg">
                  {authUser?.image ? "Uploaded" : "Not Set"}
                </div>
                <div className="stat-desc">
                  {authUser?.image ? "Image available" : "Upload a profile picture"}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-outline btn-primary" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button className="btn btn-primary">Change Password</button>
            </div>
          </div>
        </div>
        
        <ProfileSubmission/>
        <ProblemSolvedByUser/>
        <PlaylistProfile/>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-base-300">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Profile Image URL</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={editForm.image}
                  onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => {
                  // TODO: Implement profile update API call
                  alert("Profile update functionality coming soon!");
                  setIsEditModalOpen(false);
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;