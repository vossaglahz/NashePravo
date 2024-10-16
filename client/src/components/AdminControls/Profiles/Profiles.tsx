import { useState } from "react";
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import BlockIcon from '@mui/icons-material/Block';
import { useBlockUserMutation } from "../../../store/api/user.api";
import { AlertComponent } from "../../UI/Alert/Alert";
import { useNavigate } from "react-router-dom";
import { useGetSomeUserQuery } from "../../../store/api/admin.api";
import { ILawyer } from "../../../interfaces/Lawyer.interface";
import { IUser } from "../../../interfaces/User.interface";
import "./Profiles.scss";

export const Profiles = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isActivatedByEmail, setIsActivatedByEmail] = useState<string>("");
    const [isConfirmed, setIsConfirmed] = useState<string>("");
    const [sorted, setSorted] = useState<string>("desc");
    const [role, setRole] = useState<string>("user");
    const permanentBlock = "false"
    const [alertInfo, setAlertInfo] = useState<{ text: string, isError: boolean}>();
    const navigate = useNavigate();

    const [blockUser] = useBlockUserMutation();
    const { data, isLoading, error } = useGetSomeUserQuery({
        currentPage,
        isActivatedByEmail,
        isConfirmed,
        sorted,
        role,
        permanentBlock
    });


    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error || !data) {
        return <div>Ошибка сервера</div>;
    }
    
    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };
    
    const handleBlock = async (id: number | undefined, role: string | undefined, permanentBlocked: boolean, dateBlocked: string | null) => {
            console.log(id, role);
            const response = await blockUser({ id, role, permanentBlocked, dateBlocked });
            if (response.data?.success) {
                setAlertInfo({
                    text: `Пользователь успешно заблокирован`,
                    isError: false
                });
            } else {
                setAlertInfo({
                    text: `Пользователь не был заблокирован, повторите еще раз`,
                    isError: true
                });
            }
    };
    
    const handleSend = async (userId: number | null, lawyerId: number | null, role: string, name: string | undefined, surname: string | undefined) => {
        navigate("/adminPanel/privateNotifications", { state: { role, lawyerId, userId, name, surname } });
        console.log(lawyerId, userId);
    };

    return (
        <div className="deal-history">
            <AlertComponent isError={alertInfo?.isError === false} text={alertInfo?.text || ""} status={'success'} />
            <AlertComponent isError={alertInfo?.isError === true} text={alertInfo?.text || ""} status={'error'} />
            <div className="formSelect">
            <FormControl className="formSelectMenu">
                <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={(e) => {setRole(e.target.value); setCurrentPage(0)}}
                    >                 
                    <MenuItem value={"user"}>Люди</MenuItem>
                    <MenuItem value={"lawyer"}>Юристы</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu" sx={{marginRight: 0}}>
                <InputLabel id="demo-simple-select-label">Новые</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sorted}
                        label="sorted"
                        onChange={(e) => {setSorted(e.target.value); setCurrentPage(0)}}
                    >
                    <MenuItem value={"desc"}>Сначала новые</MenuItem>
                    <MenuItem value={"asc"}>Сначала старые</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu">
                <InputLabel id="demo-simple-select-label">Почта</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isActivatedByEmail}
                        label="Status"
                        onChange={(e) => {setIsActivatedByEmail(e.target.value); setCurrentPage(0)}}
                    >
                    <MenuItem value={""}>Все</MenuItem>    
                    <MenuItem value={"true"}>Активированные</MenuItem>
                    <MenuItem value={"false"}>Неактивированные</MenuItem>
                    </Select>
            </FormControl>
            <FormControl className="formSelectMenu" disabled={role == "user"}>
                <InputLabel id="demo-simple-select-label">Статус</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isConfirmed}
                        label="Status"
                        onChange={(e) => {setIsConfirmed(e.target.value); setCurrentPage(0)}}
                    >
                    <MenuItem value={""}>Все</MenuItem>    
                    <MenuItem value={"true"}>Подтвержденные</MenuItem>
                    <MenuItem value={"false"}>Неподтвержденные</MenuItem>
                    </Select>
            </FormControl>
            </div>
            {data.data.length > 0 ? (
                role === "user" ? (
                    data.data.map((user: IUser) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {user.surname} {user.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                                    {user.email}
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button onClick={() => handleSend(user.id || null, null, "user", user.name, user.surname)} 
                                    className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                    Написать
                                </Button>
                                <Button onClick={() => handleBlock(user.id, user.role, true, null)}  
                                    className="block-button" variant="contained" size="small" endIcon={<BlockIcon />}>
                                    Заблокировать
                                </Button>
                                <Button onClick={() => handleBlock(user.id, user.role, false, "21.12.2002")}  
                                    className="block-date-button" variant="contained" size="small" endIcon={<BlockIcon />}>
                                    На время
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    data.data.map((lawyer: ILawyer) => (
                        <Card key={lawyer.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {lawyer.surname} {lawyer.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                                    {lawyer.email}
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button onClick={() => handleSend(null, lawyer.id || null, "lawyer", lawyer.name, lawyer.surname)}  
                                    className="deal-button" variant="contained" size="small" endIcon={<SendIcon />}>
                                    Написать
                                </Button>
                                <Button onClick={() => handleBlock(lawyer.id, lawyer.role, true, null)} 
                                    className="block-button" variant="contained" size="small" endIcon={<BlockIcon />}>
                                    Заблокировать
                                </Button>
                                <Button onClick={() => handleBlock(lawyer.id, lawyer.role, false, "21.12.2002")}  
                                    className="block-date-button" variant="contained" size="small" endIcon={<BlockIcon />}>
                                    На время
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )
            ) : (
                <div className="ufo">Инопланетяне истребили всех людей, никого нет в живых... или под эту сортировку никто не попал<img className="img-pro" src="../src/assets/ufo.png" alt="ufo" /></div>
            )}
            <Pagination className="paginationDealHistory"
                size="large"
                count={Math.ceil(data.count / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};