import type { Request, Response } from 'express';
import { db } from '../db.ts';
import { lawData, lawStatus, lawUrl } from '../db/schema.ts';
import {eq, sql,and} from 'drizzle-orm';


async function getAllLaws(req:Request,res:Response) {
    try{
        const { page=1, limit=100, type, region, year, category} = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = Math.min(parseInt(limit as string, 10),100);
        const offset = (pageNumber-1) *pageSize;
        
        let query = db.select().from(lawData).orderBy(lawData.id);

        let listConditions = [];
        
        if(type){
            listConditions.push(eq(lawData.type as any, type));
        }
        if(region){
            listConditions.push(eq(lawData.region as any, region));
        }
        if(year){
            listConditions.push(eq(lawData.year as any, year))
        }
        if(category){
            listConditions.push(eq(lawData.category as any, category));
        }

        if(listConditions.length > 0) {
            query = query.where(
                and(...listConditions)
            ) as any;
        }
        
        query = query.limit(pageSize).offset(offset) as any;
        
        const laws = await query;
        res.status(200).json(laws);
    } catch(error:any){
        console.error(error);
        res.status(500).json({error:error.message});
    }    
};

async function getLawByID(req:Request,res:Response) {
    const {id} = req.params;
    try{
        const law = await db.select().from(lawData).where(eq(lawData.id,parseInt(id)));
        if(!law){
            res.status(404).json({error:'Law not found'});
        }
        res.status(200).json(law);
    } catch(error:any){
        console.error(error);
        res.status(500).json({error:error.message});
    }
};

export {getAllLaws, getLawByID};