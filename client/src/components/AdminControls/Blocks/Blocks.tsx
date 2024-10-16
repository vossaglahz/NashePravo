import { useState } from "react";
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from "@mui/material";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useUnblockUserMutation } from "../../../store/api/user.api";
import { AlertComponent } from "../../UI/Alert/Alert";
import { useGetSomeUserQuery } from "../../../store/api/admin.api";
import { IUser } from "../../../interfaces/User.interface";
import { ILawyer } from "../../../interfaces/Lawyer.interface";
import "./Blocks.scss";

export const Blocks = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [role, setRole] = useState<string>("user");
    const permanentBlock = "true";
    const isConfirmed = "";
    const isActivatedByEmail = "";
    const sorted = "desc";

    const [alertInfo, setAlertInfo] = useState<{ text: string, isError: boolean}>();

    const [unblockUser] = useUnblockUserMutation();

    const { data, isLoading, error } = useGetSomeUserQuery({
        currentPage,
        isActivatedByEmail,
        isConfirmed,
        sorted,
        role,
        permanentBlock,
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
    
    const handleUnblock = async (id: number | undefined, role: string | undefined) => {
            const response = await unblockUser({ id, role});
            if (response.data?.success) {
                setAlertInfo({
                    text: `Пользователь успешно разблокирован`,
                    isError: false
                });
            } else {
                setAlertInfo({
                    text: "Пользователь не был разаблокирован, повторите еще раз",
                    isError: true
                });
            }
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
            </div>
            {data.data.length > 0 ? (
                role === "user" ? (
                    data.data.map((user: IUser) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {user.surname} {user.name}
                                </Typography>
                                {user.permanentBlocked && user.dateBlocked == null ? (
                                    <Typography>
                                        Заблокирован навсегда
                                    </Typography>
                                ) : user.permanentBlocked && user.dateBlocked !== null && (
                                    <Typography>
                                        Заблокирован до {user.dateBlocked}
                                    </Typography>
                                )}
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                                    {user.email}
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button onClick={() => handleUnblock(user.id, user.role)}  
                                    className= "unblock-button" variant="contained" size="small" endIcon={<AddReactionIcon />}>
                                    Разблокировать
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    data.data.map((lawyer: ILawyer) => (
                        <Card key={lawyer.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {lawyer.surname}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {lawyer.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: "green" }}>
                                    {lawyer.email}
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button onClick={() => handleUnblock(lawyer.id, lawyer.role)} 
                                    className="unblock-button" variant="contained" size="small" endIcon={<AddReactionIcon />}>
                                    Разблокировать
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )
            ) : (
                <div className="policeman">Все оказались добропорядочными, нет заблокированных<img className="img-pro" src="../src/assets/policeman.png" alt="policeman" /></div>
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