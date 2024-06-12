"use client";
import React, { useRef, useState } from "react";
import classes from "./imagePicker.module.css";
import Image from "next/image";

const ImagePicker = ({ label, name }) => {
  const [selectedFile, setSelectedFile] = useState();
  const imageRef = useRef();
  const handlePick = () => {
    imageRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    // Create a new instance of FileReader, which is used to read the contents of files
    const fileReader = new FileReader();

    // Define the onload event handler for the FileReader instance
    // This function will be called when the file has been successfully read
    fileReader.onload = () => {
      // fileReader.result contains the data URL of the read file
      // setSelectedFile is a function that will handle the data URL
      // Typically, setSelectedFile would be a state setter function in a React component
      setSelectedFile(fileReader.result);
    };

    // Start reading the provided file as a data URL
    // The data URL will contain the file's data encoded in Base64 format, prefixed with the file's MIME type
    fileReader.readAsDataURL(file);
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!selectedFile && <p>No Image Picked Yet.</p>}
          {selectedFile && (
            <Image src={selectedFile} alt="User picked image" fill />
          )}
        </div>
        <input
          className={classes.input}
          id={name}
          name={name}
          type="file"
          accept="image/png, image/jpg"
          ref={imageRef}
          onChange={handleFileChange}
          required
        />
        <button type="button" className={classes.button} onClick={handlePick}>
          Pick an image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
