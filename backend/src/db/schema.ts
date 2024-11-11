import { pgTable, serial, varchar, foreignKey, unique, integer, boolean, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar().notNull(),
	password: varchar().notNull(),
});

export const lawVectordbStatus = pgTable("law_vectordb_status", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "law_vectordb_status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	lawId: integer("law_id").notNull(),
	hasVectordbRecord: boolean("has_vectordb_record").default(false).notNull(),
	lastUpdated: date("last_updated").defaultNow().notNull(),
}, (table) => {
	return {
		fkLawIdVectordbStatus: foreignKey({
			columns: [table.lawId],
			foreignColumns: [lawData.id],
			name: "fk_law_id_vectordb_status"
		}),
		lawVectordbStatusUnique: unique("law_vectordb_status_unique").on(table.lawId),
	}
});

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
