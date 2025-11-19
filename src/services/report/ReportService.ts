import {BaseService} from "../BaseService.ts";
import {CreateReport, Report} from "../../domain/model/report/Report.ts";

export class ReportService extends BaseService {
    private static factory: ReportService = new ReportService();

    static get instance(): ReportService {
        return ReportService.factory;
    }

    constructor() {
        super('reports');
    }

    async createReport(data: CreateReport): Promise<Report> {
        return this.post<Report>('', data);
    }
}


