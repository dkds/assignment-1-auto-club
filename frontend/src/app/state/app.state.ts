
export interface AppState {
    members: ReadonlyArray<{ first: number, offset: number, orderBy: string }>;
}