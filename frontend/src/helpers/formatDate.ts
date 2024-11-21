export const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Almaty',
    })
        .format(new Date(new Date(dateString).getTime() + 60 * 60 * 1000))
        .slice(1, 17);
};
