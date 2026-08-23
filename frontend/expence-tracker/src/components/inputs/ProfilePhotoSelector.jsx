import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {image ? (
        /* Image selected */
        <div className="relative w-20 h-20">
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -right-1 -bottom-1 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full"
          >
            <LuTrash size={14} />
          </button>
        </div>
      ) : (
        /* No image selected */
        <div className="relative w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            onClick={onChooseFile}
            className="absolute -right-1 -bottom-1 w-7 h-7 flex items-center justify-center bg-purple-600 text-white rounded-full"
          >
            <LuUpload size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
