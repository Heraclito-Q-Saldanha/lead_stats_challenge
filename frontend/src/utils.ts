export function formatDateTimeUS(date: string) {
    return new Date(date).toLocaleString(
        "en-US",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

export function formatDateUS(date: string) {
    return new Date(date).toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}
