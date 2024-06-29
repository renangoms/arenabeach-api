export function ReturnDayOfWeek(date: Date) {
    const day = date.getDay();

    switch (day) {
        case 0:
            return 'MONDAY';
        case 1:
            return 'TUESDAY';
        case 2:
            return 'WEDNESDAY';
        case 3:
            return 'THURSDAY';
        case 4:
            return 'FRIDAY';
        case 5:
            return 'SATURDAY';
        case 6:
            return 'SUNDAY';
    }
}
