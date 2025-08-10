import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000"; // or your getBaseUrl()

const Profile = () => {
  const auth = useAuth();
  if (!auth) return null;

  const { user, accessToken, setUser } = auth;
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Placeholder from initials if no avatar
  const placeholder = useMemo(() => {
    const name = user?.name || user?.email || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=edf2f7&color=2d3748`;
  }, [user]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate type
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG/PNG).");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    // Validate size (5MB)
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFile(f);
    toast.success("Image selected. Ready to upload ✅");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pick an image first.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      const form = new FormData();
      form.append("avatar", file);

      const res = await axios.post(`${API_URL}/api/users/me/avatar`, form, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        if (setUser) setUser((prev) => ({ ...prev, ...res.data.user }));
        setFile(null);
        setPreviewUrl("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Avatar updated ✅", { id: toastId });
      } else {
        toast.error(res.data?.message || "Upload failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove your avatar?")) return;

    setLoading(true);
    const toastId = toast.loading("Removing avatar...");

    try {
      const res = await axios.delete(`${API_URL}/api/users/me/avatar`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        if (setUser) setUser((prev) => ({ ...prev, ...res.data.user }));
        setFile(null);
        setPreviewUrl("");
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Avatar removed ✅", { id: toastId });
      } else {
        toast.error(res.data?.message || "Failed to remove avatar", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove avatar", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar =
    previewUrl || user?.avatarUrl || user?.avatar || placeholder;

  return (
    <div className="container py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: 520 }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">👤 Your Profile</h3>

          {user ? (
            <>
              {/* Avatar */}
              {/* Avatar — centered */}
<div className="d-flex justify-content-center mb-3">
  <img
    src={displayAvatar}
    alt="Avatar"
    width="112"
    height="112"
    className="rounded-circle border d-block mx-auto"
    style={{ objectFit: "cover" }}
  />
</div>


              {/* Meta */}
              <div className="text-center mb-4">
                <p className="mb-1">
                  <strong>Email:</strong> {user.email}
                </p>
                {user.name && (
                  <p className="mb-0">
                    <strong>Name:</strong> {user.name}
                  </p>
                )}
              </div>

              {/* Uploader */}
              <div className="mb-3">
                <label className="form-label">Upload new avatar</label>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  disabled={loading}
                  className="form-control"
                />
                <div className="form-text">
                  JPG/PNG up to 5MB. The image will be cropped to a square.
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Uploading...
                    </>
                  ) : (
                    "Upload avatar"
                  )}
                </button>

                {(user?.avatarUrl || user?.avatar) && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={loading}
                    className="btn btn-outline-danger"
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Please wait...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-danger mb-0">
              No user data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
