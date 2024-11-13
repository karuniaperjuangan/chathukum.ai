import { pgTable, foreignKey, unique, integer, boolean, date, serial, varchar, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const rolesEnum = pgEnum("roles", ["system", "human", "ai"]);

export const lawVectordbStatusTable = pgTable("law_vectordb_status", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "law_vectordb_status_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	lawId: integer("law_id").notNull(),
	hasVectordbRecord: boolean("has_vectordb_record").default(false).notNull(),
	lastUpdated: date("last_updated").defaultNow().notNull(),
}, (table) => {
	return {
		fkLawIdVectordbStatus: foreignKey({
			columns: [table.lawId],
			foreignColumns: [lawDataTable.id],
			name: "fk_law_id_vectordb_status"
		}).onUpdate("cascade").onDelete("cascade"),
		lawVectordbStatusUnique: unique("law_vectordb_status_unique").on(table.lawId),
	}
});

export const usersTable = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar().notNull(),
	password: varchar().notNull(),
	email: varchar().notNull(),
});

export const messagesTable = pgTable("messages", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "messages_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	chatHistoryId: integer("chat_history_id").notNull(),
	message_role: rolesEnum().notNull(),
	content: varchar().notNull(),
}, (table) => {
	return {
		fkChatHistoryId: foreignKey({
			columns: [table.chatHistoryId],
			foreignColumns: [chatHistoryTable.id],
			name: "fk_chat_history_id"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const lawStatusTable = pgTable("law_status", {
	affectedLawId: integer("affected_law_id"),
	affectingLawId: integer("affecting_law_id"),
	status: varchar(),
}, (table) => {
	return {
		fkAffectingLawId: foreignKey({
			columns: [table.affectingLawId],
			foreignColumns: [lawDataTable.id],
			name: "fk_affecting_law_id"
		}),
		fkAffectedLawId: foreignKey({
			columns: [table.affectedLawId],
			foreignColumns: [lawDataTable.id],
			name: "fk_affected_law_id"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const lawDataTable = pgTable("law_data", {
	id: integer().primaryKey().notNull(),
	type: varchar(),
	region: varchar(),
	year: varchar(),
	title: varchar(),
	about: varchar(),
	category: varchar(),
	detailUrl: varchar("detail_url"),
});

export const lawUrlTable = pgTable("law_url", {
	lawId: integer("law_id"),
	id: varchar(),
	downloadUrl: varchar("download_url"),
}, (table) => {
	return {
		lawUrlLawIdFkey: foreignKey({
			columns: [table.lawId],
			foreignColumns: [lawDataTable.id],
			name: "law_url_law_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		lawUrlIdKey: unique("law_url_id_key").on(table.id),
	}
});

export const chatHistoryTable = pgTable("chat_history", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	lawIds: integer("law_ids").array().notNull(),
}, (table) => {
	return {
		fkUserIdChatHistory: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id],
			name: "fk_user_id_chat_history"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});
