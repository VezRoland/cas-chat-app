CREATE TABLE "chat_room" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ownerId" uuid,
	"title" text NOT NULL,
	"isVisible" boolean DEFAULT true NOT NULL,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_room_message" (
	"messageId" uuid,
	"roomId" uuid,
	CONSTRAINT "chat_room_message_messageId_roomId_pk" PRIMARY KEY("messageId","roomId")
);
--> statement-breakpoint
CREATE TABLE "chat_room_user" (
	"roomId" uuid,
	"userId" uuid,
	"nickname" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_room_user_roomId_userId_pk" PRIMARY KEY("roomId","userId")
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firstName" uuid NOT NULL,
	"lastName" uuid NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_credential" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"provider" text NOT NULL,
	"subject" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_message" (
	"messageId" uuid,
	"recipientId" uuid,
	CONSTRAINT "user_message_messageId_recipientId_pk" PRIMARY KEY("messageId","recipientId")
);
--> statement-breakpoint
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_message" ADD CONSTRAINT "chat_room_message_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_message" ADD CONSTRAINT "chat_room_message_roomId_chat_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."chat_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_user" ADD CONSTRAINT "chat_room_user_roomId_chat_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."chat_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_user" ADD CONSTRAINT "chat_room_user_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credential" ADD CONSTRAINT "user_credential_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_message" ADD CONSTRAINT "user_message_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_message" ADD CONSTRAINT "user_message_recipientId_user_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;