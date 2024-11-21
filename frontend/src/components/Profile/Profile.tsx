import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
    TextareaAutosize,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { PreviewImg } from './PreviewImg/PreviewImg';
import { AlertComponent } from '../UI/Alert/Alert';
import { useGetPublishedDocsQuery, usePostDocsMutation } from '../../store/api/document.api';
import { useEditLawyerMutation, useDeletePhotoMutation } from '../../store/api/user.api';
import { useTranslation } from 'react-i18next';
import { setLoading } from '../../store/slice/auth.slice';
import './Profile.scss';

type TInfo = {
    name: string | undefined;
    surname: string | undefined;
    patronymicName: string | undefined | null;
    photo: string | undefined | null;
    lawyerType: string | undefined;
    role: string | undefined;
    caseCategories: string[] | undefined;
    documents: File[] | undefined;
    avgRating: number;
    city: string;
    about: string;
};

const kazakhstanCities = ['Алматы', 'Нур-Султан', 'Шымкент', 'Актобе', 'Караганда', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Атырау', 'Костанай'];

const abc = [
    { id: 'criminal', ru: 'Уголовный', kz: 'Қылмыстық' },
    { id: 'civil', ru: 'Гражданский', kz: 'Азаматтық' },
    { id: 'corporate', ru: 'Корпоративный', kz: 'Корпоративтік' },
];

export const Profile = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
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
        about: '',
        city: '',
    });
    const [activity, setActivity] = useState<string[]>([]);
    const [previews, setPreviews] = useState<{ src: string; name: string }[]>([]);
    const [isSave, setIsSave] = useState(true);
    const inputRefDoc = useRef<HTMLInputElement>(null);
    const inputRefMainImage = useRef<HTMLInputElement>(null);
    const [editLawyer, { isError: editLawyerError, isSuccess: editLawyerSuccess }] = useEditLawyerMutation();
    const [deletePhoto, { isError: deletePhotoError, isSuccess: deletePhotoSuccess }] = useDeletePhotoMutation();

    const [postDocs] = usePostDocsMutation();
    const { data } = useGetPublishedDocsQuery('');
    const [changeMainPhotoLocally, setChangeMainPhotoLocally] = useState<string>('');

    console.log('data: ', data);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('i18nextLng');
        if (storedLanguage && i18n.language !== storedLanguage) {
            i18n.changeLanguage(storedLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        dispatch(setLoading(true));
        setInfo({
            ...info,
            name: user.name || lawyer.name,
            surname: user.surname || lawyer.surname,
            photo: user.photo || lawyer.photo,
            lawyerType: lawyer.lawyerType,
            role: user.role || lawyer.role,
            avgRating: lawyer.avgRating || 0,
            patronymicName: user.patronymicName || lawyer.patronymicName,
            caseCategories: lawyer.caseCategories && JSON.parse(lawyer.caseCategories),
            city: lawyer.city || '',
            about: lawyer.about || '',
        });
        dispatch(setLoading(false));
    }, [user, data]);

    useEffect(() => {
        if (info.caseCategories) {
            setActivity(info.caseCategories);
        }
    }, [info.caseCategories]);

    useEffect(() => {
        if (data && data.image.length > 0 && Array.isArray(data.image)) {
            const fetchedImages = data.image.map((imageObj: { src: string; name: string }) => ({
                src: imageObj.src,
                name: imageObj.name,
            }));
            console.log('fetchedImages: ', fetchedImages);

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
            const newPreviews = files.map(file => ({
                src: URL.createObjectURL(file),
                name: file.name,
            }));

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

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string> | ChangeEvent<HTMLTextAreaElement>) => {
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
        formDataLawyer.append('about', info.about);
        formDataLawyer.append('city', info.city);

        const formDataDocs = new FormData();
        info?.documents?.forEach(image => {
            if (typeof image === 'string') {
                formDataDocs.append('documents', image);
            } else if (image instanceof File) {
                formDataDocs.append('documents', image);
            }
        });
        formDataDocs.append('lawyerId', user.id!.toString());
        const filteredDocuments = previews.filter(doc => !doc.src.startsWith('blob'));
        formDataDocs.append('prevDocs', JSON.stringify(filteredDocuments));

        await editLawyer(formDataLawyer);
        await postDocs({ data: formDataDocs });
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

    const deletePhotoHandler = async (popupState: any) => {
        setInfo({ ...info, photo: '' });
        await deletePhoto({});
        popupState.close();
    };

    const storedLanguage = localStorage.getItem('i18nextLng');
    console.log('previews: ', previews);

    return (
        <form onSubmit={onSubmitHandler} className="profile">
            <AlertComponent isError={editLawyerSuccess} text={'Измененные данные вступят в силу после проверки модерации!'} status={'success'} />
            <AlertComponent isError={editLawyerError} text={'Ошибка'} status={'error'} />
            <AlertComponent isError={deletePhotoSuccess} text={'Фото будет удалено после проверки модерации!'} status={'success'} />
            <AlertComponent isError={deletePhotoError} text={'Ошибка'} status={'error'} />
            <div className="container">
                {Object.entries(lawyer).length === 0 ? (
                    ''
                ) : (
                    <div className="profile__inner">
                        <h2>{t('Cabinet.profile')}</h2>
                        <div className="profile__info">
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {popupState => (
                                    <div className="profile__info-inner">
                                        <Button variant="text" {...bindToggle(popupState)}>
                                            <div className="profile__info-image">
                                                <img
                                                    src={
                                                        info.photo
                                                            ? changeMainPhotoLocally
                                                                ? changeMainPhotoLocally
                                                                : `${import.meta.env.VITE_API_BASE_URL}/uploads/${info.photo}`
                                                            : `${import.meta.env.VITE_API_BASE_URL}/static/no-image.png`
                                                    }
                                                    alt="profile-photo"
                                                />
                                                <img className="profile__info-hiddenImage" src={`${import.meta.env.VITE_API_BASE_URL}/static/camera.png`} alt="camera-img" />
                                            </div>
                                        </Button>
                                        <Popper {...bindPopper(popupState)} transition placement="left">
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <Paper className="paper__content">
                                                        <Button onClick={() => inputRefMainImage.current?.click()} variant="text" size="small">
                                                            {t('Cabinet.changePhoto')}
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
                                                                deletePhotoHandler(popupState);
                                                            }}
                                                            variant="text"
                                                            size="small"
                                                            color="error"
                                                        >
                                                            {t('Cabinet.deletePhoto')}
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
                                        {t('Cabinet.name')} <span>*</span>
                                    </p>
                                    <input onChange={onChangeHandler} defaultValue={info.name} name="name" type="text" />
                                </label>
                                <label>
                                    <p>
                                        {t('Cabinet.surname')} <span>*</span>
                                    </p>
                                    <input onChange={onChangeHandler} defaultValue={info.surname} name="surname" type="text" />
                                </label>
                                <label>
                                    <p>{t('Cabinet.patrName')}</p>
                                    <input onChange={onChangeHandler} defaultValue={info.patronymicName??""} name="patronymicName" type="text" />
                                </label>
                            </div>
                        </div>
                        {info.role === 'user' ? null : (
                            <>
                                <div className="profile__types">
                                    <div className="profile__types-inner">
                                        <div className="profile__types-lawyer">
                                            <p>
                                                {t('Cabinet.activity')}:
                                                {Array.isArray(info.caseCategories) ? (
                                                    storedLanguage === 'ru' ? (
                                                        info.caseCategories.map(value => abc.find(category => category.id === value)?.ru).join(', ')
                                                    ) : (
                                                        info.caseCategories.map(value => abc.find(category => category.id === value)?.kz).join(', ')
                                                    )
                                                ) : (
                                                    <h1>{info.caseCategories && 'asdsad'}</h1>
                                                )}
                                            </p>
                                            <FormControl sx={{ width: 300 }}>
                                                <InputLabel id="demo-multiple-checkbox-label">{t('Cabinet.label')}</InputLabel>
                                                <Select
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    value={activity}
                                                    onChange={handleChange}
                                                    input={<OutlinedInput label="Tag" />}
                                                    renderValue={selected =>
                                                        abc
                                                            .filter(category => selected.includes(category.id))
                                                            .map(category => (storedLanguage === 'ru' ? category.ru : category.kz))
                                                            .join(', ')
                                                    }
                                                >
                                                    {abc.map(category => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            <Checkbox checked={activity.includes(category.id)} />
                                                            <ListItemText primary={storedLanguage === 'ru' ? category.ru : category.kz} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="profile__types-lawyer">
                                            <p>
                                                {t('Cabinet.type')}: {info.lawyerType}
                                            </p>
                                            <FormControl sx={{ width: 300 }}>
                                                <InputLabel id="demo-simple-select-label">{t('Cabinet.label')}</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={info.lawyerType}
                                                    label="lawyerType"
                                                    name="lawyerType"
                                                    onChange={onChangeHandler}
                                                >
                                                    <MenuItem value={t('Cabinet.typeSelect.type1')}>{t('Cabinet.typeSelect.type1')}</MenuItem>
                                                    <MenuItem value={t('Cabinet.typeSelect.type2')}>{t('Cabinet.typeSelect.type2')}</MenuItem>
                                                    <MenuItem value={t('Cabinet.typeSelect.type3')}>{t('Cabinet.typeSelect.type3')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        <h2>
                                            {t('Cabinet.rating')}: <h1>{info.avgRating.toFixed(1)}</h1>
                                        </h2>
                                        {info.avgRating === 0 ? (
                                            <Rating name="half-rating-read" size="large" value={info.avgRating} precision={0.5} readOnly />
                                        ) : (
                                            <Rating name="half-rating-read" size="large" value={info.avgRating} precision={0.5} readOnly />
                                        )}
                                    </div>
                                </div>
                                <label>
                                    <p>О себе:</p>
                                    <TextareaAutosize
                                        className="Profile__about"
                                        minRows={3}
                                        maxRows={4}
                                        value={info.about}
                                        placeholder="Расскажите немного о том какие услуги вы можете предоставить для людей"
                                        name="about"
                                        onChange={onChangeHandler}
                                        style={{ width: '100%', maxHeight: '6em' }}
                                    />
                                </label>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Ваш город:</InputLabel>
                                    <Select name="city" value={info.city} onChange={onChangeHandler} label={t('Cabinet.city')}>
                                        {kazakhstanCities.map(city => (
                                            <MenuItem key={city} value={city}>
                                                {city}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <div className="profile__docs">
                                    <h2>{t('Cabinet.docs')}</h2>
                                    <div className="profile__docs-bg">
                                        <input
                                            ref={inputRefDoc}
                                            type="file"
                                            onChange={onFileChangeDocument}
                                            name="documents"
                                            style={{ display: 'none' }}
                                            accept=".pdf"
                                        />
                                        {previews.length > 0
                                            ? previews.map((item, index) => (
                                                  <PreviewImg key={index} src={item.src} onDelete={() => onDeleteDoc(index)} name={item.name} />
                                              ))
                                            : t('Cabinet.absent')}

                                        {previews.length < 5 && (
                                            <button type="button" onClick={() => inputRefDoc.current?.click()} className="profile__docs-btn">
                                                +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="btnSubmit">
                            <button type="submit" disabled={isSave}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};
