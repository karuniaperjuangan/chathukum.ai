
export interface Law {
    id: number;
    type: string;
    region: string;
    title: string;
    about: string;
    category: string;
    detailUrl: string;
}
export interface LawResponse {
    total_pages: number;
    total_laws: number;
    current_page: number;
    data: Law[];
}