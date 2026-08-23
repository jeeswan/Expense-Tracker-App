import React, {useRef} from 'react'

const ProfilePhotoSelector = ({image, setImage}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
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
  }
  
    return (
    <div>
      
    </div>
  )
}

export default ProfilePhotoSelector
