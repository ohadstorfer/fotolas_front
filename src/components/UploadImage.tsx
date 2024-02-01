import React, { useState, FormEvent, ChangeEvent } from 'react';

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl;
            if (selectedFile && (
                selectedFile.type === "image/png" ||
                selectedFile.type === "image/jpg" ||
                selectedFile.type === "image/jpeg"
            )) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("cloud_name", "dauupwecm");
                formData.append("upload_preset", "ntncxwfx");

                const response = await fetch(
                    "http://api.cloudinary.com/v1_1/dauupwecm/image/upload",
                    { method: "post", body: formData }
                );
                const imgData = await response.json();
                imageUrl = imgData.url.toString();
                setImagePreview(null);
            }
            alert(imageUrl);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        uploadImage(e as any); 
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="--form-control">
                <input type="file" accept="image/png,image/jpeg" name="image" onChange={handleImageChange} />
                {isLoading ? (
                    'Uploading...'
                ) : (
                    <button type="submit" className="--btn --btn-primary">
                        Upload image
                    </button>
                )}

                <div>
                    {imagePreview && (
                        <img src={imagePreview} alt='profileImg' />
                    )}
                </div>
            </form>
        </div>
    );
};

export default UploadImage;
