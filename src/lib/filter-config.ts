
export type FilterConfig = {
    priceRange: {
        min: number;
        max: number;
    };
    sliderRange: {
        min: number;
        max: number;
    }
}

export const filterConfigs: { [key: string]: FilterConfig } = {
    diamond: {
        priceRange: { min: 15000, max: 50000 },
        sliderRange: { min: 15000, max: 50000 }
    },
    platinum: {
        priceRange: { min: 9000, max: 15000 },
        sliderRange: { min: 5000, max: 20000 }
    },
    gold: {
        priceRange: { min: 10000, max: 20000 },
        sliderRange: { min: 8000, max: 25000 }
    },
    silver: {
        priceRange: { min: 5000, max: 10000 },
        sliderRange: { min: 3000, max: 12000 }
    },
    dental: {
        priceRange: { min: 2000, max: 8000 },
        sliderRange: { min: 1000, max: 10000 }
    }
    // Add other package configs here
};
