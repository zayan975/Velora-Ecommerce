"use client"
import React, { useState } from 'react'
import Upload from "@/components/Upload";

const Page = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        images,
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Upload</h1>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

      <Upload onImagesUploaded={setImages} />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {images.map((url, idx) => (
          <img key={idx} src={url} alt="uploaded" width={80} height={80} />
        ))}
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Create Product
      </button>
    </div>
  );
};

export default Page;