import { ChangeEvent, FormEvent, useState } from "react";
import "./RatingDeal.scss";
import { TypedMutationTrigger } from '@reduxjs/toolkit/query/react';
import { Box, Button, FormControl, Grid2, MenuItem, Select, SelectChangeEvent, TextareaAutosize } from "@mui/material";

interface RatingDealData {
    data: {
        id: number;
        description: string;
        assessment: number;
    }
}

interface RatingDealModalProps {
  closeModal: () => void;
  rating: TypedMutationTrigger<{ data: any }, RatingDealData, any>; 
  dealId: number;
}



export const RatingDeal = ({ closeModal, rating, dealId }: RatingDealModalProps) => {
    const [isSave, setIsSave] = useState<boolean>(true)
  const [ratingDeal, setRatingDeal] = useState({
    id: dealId,
    description: '',
    assessment: 5,
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
    await rating({ data: ratingDeal });
    console.log(ratingDeal);
    closeModal();
  };

  const inputHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    if (name === 'description') {
        setRatingDeal((prevMessage) => {
          const updatedDeal = { ...prevMessage, [name]: value };
          setIsSave(updatedDeal.description.trim() === '');
          return updatedDeal;
        });
    } else {
        setRatingDeal((prevMessage) => {
        const updatedDeal = { ...prevMessage, [name]: value };
        setIsSave(updatedDeal.description.trim() === '');
        return updatedDeal;
      });
    }
  };


  return (
    <>
    <Box className="modal" component={'form'} autoComplete="off" onSubmit={submitHandleForm} sx={style} >
      <Grid2 container direction="column" spacing={2}>
        <Grid2>
          <h3 className="input-title">Ваш отзыв <span>*</span> :</h3>
          <TextareaAutosize
            className="description-textarea"
            id="description"
            value={ratingDeal.description}
            onChange={inputHandleChange}
            name="description"
            minRows={4}
          />
        </Grid2>
        <Grid2 className="grid-wrap">
        <Grid2>
            <h3 className="input-title">Оценка</h3>
            <FormControl>
              <Select
                className="deal-type-select"
                value={ratingDeal.assessment.toString()}
                onChange={inputHandleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                name="assessment"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
        <Grid2>
          <Button 
          className="create-deal-button" type="submit" color="primary" variant="contained" disabled={isSave}
          sx={{'&.Mui-disabled': {backgroundColor: '#9abade', color: '#9abade',}}}>
            Отправить
          </Button>
        </Grid2>
      </Grid2>
    </Box>
    </>  
  );
};