import type { Request, Response } from 'express';
import { db } from '../db.js';
import { lawDataTable, lawStatusTable, lawUrlTable } from '../db/schema.js';
import { eq, sql, and, count, ilike, inArray } from 'drizzle-orm';


async function getAllLaws(req: Request, res: Response) {
    try {
        const { page="1", limit="100", keyword, type, region, year, category, law_ids } : { page?: string; limit?: string; keyword?: string; type?: string; region?: string; year?: string; category?: string, law_ids?:string } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = Math.min(parseInt(limit as string, 10), 100);
        const offset = (pageNumber - 1) * pageSize;

        let query = db.select().from(lawDataTable).orderBy(lawDataTable.id);

        let listConditions = [];

        if(keyword){
            listConditions.push(sql`${lawDataTable.title} || ' ' || ${lawDataTable.about} ilike '%' || ${keyword} || '%'`);
        }
        if (type) {
            listConditions.push(eq(lawDataTable.type as any, type));
        }
        if (region) {
            listConditions.push(eq(lawDataTable.region as any, region));
        }
        if (year) {
            listConditions.push(eq(lawDataTable.year as any, year))
        }
        if (category) {
            listConditions.push(eq(lawDataTable.category as any, category));
        }
        if(law_ids){
        const lawIdsArray = Array.from(law_ids.matchAll(/(\d+)/g),match => parseInt(match[1], 10)); // Extract numbers from the string            
            listConditions.push(inArray(lawDataTable.id,lawIdsArray))
        }

        if (listConditions.length > 0) {
            query = query.where(
                and(...listConditions)
            ) as any;
        }

        query = query.limit(pageSize).offset(offset) as any;
        let totalCountQuery = db.select({value: count()}).from(lawDataTable)
        if (listConditions.length > 0) {
            totalCountQuery = totalCountQuery.where(
                and(...listConditions)
            ) as any;
        }
        const totalCount = (await totalCountQuery)[0]['value']
        const totalPages = Math.ceil(totalCount / pageSize);
        const laws = await query;
        res.status(200).json({"total_pages":totalPages, 
            "total_laws":totalCount,
            "current_page":parseInt(page as string, 10), "data": laws});
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
};

async function getLawByID(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const law = await db.select().from(lawDataTable).where(eq(lawDataTable.id, parseInt(id)));
        if (!law) {
            res.status(404).json({ error: 'Law not found' });
        }
        res.status(200).json(law);
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }
};

async function getFiltersInformation(req: Request, res: Response) {
    try {
        const types = await db.selectDistinct({ type: lawDataTable.type }).from(lawDataTable).orderBy(lawDataTable.type)
        const regions = await db.selectDistinct({ region: lawDataTable.region }).from(lawDataTable).orderBy(lawDataTable.region)
        const years = await db.selectDistinct({ year: lawDataTable.year }).from(lawDataTable).orderBy(lawDataTable.year)
        const categories = await db.selectDistinct({ category: lawDataTable.category }).from(lawDataTable).orderBy(lawDataTable.category)

        res.status(200).json({
            types: types.map((t: any) => t.type || ''),
            regions: regions.map((r: any) => r.region || ''),
            years: years.map((y: any) => y.year || ''),
            categories: categories.map((c: any) => c.category || '')
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
export { getAllLaws, getLawByID, getFiltersInformation };