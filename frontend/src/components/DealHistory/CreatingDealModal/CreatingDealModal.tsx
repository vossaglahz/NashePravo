import { ChangeEvent, FormEvent, useState } from "react";
import { Box } from "@mui/system";
import { Button, Checkbox, FormControl, FormControlLabel, Grid2, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField } from "@mui/material";
import "./CreatingDealModal.scss";
import { TypedMutationTrigger } from '@reduxjs/toolkit/query/react';

interface NewDealData {
  title: string;
  description: string;
  price: number;
  type: string;
}

interface CreatingDealModalProps {
  closeModal: () => void;
  createDeal: TypedMutationTrigger<{ data: any }, NewDealData, any>; 
}



export const CreatingDealModal = ({ closeModal, createDeal }: CreatingDealModalProps) => {

  const [checked, setChecked] = useState(false);
  const [isSave, setIsSave] = useState(true);
  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: '#fff',
    border: '1px solid #ccc',
    boxShadow: 24,
    padding: 4,
    borderRadius: 2
  };


  const submitHandleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createDeal({...newDeal, price: parseFloat(newDeal.price)});
    closeModal();
  };

  const inputHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    if (name === 'price') {
      if (/^\d*\.?\d*$/.test(value)) {
        setNewDeal((prevMessage) => {
          const updatedDeal = { ...prevMessage, [name]: value };
          setIsSave(updatedDeal.title.trim() === '' || updatedDeal.description.trim() === '' || updatedDeal.price.trim() === '');
          return updatedDeal;
        });
      }
    } else {
      setNewDeal((prevMessage) => {
        const updatedDeal = { ...prevMessage, [name]: value };
        setIsSave(updatedDeal.title.trim() === '' || updatedDeal.description.trim() === '' || updatedDeal.price.trim() === '');
        return updatedDeal;
      });
    }
  };
    
  const checkboxHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setNewDeal((prevMessage) => {
        const updatedDeal = { ...prevMessage, price: '0' };
        setIsSave(updatedDeal.title.trim() === '' || updatedDeal.description.trim() === '' || updatedDeal.price.trim() === '');
        return updatedDeal;
      });
    }
  };

  return (
    <>
    <Box className="modal" component={'form'} autoComplete="off" onSubmit={submitHandleForm} sx={style} >
      <Grid2 container direction="column" spacing={2}>
        <Grid2>
          <h3 className="input-title">Тема <span>*</span> :</h3>
          <TextField
            fullWidth
            variant="outlined"
            id="titpe"
            value={newDeal.title}
            onChange={inputHandleChange}
            name="title"
          />
        </Grid2>
        <Grid2>
          <h3 className="input-title">Ваш вопрос <span>*</span> :</h3>
          <TextareaAutosize
            className="description-textarea"
            id="description"
            value={newDeal.description}
            onChange={inputHandleChange}
            name="description"
            minRows={4}
          />
        </Grid2>
        <Grid2 className="grid-wrap">
        <Grid2>
            <h3 className="input-title">Тип:</h3>
            <FormControl>
              <Select
                className="deal-type-select"
                value={newDeal.type}
                onChange={inputHandleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                name="type"
              >
                <MenuItem value={'Criminal'}>Уголовный</MenuItem>
                <MenuItem value={'Civil'}>Гражданский</MenuItem>
                <MenuItem value={'Corporate'}>Корпоративный</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2>
            <h3 className="input-title">Цена:</h3>
            <TextField
              variant="outlined"
              id="price"
              value={newDeal.price}
              onChange={inputHandleChange}
              name="price"
              disabled={checked}
            />
          </Grid2>
          <Grid2>
            <FormControlLabel
              className="price-checkbox" control={<Checkbox checked={checked} onChange={checkboxHandleChange} name="checked" />}
              label="Бесплатно"
            />
          </Grid2>
        </Grid2>
        <Grid2>
          <Button className="create-deal-button" type="submit" color="primary" variant="contained" disabled={isSave} sx={{'&.Mui-disabled': {backgroundColor: '#9abade', color: '#9abade',}}}>
            Создать
          </Button>
        </Grid2>
      </Grid2>
    </Box>
    </>
   
  );
};