export function TransformDate(date: string) {
    const dateString = date + 'T00:00:00.000Z';
    const dateFormated = new Date(dateString);
    return dateFormated;
}