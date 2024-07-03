"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
interface BookFormProps {
  onClose: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description || !publishDate || price === '') {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/books', {
        name,
        description,
        publishDate,
        price,
      });

      setName('');
      setDescription('');
      setPublishDate('');
      setPrice('');
      setError(null);
      alert('Book added successfully');
      onClose(); 
    } catch (error: any) {
      console.error('There was an error adding the book!', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Failed to add book');
    }
  };

  return (
    <div className="p-fluid">
      <h1>Add a New Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="name">Name:</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter book name"
          />
        </div>
        <div className="p-field">
          <label htmlFor="description">Description:</label>
          <InputTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter book description"
          />
        </div>
        <div className="p-field">
          <label htmlFor="publishDate">Publish Date:</label>
          <InputText
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>
        <div className="p-field">
          <label htmlFor="price">Price:</label>
          <InputNumber
            id="price"
            value={price}
            onValueChange={(e) => setPrice(e.value || '')}
            mode="decimal"
            min={0}
            placeholder="Enter book price"
          />
        </div>
        <Button type="submit" label="Add Book" />
      </form>
    </div>
  );
};

export default BookForm;
