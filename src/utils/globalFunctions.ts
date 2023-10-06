export function convertToReadableTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
}