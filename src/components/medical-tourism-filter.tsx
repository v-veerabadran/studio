
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Filter, Star } from 'lucide-react';
import { countries } from '@/lib/filter-data';
import { useToast } from '@/hooks/use-toast';
import type { Hospital } from '@/lib/data';
import type { FilterConfig } from '@/lib/filter-config';

interface MedicalTourismFilterProps {
    hospitals: Hospital[];
    onFilterChange: (filteredHospitals: Hospital[]) => void;
    config?: FilterConfig;
}

export function MedicalTourismFilter({ hospitals, onFilterChange, config }: MedicalTourismFilterProps) {
    const { toast } = useToast();
    
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [rating, setRating] = useState('any');
    
    // Determine the overall possible price range from all hospitals for the specialty
    const { minPrice: overallMin, maxPrice: overallMax } = useMemo(() => {
        if (hospitals.length === 0) return { minPrice: 0, maxPrice: 100000 };
        const prices = hospitals.map(h => h.price);
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices)
        };
    }, [hospitals]);
    
    // Set the initial price range from the package-specific config, or fall back to overall range
    const initialPriceRange: [number, number] = useMemo(() => [
        config?.priceRange?.min ?? overallMin,
        config?.priceRange?.max ?? overallMax
    ], [config, overallMin, overallMax]);

    const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);
    
    // Effect to reset the component's state when the config or initial range changes
    useEffect(() => {
        setPriceRange(initialPriceRange);
        setRating('any');
        setSelectedCountry('');
        setSelectedState('');
    }, [initialPriceRange]);


    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
        setSelectedState(''); // Reset state when country changes
    }

    const currentStates = countries.find(c => c.code === selectedCountry)?.states || [];

    const handleFilterApply = () => {
        let filtered = hospitals;

        if (selectedState) {
            toast({ title: `State filter for "${selectedState}" is for demo purposes.`});
        }

        if (rating !== 'any') {
            filtered = filtered.filter(h => h.rating >= parseInt(rating));
        }
        
        filtered = filtered.filter(h => h.price >= priceRange[0] && h.price <= priceRange[1]);

        onFilterChange(filtered);
        toast({
            title: "Filters Applied",
            description: `Found ${filtered.length} hospitals matching your criteria.`,
        });
    }

    const sliderMin = config?.sliderRange?.min ?? overallMin;
    const sliderMax = config?.sliderRange?.max ?? overallMax;


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Options
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Filter Options</AlertDialogTitle>
                    <AlertDialogDescription>
                        Find providers based on your preferences.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-6 py-4">
                   <div className="space-y-4">
                        <Label className="font-semibold">Location</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Select onValueChange={handleCountryChange} value={selectedCountry}>
                                <SelectTrigger id="country">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(country => (
                                        <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedState} value={selectedState} disabled={!selectedCountry}>
                                <SelectTrigger id="state">
                                    <SelectValue placeholder="State/Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentStates.map(state => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="price-range" className="font-semibold">Price Range</Label>
                        <Slider
                            id="price-range"
                            value={priceRange}
                            min={sliderMin} 
                            max={sliderMax}
                            step={1000}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                                <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min price</Label>
                                <Input
                                    id="min-price"
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                    step={1000}
                                    min={config?.priceRange?.min}
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                 <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max price</Label>
                                <Input
                                    id="max-price"
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                    step={1000}
                                />
                            </div>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <Label className="font-semibold">Rating</Label>
                        <RadioGroup defaultValue="any" className="flex items-center gap-4" value={rating} onValueChange={setRating}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="any" id="r1" />
                                <Label htmlFor="r1">Any</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4" id="r2" />
                                <Label htmlFor="r2" className="flex items-center">
                                    4 <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" /> & Up
                                </Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="r3" />
                                <Label htmlFor="r3" className="flex items-center">
                                    3 <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" /> & Up
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFilterApply}>Apply Filters</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
