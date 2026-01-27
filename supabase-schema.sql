-- OnYou Database Schema for Supabase PostgreSQL
-- Generated from Prisma schema

-- Create tables

-- Account (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

-- Session (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "bio" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- VerificationToken (NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- FriendConnection
CREATE TABLE IF NOT EXISTS "FriendConnection" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "relation" TEXT,
    "tags" TEXT,
    "closeness" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FriendConnection_userId_friendId_key" UNIQUE ("userId", "friendId")
);

-- SurveyResponse
CREATE TABLE IF NOT EXISTS "SurveyResponse" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "radarData" TEXT NOT NULL,
    "answers" TEXT DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Letter
CREATE TABLE IF NOT EXISTS "Letter" (
    "id" TEXT PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "content" TEXT NOT NULL,
    "template" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Invite
CREATE TABLE IF NOT EXISTS "Invite" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "creatorId" TEXT NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "maxUses" INTEGER NOT NULL DEFAULT 100,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PeerFeedback
CREATE TABLE IF NOT EXISTS "PeerFeedback" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "respondentName" TEXT NOT NULL,
    "scores" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create foreign key constraints
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FriendConnection" ADD CONSTRAINT "FriendConnection_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FriendConnection" ADD CONSTRAINT "FriendConnection_friendId_fkey"
    FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Letter" ADD CONSTRAINT "Letter_senderId_fkey"
    FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Letter" ADD CONSTRAINT "Letter_receiverId_fkey"
    FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Invite" ADD CONSTRAINT "Invite_creatorId_fkey"
    FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PeerFeedback" ADD CONSTRAINT "PeerFeedback_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "FriendConnection_userId_idx" ON "FriendConnection"("userId");
CREATE INDEX IF NOT EXISTS "FriendConnection_friendId_idx" ON "FriendConnection"("friendId");
CREATE INDEX IF NOT EXISTS "FriendConnection_closeness_idx" ON "FriendConnection"("closeness");
CREATE INDEX IF NOT EXISTS "SurveyResponse_userId_idx" ON "SurveyResponse"("userId");
CREATE INDEX IF NOT EXISTS "SurveyResponse_createdAt_idx" ON "SurveyResponse"("createdAt");
CREATE INDEX IF NOT EXISTS "Letter_senderId_idx" ON "Letter"("senderId");
CREATE INDEX IF NOT EXISTS "Letter_receiverId_idx" ON "Letter"("receiverId");
CREATE INDEX IF NOT EXISTS "Letter_isRead_idx" ON "Letter"("isRead");
CREATE INDEX IF NOT EXISTS "Letter_createdAt_idx" ON "Letter"("createdAt");
CREATE INDEX IF NOT EXISTS "Invite_creatorId_idx" ON "Invite"("creatorId");
CREATE INDEX IF NOT EXISTS "Invite_code_idx" ON "Invite"("code");
CREATE INDEX IF NOT EXISTS "Invite_expiresAt_idx" ON "Invite"("expiresAt");
CREATE INDEX IF NOT EXISTS "PeerFeedback_userId_idx" ON "PeerFeedback"("userId");
CREATE INDEX IF NOT EXISTS "PeerFeedback_createdAt_idx" ON "PeerFeedback"("createdAt");
