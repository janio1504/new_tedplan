import styled from "styled-components";

export const FormContainer = styled.div`
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #333;
      font-size: 14px;
    }

    input, textarea, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      background-color: #fff;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      &.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .btn-cancel {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #5a6268;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;

  .filter-group {
    flex: 1;
    min-width: 200px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #495057;
      font-size: 13px;
    }

    input, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      color: #495057;
      background-color: #fff;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }

    .search-input {
      background-color: #fff;
      
      &::placeholder {
        color: #6c757d;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    
    .filter-group {
      width: 100%;
      min-width: unset;
    }
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
  
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    thead {
      background-color: #f8f9fa;
      
      th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
        font-size: 14px;
      }
    }

    tbody {
      tr {
        transition: background-color 0.15s ease-in-out;

        &:hover {
          background-color: #f8f9fa;
        }

        &:not(:last-child) {
          border-bottom: 1px solid #dee2e6;
        }

        td {
          padding: 12px 15px;
          color: #495057;
          font-size: 14px;
          vertical-align: middle;

          &:last-child {
            text-align: center;
          }
        }
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    transition: all 0.2s ease-in-out;
    min-width: 60px;

    &.view {
      background-color: #17a2b8;
      color: white;

      &:hover {
        background-color: #138496;
      }
    }

    &.edit {
      background-color: #ffc107;
      color: #212529;

      &:hover {
        background-color: #e0a800;
      }
    }

    &.delete {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

export const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'active' ? `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  ` : `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
`;

export const ModalContent = styled.div`
  .modal-field {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    strong {
      display: block;
      margin-bottom: 5px;
      color: #495057;
      font-size: 14px;
    }

    p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      line-height: 1.5;
    }
  }
`;
