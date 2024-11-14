
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:6789"

interface Law {
    id: number;
    type: string;
    region: string;
    title: string;
    about: string;
    category: string;
    detailUrl: string;
}
interface LawResponse {
    total_pages: number;
    current_page: number;
    data: Law[];
}

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function processRegion(region: string) {
    return toTitleCase(region.replace('kab-', 'kabupaten-').replace(/-/g, ' ').trim());
}

export default function ExploreLawsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentType, setCurrentType] = useState<string | undefined>(undefined);
    const [currentRegion, setCurrentRegion] = useState<string | undefined>(undefined);
    const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);
    const fetchLaws = async () => {
        const response = await fetch(BASE_URL + "/laws?" + new URLSearchParams({
            "page": currentPage.toString(),
            "limit": "10",
            "type": currentType || "",
            "region": currentRegion || "",
            "category": currentCategory || "",
        }).toString());
        if (!response.ok) {
            throw new Error("Failed to fetch laws");
        }
        return response.json();
    };
    const [types, setTypes] = useState<string[]>([])
    const [regions, setRegions] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    useEffect(() => {
        async function loadFilters() {
            const filterResponse = await fetch(BASE_URL + "/laws/info");
            if (!filterResponse.ok) {
                throw new Error("Failed to fetch filters");
            }
            const filterData = await filterResponse.json();
            setTypes(filterData.types);
            setRegions(filterData.regions);
            setCategories(filterData.categories);
        }
        loadFilters();

    })
    const { data, isLoading, error }: { data: LawResponse | undefined, isLoading: boolean, error: Error | null } = useQuery({
        queryKey: [
            "laws",
            currentPage,
            currentType,
            currentRegion,
            currentCategory,
        ],
        queryFn: fetchLaws,
    });

    return (
        <div className="px-12 py-4 bg-ch-almost-white w-screen h-screen overflow-y-scroll">
            <h1 className=" text-2xl font-bold text-center">Explore Laws</h1>
            <div className="flex w-full items-center justify-between">
            {/*Dropdown of Types */}
            <div className="flex justify-center space-x-4">
                <select value={currentType} onChange={(e) => setCurrentType(e.target.value)} className="p-2 border rounded-md">
                    <option value="">All Types</option>
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {toTitleCase(type)}
                        </option>
                    ))}
                </select>
            </div>
            {/* Region searchbox with dropdown autocompletion*/}
            <div>
                <datalist id="regions">
                    {
                        regions.map((region) => (
                            <option key={region} value={region}>
                                {processRegion(region)}
                            </option>
                        ))
                    }
                </datalist>
                <input autoComplete="on" list="regions" className="p-2 border rounded-md" placeholder="Nama Daerah..."
                    onChange={(e) => {
                        if (regions.includes(e.target.value)) {
                            setCurrentRegion(e.target.value)
                        }
                    }}
                />
            </div>
            {/* Category searchbox with dropdown autocompletion*/}
            <div>
                <datalist id="categories">
                    {
                        categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))
                    }
                </datalist>
                <input autoComplete="on" list="categories" className="p-2 border rounded-md" placeholder="Nama Kategori..."
                    onChange={(e) => {
                        if (categories.includes(e.target.value)) {
                            setCurrentCategory(e.target.value)
                        }
                    }}
                />
            </div>
            </div>
            {!isLoading && data &&
                <div>
                    {/*Card of Law */}
                    <div className="space-y-4 my-8">
                        {data.data.map((law) => (
                            <div key={law.id} className=" bg-white shadow-sm rounded-md min-h-36 w-full shadow-slate-500 p-4 space-y-2">
                                <p className=" text-gray-600 text-md">{law.title}</p>
                                <button className=" text-justify font-bold text-xl text-ch-coral hover:text-ch-brick-red transition-colors" onClick={
                                    () => window.open("https://peraturan.bpk.go.id" + law.detailUrl, "_blank")
                                }>{law.about}</button>
                                <div className="flex space-x-2 flex-wrap">
                                    <button className="rounded-md h-8 max-w-96 px-2 py-1 bg-red-300 hover:bg-red-500 font-medium text-nowrap">{(law.type).toUpperCase()}</button>
                                    <button className="rounded-md h-8 max-w-96 px-2 py-1 bg-emerald-300 hover:bg-emerald-500 font-medium text-nowrap">{processRegion(law.region)}</button>
                                    <button className="rounded-md h-8  max-w-96 px-2 py-1 bg-blue-300 hover:bg-blue-500 font-medium line-clamp-1">{law.category}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {/*Pagination (showing 3 first and 3 last, if there are more than 6 items, add ... in middle) */}
            <div className="flex justify-center mt-4">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l">Previous</button>

                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === data?.total_pages} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r">Next</button>
            </div>
        </div>
    );
}