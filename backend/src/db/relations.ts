import { relations } from "drizzle-orm/relations";
import { lawDataTable, lawVectordbStatusTable, chatHistoryTable, messagesTable, lawStatusTable, lawUrlTable, usersTable } from "./schema.js";

export const lawVectordbStatusRelations = relations(lawVectordbStatusTable, ({one}) => ({
	lawDatum: one(lawDataTable, {
		fields: [lawVectordbStatusTable.lawId],
		references: [lawDataTable.id]
	}),
}));

export const lawDataRelations = relations(lawDataTable, ({many}) => ({
	lawVectordbStatuses: many(lawVectordbStatusTable),
	lawStatuses_affectingLawId: many(lawStatusTable, {
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
	lawStatuses_affectedLawId: many(lawStatusTable, {
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
	lawUrls: many(lawUrlTable),
}));

export const messagesRelations = relations(messagesTable, ({one}) => ({
	chatHistory: one(chatHistoryTable, {
		fields: [messagesTable.chatHistoryId],
		references: [chatHistoryTable.id]
	}),
}));

export const chatHistoryRelations = relations(chatHistoryTable, ({one, many}) => ({
	messages: many(messagesTable),
	user: one(usersTable, {
		fields: [chatHistoryTable.userId],
		references: [usersTable.id]
	}),
}));

export const lawStatusRelations = relations(lawStatusTable, ({one}) => ({
	lawDatum_affectingLawId: one(lawDataTable, {
		fields: [lawStatusTable.affectingLawId],
		references: [lawDataTable.id],
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
	lawDatum_affectedLawId: one(lawDataTable, {
		fields: [lawStatusTable.affectedLawId],
		references: [lawDataTable.id],
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
}));

export const lawUrlRelations = relations(lawUrlTable, ({one}) => ({
	lawDatum: one(lawDataTable, {
		fields: [lawUrlTable.lawId],
		references: [lawDataTable.id]
	}),
}));

export const usersRelations = relations(usersTable, ({many}) => ({
	chatHistories: many(chatHistoryTable),
}));