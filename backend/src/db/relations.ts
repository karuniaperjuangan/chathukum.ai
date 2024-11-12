import { relations } from "drizzle-orm/relations";
import { lawData, lawVectordbStatus, chatHistory, messages, lawStatus, lawUrl, users } from "./schema";

export const lawVectordbStatusRelations = relations(lawVectordbStatus, ({one}) => ({
	lawDatum: one(lawData, {
		fields: [lawVectordbStatus.lawId],
		references: [lawData.id]
	}),
}));

export const lawDataRelations = relations(lawData, ({many}) => ({
	lawVectordbStatuses: many(lawVectordbStatus),
	lawStatuses_affectingLawId: many(lawStatus, {
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
	lawStatuses_affectedLawId: many(lawStatus, {
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
	lawUrls: many(lawUrl),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	chatHistory: one(chatHistory, {
		fields: [messages.chatHistoryId],
		references: [chatHistory.id]
	}),
}));

export const chatHistoryRelations = relations(chatHistory, ({one, many}) => ({
	messages: many(messages),
	user: one(users, {
		fields: [chatHistory.userId],
		references: [users.id]
	}),
}));

export const lawStatusRelations = relations(lawStatus, ({one}) => ({
	lawDatum_affectingLawId: one(lawData, {
		fields: [lawStatus.affectingLawId],
		references: [lawData.id],
		relationName: "lawStatus_affectingLawId_lawData_id"
	}),
	lawDatum_affectedLawId: one(lawData, {
		fields: [lawStatus.affectedLawId],
		references: [lawData.id],
		relationName: "lawStatus_affectedLawId_lawData_id"
	}),
}));

export const lawUrlRelations = relations(lawUrl, ({one}) => ({
	lawDatum: one(lawData, {
		fields: [lawUrl.lawId],
		references: [lawData.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chatHistories: many(chatHistory),
}));