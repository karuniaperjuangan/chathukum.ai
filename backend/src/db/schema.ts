import { pgTable, foreignKey, integer, varchar, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const lawStatus = pgTable("law_status", {
	affectedLawId: integer("affected_law_id"),
	affectingLawId: integer("affecting_law_id"),
	status: varchar(),
}, (table) => {
	return {
		fkAffectedLawId: foreignKey({
			columns: [table.affectedLawId],
			foreignColumns: [lawData.id],
			name: "fk_affected_law_id"
		}),
		fkAffectingLawId: foreignKey({
			columns: [table.affectingLawId],
			foreignColumns: [lawData.id],
			name: "fk_affecting_law_id"
		}),
	}
});

export const lawData = pgTable("law_data", {
	id: integer().primaryKey().notNull(),
	type: varchar(),
	region: varchar(),
	year: varchar(),
	title: varchar(),
	about: varchar(),
	category: varchar(),
	detailUrl: varchar("detail_url"),
});

export const lawUrl = pgTable("law_url", {
	lawId: integer("law_id"),
	id: varchar(),
	downloadUrl: varchar("download_url"),
}, (table) => {
	return {
		lawUrlLawIdFkey: foreignKey({
			columns: [table.lawId],
			foreignColumns: [lawData.id],
			name: "law_url_law_id_fkey"
		}),
		lawUrlIdKey: unique("law_url_id_key").on(table.id),
	}
});
