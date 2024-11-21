export interface IQuestionFiltered {
    page: number;
    limit: number;
    role?: string;
    sorted?: "ASC" | "DESC";
    status?: string;
}
