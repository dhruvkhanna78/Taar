import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [imagePreview, setImagePreview] = useState(
    user?.profilePicture || ""
  );
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicture(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
    dispatch(setAuthUser(res.data.user));
    // user._id ki jagah res.data.user._id use karo taaki updated data ke hisab se navigate ho
    navigate(`/profile/${res.data.user._id}`); 
}
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Edit Profile
        </h2>

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4"
        >

          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <img
              src={imagePreview}
              alt="preview"
              className="w-16 h-16 rounded-full object-cover border"
            />

            <input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
            />
          </div>

          {/* Bio */}
          <textarea
            placeholder="Write your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded-lg p-2"
          />

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;