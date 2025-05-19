export interface ClientStatisticsLike {
    get duration(): number;
    get errorCount(): number;
    get successCount(): number;
    get errorMap(): Map<string, number>;
    clear(): void;
    success(duration: number): void;
    error(e: Error): void;
}
export type ClientStatisticsLambda = () => Array<ClientStatisticsLike>;
