"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

const ProductImageUpload = ({ onImagesUploaded }) => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const fileInputRef = useRef(null);

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    // Ab multiple files handle karega
    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select file(s) to upload");
            return;
        }

        const files = Array.from(fileInput.files);
        setUploading(true);

        try {
            // Har file ke liye alag auth params (ek hi token reuse nahi hota)
            const uploadPromises = files.map(async (file) => {
                const { signature, expire, token, publicKey } = await authenticator();

                const abortController = new AbortController();

                const uploadResponse = await upload({
                    expire,
                    token,
                    signature,
                    publicKey,
                    file,
                    fileName: file.name,
                    folder: "/products", // organize rakhne ke liye
                    onProgress: (event) => {
                        setProgress((event.loaded / event.total) * 100);
                    },
                    abortSignal: abortController.signal,
                });

                return uploadResponse.url; // sirf url chahiye, poora object nahi
            });

            const urls = await Promise.all(uploadPromises);

            setUploadedUrls((prev) => [...prev, ...urls]);
            onImagesUploaded([...uploadedUrls, ...urls]); // parent form ko batao
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <input type="file" ref={fileInputRef} multiple accept="image/*" />
            <button type="button" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Images"}
            </button>
            <br />
            {uploading && <progress value={progress} max={100}></progress>}

            {/* Preview uploaded images */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {uploadedUrls.map((url, idx) => (
                    <img key={idx} src={url} alt="uploaded" width={80} height={80} />
                ))}
            </div>
        </>
    );
};

export default ProductImageUpload;