
export type Country = {
    name: string;
    code: string;
    states: string[];
}

export const countries: Country[] = [
    { name: 'United States', code: 'US', states: ['California', 'New York', 'Texas', 'Florida'] },
    { name: 'Canada', code: 'CA', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
    { name: 'United Kingdom', code: 'GB', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
    { name: 'India', code: 'IN', states: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune'] },
    { name: 'Australia', code: 'AU', states: ['New South Wales', 'Victoria', 'Queensland'] },
];
