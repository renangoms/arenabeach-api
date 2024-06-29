export function ReturnDayOfWeek(date: Date) {
    console.log(date.getDay() + ' ' + date);
    const day = date.getDay() + 1;

    switch (day) {
        case 0:
            return 'SUNDAY';
        case 1:
            return 'MONDAY';
        case 2:
            return 'TUESDAY';
        case 3:
            return 'WEDNESDAY';
        case 4:
            return 'THURSDAY';
        case 5:
            return 'FRIDAY';
        case 6:
            return 'SATURDAY';
    }
}
