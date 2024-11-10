import { relations } from "drizzle-orm/relations";
import { lawData, lawStatus, lawUrl } from "./schema";

export const lawStatusRelations = relations(lawStatus, ({one}) => ({
	lawDatum_affectedLawId: one(lawData, {
		fields: [lawStatus.affectedLawId],
		references: [lawData.id],
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
	lawDatum_affectingLawId: one(lawData, {
		fields: [lawStatus.affectingLawId],
		references: [lawData.id],
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
}));

export const lawDataRelations = relations(lawData, ({many}) => ({
	lawStatuses_affectedLawId: many(lawStatus, {
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
	lawStatuses_affectingLawId: many(lawStatus, {
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
	lawUrls: many(lawUrl),
}));

export const lawUrlRelations = relations(lawUrl, ({one}) => ({
	lawDatum: one(lawData, {
		fields: [lawUrl.lawId],
		references: [lawData.id]
	}),
}));