
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"
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
    total_laws: number;
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
    return toTitleCase(region.replace('kab-', 'kabupaten-').replace('prov','provinsi-')
    .replace(/-/g, ' ').trim())
    .replace('Diy','DIY')
    .replace('Dki','DKI');
}

export default function ExploreLawsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentType, setCurrentType] = useState<string | undefined>(undefined);
    const [currentRegion, setCurrentRegion] = useState<string | undefined>(undefined);
    const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);
    const [currentKeyword, setCurrentKeyword] = useState<string | undefined>(undefined);
    const [debouncedKeyword] = useDebounce(currentKeyword, 500);

    useEffect(() => {
        setCurrentPage(1); // Reset page when filters change
    }, [currentType, currentRegion, currentCategory, currentKeyword]);


    const fetchLaws = async () => {
        const response = await fetch(BASE_URL + "/laws?" + new URLSearchParams({
            "keyword": debouncedKeyword || "", // Use debounced keyword
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
            debouncedKeyword,
        ],
        queryFn: fetchLaws,
    });

    return (
        <div className="px-12 flex flex-col py-4 bg-ch-almost-white w-screen h-screen overflow-y-scroll">
            <h1 className=" text-2xl font-bold text-center">Eksplorasi Undang-Undang dan Peraturan</h1>
            <div className="flex w-full items-center justify-between my-2">
                <input className="p-2 border rounded-md h-full flex-1"
                    placeholder="Masukkan Kata Kunci..."
                    onChange={(e) => setCurrentKeyword(e.target.value)}></input>
            </div>
            <div className="flex w-full items-center justify-between space-x-4">
                {/*Dropdown of Types */}
                <div className="flex justify-center space-x-2 w-full">
                    <select value={currentType} id="type-select" onChange={(e) => setCurrentType(e.target.value)} className="p-2 border rounded-md w-full">
                        <option value="">Semua Jenis</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {(type).toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Region searchbox with dropdown autocompletion*/}
                <div className="w-full">
                    <datalist id="regions">
                        {
                            regions.map((region) => (
                                <option key={region} value={region}>
                                    {processRegion(region)}
                                </option>
                            ))
                        }
                    </datalist>
                    <input autoComplete="on" id="region-input" list="regions" className="p-2 border rounded-md w-full" placeholder="Nama Daerah..."
                        onChange={(e) => {
                            if (regions.includes(e.target.value) || e.target.value === '') {
                                setCurrentRegion(e.target.value)
                            }
                        }}
                    />
                </div>
                {/* Category searchbox with dropdown autocompletion*/}
                <div className="w-full">
                    <datalist id="categories">
                        {
                            categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))
                        }
                    </datalist>
                    <input autoComplete="on" id="category-input" list="categories" className="p-2 border rounded-md w-full" placeholder="Nama Kategori..."
                        onChange={(e) => {
                            if (categories.includes(e.target.value) || e.target.value === '') {
                                setCurrentCategory(e.target.value)
                            }
                        }}
                    />
                </div>
            </div>
            {!isLoading && data &&
                <div className="flex-1 overflow-y-auto outline outline-1 rounded-md p-4 my-4">
                    <p className="my-2">Jumlah Hukum: {data.total_laws}</p>
                    {/*Card of Law */}
                    <div className="space-y-4">
                        {data.data.map((law) => (
                            <div key={law.id} className=" bg-white shadow-sm rounded-md min-h-36 w-full shadow-slate-500 p-4 space-y-2">
                                <p className=" text-gray-600 text-sm">{law.title}</p>
                                <button className=" text-justify font-bold text-lg text-ch-coral hover:text-ch-brick-red transition-colors" onClick={
                                    () => window.open("https://peraturan.bpk.go.id" + law.detailUrl, "_blank")
                                }>{law.about}</button>
                                <div className="flex space-x-2 flex-wrap">
                                    <button className="text-xs rounded-md h- max-w-96 px-2 py-1 bg-red-300 hover:bg-red-500 font-medium text-nowrap"
                                        onClick={() => {
                                            const typeSelect = document.getElementById('type-select') as HTMLSelectElement;
                                            if (typeSelect) {
                                                typeSelect.value = law.type;
                                                setCurrentType(law.type)

                                            }
                                        }}
                                    >{(law.type).toUpperCase()}</button>
                                    <button className="text-xs rounded-md h-8 max-w-96 px-2 py-1 bg-emerald-300 hover:bg-emerald-500 font-medium text-nowrap"
                                        onClick={() => {
                                            const regionInput = document.getElementById("region-input") as HTMLInputElement;
                                            if (regionInput) {
                                                regionInput.value = law.region;
                                                setCurrentRegion(law.region);
                                            }
                                        }}
                                    >{processRegion(law.region)}</button>
                                    <button className="text-xs rounded-md h-8  max-w-96 px-2 py-1 bg-blue-300 hover:bg-blue-500 font-medium line-clamp-1"
                                        onClick={() => {
                                            const categoryInput = document.getElementById("category-input") as HTMLInputElement;
                                            if (categoryInput) {
                                                categoryInput.value = law.category;
                                                setCurrentCategory(law.category);
                                            }
                                        }}
                                    >{law.category}</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>


            }
            {
            !isLoading && data &&                    
             <div className="flex justify-center mt-4">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l">{"<<"}</button>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4">{"<"}</button>
                {
                    Array.from({ length: Math.min(data?.total_pages, 5) }, (_, i) => (

                        <button key={currentPage + i - 2} onClick={() => setCurrentPage(currentPage + i - 2)} className={`bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 ${currentPage === currentPage + i - 2 ? 'bg-blue-500' : ''} ${currentPage + i - 2 <= 0 || currentPage + i - 2 >= data.total_pages ? "hidden" : ""}`}>
                            {currentPage + i - 2}
                        </button>
                    ))
                }
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === data?.total_pages} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4">{">"}</button>
                <button onClick={() => setCurrentPage(data?.total_pages)} disabled={currentPage === data?.total_pages} className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r">{">>"}</button>
            </div>
            }
            {
                isLoading && <div className="w-full h-full">
                    <p>Loading...</p>
                </div>
            }


        </div>
    );
}