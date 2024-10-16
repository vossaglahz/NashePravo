import { useEffect, useRef, useState } from 'react';
import {
    Button,
    Checkbox,
    Fade,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popper,
    Rating,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useAppSelector } from '../../store/store';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { PreviewImg } from './PreviewImg/PreviewImg';
import { AlertComponent } from '../UI/Alert/Alert';
import { useGetPublishedDocsQuery, usePostDocsMutation } from '../../store/api/document.api';
import { useEditLawyerMutation } from '../../store/api/user.api';
import './Profile.scss';

type TInfo = {
    name: string | undefined;
    surname: string | undefined;
    patronymicName: string | undefined;
    photo: string | undefined;
    lawyerType: string | undefined;
    role: string | undefined;
    caseCategories: string[] | undefined;
    documents: File[] | undefined;
    avgRating: number
};

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '1px solid #000',
//     boxShadow: 24,
//     p: 4,
//     color: 'black',
// };

const abc = [
    { ru: 'Уголовный', en: 'Criminal' },
    { ru: 'Гражданский', en: 'Civil' },
    { ru: 'Корпоративный', en: 'Corporate' },
];

export const Profile = () => {
    const { user, lawyer } = useAppSelector(state => state.users);
    const [info, setInfo] = useState<TInfo>({
        name: '',
        surname: '',
        patronymicName: '',
        photo: '',
        lawyerType: '',
        role: '',
        caseCategories: [''],
        avgRating: 0,
        documents: [],
    });
    const [activity, setActivity] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSave, setIsSave] = useState(true);
    const inputRefDoc = useRef<HTMLInputElement>(null);
    const inputRefMainImage = useRef<HTMLInputElement>(null);
    const [editLawyer, { isError: editLawyerError, isSuccess: editLawyerSuccess }] = useEditLawyerMutation();
    // const [changePassword, { isError: changePasswordError, isSuccess: changePasswordSuccess, error: changePasswordErrorMessage }] =
    //     useChangePasswordMutation();

    const [postDocs] = usePostDocsMutation();
    const { data } = useGetPublishedDocsQuery('');
    const [changeMainPhotoLocally, setChangeMainPhotoLocally] = useState<string>('');
    // const [open, setOpen] = useState(false);
    // const [password, setPassword] = useState({
    //     currentPassword: '',
    //     newPassword: '',
    //     confirmNewPassword: '',
    // });

    useEffect(() => {
        setInfo({
            ...info,
            name: user.name || lawyer.name,
            surname: user.surname || lawyer.surname,
            photo: user.photo || lawyer.photo,
            lawyerType: lawyer.lawyerType,
            role:user.role || lawyer.role,
            avgRating: lawyer.avgRating || 0,
            patronymicName: user.patronymicName || lawyer.patronymicName,
            caseCategories: lawyer.caseCategories && JSON.parse(lawyer.caseCategories),
        });
    }, [user, lawyer, data]);

    useEffect(() => {
        if (info.caseCategories) {
            setActivity(info.caseCategories);
        }
    }, [info.caseCategories]);

    useEffect(() => {
        if (data && data.image.length > 0) {
            const fetchedImages = data.image.map((imageName: string) => `${imageName}`);
            setInfo({
                ...info,
                documents: fetchedImages,
            });
            setPreviews(fetchedImages);
        }
    }, [data]);

    const onFileChangeDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files) {
            const files = Array.from(e.target.files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

            setInfo(prevState => ({
                ...prevState,
                documents: [...prevState.documents!, ...files],
            }));
            setIsSave(false);
        }
    };

    const onFileChangeMainPhoto = (e: React.ChangeEvent<HTMLInputElement>, popupState: any) => {
        if (e?.target?.files?.[0]) {
            const file = e.target.files[0];
            setChangeMainPhotoLocally(URL.createObjectURL(file));
            setInfo(prevState => ({
                ...prevState,
                [e.target.name]: file,
            }));
            setIsSave(false);
            popupState.close();
        }
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
        setIsSave(false);
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formDataLawyer = new FormData();
        formDataLawyer.append('name', info.name || '');
        formDataLawyer.append('surname', info.surname || '');
        formDataLawyer.append('patronymicName', info.patronymicName || '');
        formDataLawyer.append('lawyerType', info.lawyerType || '');
        formDataLawyer.append('caseCategories', JSON.stringify(info.caseCategories));
        formDataLawyer.append('photo', info.photo || '');

        const formDataDocs = new FormData();
        info?.documents?.forEach((image) => {
            if (typeof image === 'string') {
                formDataDocs.append(`documents`, image);
            } else if (image instanceof File) {
                formDataDocs.append(`documents`, image);
            }
        });
        formDataDocs.append('lawyerId', lawyer.id!.toString());

        await editLawyer({ data: formDataLawyer });
        await postDocs({ data: formDataDocs });
        setIsSave(true);
    };

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setActivity(value as string[]);
        setInfo({ ...info, caseCategories: value as string[] });
        setIsSave(false);
    };

    const onDeleteDoc = (index: number) => {
        setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        setInfo(prevState => ({
            ...prevState,
            documents: prevState.documents?.filter((_, i) => i !== index),
        }));
        setIsSave(false);
    };

    // const savePassword = async () => {
    //     await changePassword({ data: password });
    //     setOpen(false);
    // };

    return (
        <form onSubmit={onSubmitHandler} className="profile">
            <AlertComponent isError={editLawyerSuccess} text={'Измененные данные вступят в силу после проверки модерации!'} status={'success'} />
            <AlertComponent isError={editLawyerError} text={'Ошибка'} status={'error'} />
            <div className="container">
                {
                    Object.entries(lawyer).length === 0?"":
                    <div className="profile__inner">
                    <h2>Профиль</h2>
                    <div className="profile__info">
                        <PopupState variant="popper" popupId="demo-popup-popper">
                            {popupState => (
                                <div>
                                    <Button variant="text" {...bindToggle(popupState)}>
                                        <div className="profile__info-image">
                                            <img
                                                src={
                                                    info.photo
                                                        ? changeMainPhotoLocally
                                                            ? changeMainPhotoLocally
                                                            : `http://localhost:8000/uploads/${info.photo}`
                                                        : '../no-image.png'
                                                }
                                                alt="profile-photo"
                                            />
                                            <img className="profile__info-hiddenImage" src="../src/assets/camera.png" alt="camera-img" />
                                        </div>
                                    </Button>
                                    <Popper {...bindPopper(popupState)} transition placement="left">
                                        {({ TransitionProps }) => (
                                            <Fade {...TransitionProps} timeout={350}>
                                                <Paper className="paper__content">
                                                    <Button onClick={() => inputRefMainImage.current?.click()} variant="text" size="small">
                                                        Изменить фотографию
                                                    </Button>
                                                    <input
                                                        ref={inputRefMainImage}
                                                        type="file"
                                                        onChange={e => onFileChangeMainPhoto(e, popupState)}
                                                        name="photo"
                                                        style={{ display: 'none' }}
                                                        accept="image/*"
                                                    />
                                                    <Button
                                                        onClick={() => {
                                                            setInfo({ ...info, photo: '' });
                                                            popupState.close();
                                                        }}
                                                        variant="text"
                                                        size="small"
                                                        color="error"
                                                    >
                                                        Удалить фотографию
                                                    </Button>
                                                </Paper>
                                            </Fade>
                                        )}
                                    </Popper>
                                </div>
                            )}
                        </PopupState>
                        <div className="profile__info-content">
                            <label>
                                <p>
                                    Имя <span>*</span>
                                </p>
                                <input onChange={onChangeHandler} defaultValue={info.name} name="name" type="text" />
                            </label>
                            <label>
                                <p>
                                    Фамилия <span>*</span>
                                </p>
                                <input onChange={onChangeHandler} defaultValue={info.surname} name="surname" type="text" />
                            </label>
                            <label>
                                <p>Отчество</p>
                                <input onChange={onChangeHandler} defaultValue={info.patronymicName} name="patronymicName" type="text" />
                            </label>
                        </div>
                    </div>
                    {info.role === 'user' ? null : <>
                    <div className="profile__types">
                        <div>
                            <div className="profile__types-lawyer">
                            <p>
                                Ваша деятельность:
                                {Array.isArray(info.caseCategories) ? (
                                    info.caseCategories.map(value => abc.find(category => category.en === value)?.ru).join(', ')
                                ) : (
                                    <h1>{info.caseCategories && 'asdsad'}</h1>
                                )}
                            </p>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Тип</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={activity}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={selected =>
                                        abc
                                            .filter(category => selected.includes(category.en))
                                            .map(category => category.ru)
                                            .join(', ')
                                    }
                                >
                                    {abc.map(category => (
                                        <MenuItem key={category.en} value={category.en}>
                                            <Checkbox checked={activity.includes(category.en)} />
                                            <ListItemText primary={category.ru} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            </div>
                            <div className="profile__types-lawyer">
                            <p>Ваш тип юр. лица: {info.lawyerType}</p>
                            <FormControl sx={{ width: 300 }}>
                                <InputLabel id="demo-simple-select-label">Тип</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={info.lawyerType}
                                    label="lawyerType"
                                    name="lawyerType"
                                    onChange={onChangeHandler}
                                >
                                    <MenuItem value={'ТОО'}>ТОО</MenuItem>
                                    <MenuItem value={'АО'}>АО</MenuItem>
                                    <MenuItem value={'ИП'}>ИП</MenuItem>
                                </Select>
                            </FormControl>
                            </div>                                
                        </div>
                        <div className='rating'>
                            <h2>Рейтинг:  <h1>{info.avgRating.toFixed(1)}</h1></h2>
                            {
                                info.avgRating === 0? 
                                <Rating name="half-rating-read" size="large" value={info.avgRating} precision={0.5} readOnly />
                                :
                                <Rating name="half-rating-read" size="large" value={info.avgRating} precision={0.5} readOnly />
                            
                            }
                        </div>
                    </div>
                    <div className="profile__docs">
                        <h2>Мои документы</h2>
                        <div className="profile__docs-bg">
                            <input
                                ref={inputRefDoc}
                                type="file"
                                onChange={onFileChangeDocument}
                                name="documents"
                                style={{ display: 'none' }}
                                accept=".pdf, image/*"
                            />
                            {previews.length > 0
                                ? previews.map((item, index) => <PreviewImg key={index} src={item} onDelete={() => onDeleteDoc(index)} />)
                                : 'Нету документов'}

                            {previews.length < 5 && (
                                <button type="button" onClick={() => inputRefDoc.current?.click()} className="profile__docs-btn">
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                    {/* <Button onClick={() => setOpen(true)}>Поменять пароль</Button>
                    <AlertComponent
                        isError={changePasswordError}
                        text={(changePasswordErrorMessage as any)?.data?.message || 'Произошла ошибка'}
                        status={'error'}
                    />
                    <AlertComponent isError={changePasswordSuccess} text={'Пароль успешно изменен'} status={'success'} />
                    <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box className="box" sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Смена пароля
                            </Typography>
                            <label>
                                <p>Старый пароль</p>
                                <input onChange={e => setPassword({ ...password, currentPassword: e.target.value })} type="text" />
                            </label>
                            <label>
                                <p>Новый пароль</p>
                                <input onChange={e => setPassword({ ...password, newPassword: e.target.value })} type="text" />
                            </label>
                            <label>
                                <p>Повторите новый пароль</p>
                                <input onChange={e => setPassword({ ...password, confirmNewPassword: e.target.value })} type="text" />
                            </label>
                            <Button onClick={savePassword}>Сохранить изменения</Button>
                        </Box>
                    </Modal> */}
                    <div className="btnSubmit">
                        <button type="submit" disabled={isSave}>
                            Сохранить
                        </button>
                    </div>
                    </>}
                </div>
                }
            </div>
        </form>
    );
};
