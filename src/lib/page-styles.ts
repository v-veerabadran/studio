
export type PageStyle = {
    backgroundColor: string;
    primaryTextColor: string;
}

export const pageStyles: { [key: string]: PageStyle } = {
    dashboard: {
        backgroundColor: 'bg-blue-50',
        primaryTextColor: 'text-blue-800'
    },
    appointments: {
        backgroundColor: 'bg-green-50',
        primaryTextColor: 'text-green-800'
    },
    // Add other page styles here
};
