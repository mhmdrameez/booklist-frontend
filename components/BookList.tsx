"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import BookForm from '../components/BookForm';

interface Book {
  _id: string;
  name: string;
  description: string;
  publishDate: string;
  price: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/books', {
        params: {
          q: search,
          page: page + 1, 
          limit: itemsPerPage,
        },
      });
      const data = response.data;
      if (Array.isArray(data.data)) {
        setBooks(data.data);
        setTotalPages(Math.ceil(data.totalItems / itemsPerPage)); 
        setTotalItems(data.totalItems);
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('There was an error fetching the books!', error);
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event: { first: number; rows: number }) => {
    setPage(event.first / itemsPerPage); 
  };

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const serialNumberTemplate = (rowData: Book, { rowIndex }: { rowIndex: number }) => (
    <>{rowIndex + 1 + page * itemsPerPage}</>
  );

  return (
    <div className="p-m-4">
      <h1 className="p-mb-4">Book List</h1>
      <div className="p-d-flex p-jc-between p-ai-center p-mb-4 p-flex-wrap">
        <div className="p-col-12 p-md-8 p-lg-9 p-d-flex p-ai-center p-pr-2">
          <InputText
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or description"
            className="p-inputtext p-component p-mr-2"
            style={{ flex: 1 }}
          />
          <Button label="Add Book" icon="pi pi-plus" onClick={openDialog} />
        </div>
      </div>
      <DataTable value={books} responsiveLayout="scroll" className="p-datatable-striped">
        <Column header="S.No" body={serialNumberTemplate} style={{ width: '4rem' }} />
        <Column field="name" header="Name" />
        <Column field="description" header="Description" />
        <Column field="publishDate" header="Publish Date" body={(rowData: Book) => new Date(rowData.publishDate).toLocaleDateString()} />
        <Column field="price" header="Price" />
      </DataTable>
      <div className="p-mt-4">
        <Paginator
          first={page * itemsPerPage}
          rows={itemsPerPage}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[10, 20, 30]}
          className="p-d-flex p-jc-between"
        />
      </div>

      <Dialog header="Add a New Book" visible={showDialog} onHide={closeDialog} style={{ width: '90vw', maxWidth: '600px' }}>
        <BookForm onClose={closeDialog} />
      </Dialog>
    </div>
  );
};

export default BookList;
