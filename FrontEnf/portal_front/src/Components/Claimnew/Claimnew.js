import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Claimnew.css';

export default function Claimnew({ show, setshow, user }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [id, setId] = useState(null);
    const [img, setImg] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [type, setType] = useState(null);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const Type = [
        { label: "Travelling", value: 1 },
        { label: "Electronics", value: 2 },
        { label: "Relocation", value: 3 }
    ];

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        setFile(file);

        if (file && file.type === 'image/jpeg') {
            setMessage('');
        } else {
            setMessage('Only JPG files are allowed');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file');
            return;
        }

        const obj = new Date(date)
        const d = obj.toISOString().split('T')[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type.label);
        formData.append("empId", user.empid);
        formData.append("amt", amount);
        formData.append("date", d);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            const jsonData = await response.json();
            setId(jsonData.id);
            setMessage('File uploaded successfully!');
        } catch (error) {
            console.error('Error:', error);
            setMessage('File upload failed');
        }
    };

    const checkAmount = () => {
        let limit = 0;

        if (type) {
            if (type.label === "Travelling") {
                limit = 2000;
            } else if (type.label === "Electronics") {
                limit = 1500;
            } else if (type.label === "Relocation") {
                limit = 1000;
            }

            if (amount > limit) {
                alert(`Amount exceeds the limit of ${limit} for ${type.label}`);
                setAmount('');
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        } else {
            alert("Select Claim Type first");
        }
    };

    const changeType = option => {
        setType(option);
        setAmount('');
        setIsDisabled(true);
    };

    useEffect(() => {
        if (amount) {
            checkAmount();
        }
    }, [amount, type]);

    const customStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "#FFFFFF",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? "#e2e2e2" : "",
            color: state.isFocused ? "#333333" : "#FFFFFF",
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "#333333",
            color: "#000000",
        }),
    };

    const back = () => {
        setshow(false);
    };

    return (
        <div className="dialog-container">
            <div className="dialog-box">
                <div className="dialog-header">
                    <h2>Claim new</h2>
                    <button className="close-button" onClick={e =>back()}>&times;</button>
                </div>
                <div>
                    {/* <p>Employee ID: {user.empid}</p> */}
                    <p><h3>Username:</h3><h4> {user.username}</h4></p>
                </div>
                <div className='form-group'>
                    <Select
                        styles={customStyles}
                        placeholder={"Select Claim Type"}
                        options={Type}
                        className='select-container'
                        value={type}
                        onChange={changeType}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='number'
                        className='amountvalue'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder='Enter Claim Amount'
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='date'
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileInput}
                        accept=".jpg, .jpeg"
                        required
                    />
                </div>
                {img && <img src={img} alt="Uploaded" />}
                {message && <p>{message}</p>}
                <div className='form-group'>
                    {!isDisabled && (
                        <button className="Upload-button" type="submit" onClick={handleSubmit}>Upload</button>
                    )}
                </div>
                <div className='form-group'>
                    {/* <button className="Back-button" onClick={back}>Back</button> */}
                    {/* <button className="Register-button" disabled={isDisabled}>Claim</button> */}
                </div>
            </div>
        </div>
    );
}
