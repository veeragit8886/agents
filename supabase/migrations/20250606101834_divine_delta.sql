/*
  # AI Agent Platform Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `expertise` (text)
      - `color_scheme` (text)
      - `icon` (text)
      - `created_at` (timestamp)
    
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `agent_id` (uuid, references agents)
      - `title` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `role` (text, 'user' or 'assistant')
      - `content` (text)
      - `created_at` (timestamp)
    
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `agent_id` (uuid, references agents)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for public read access to agents table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  expertise text NOT NULL,
  color_scheme text NOT NULL DEFAULT 'blue',
  icon text NOT NULL DEFAULT 'Bot',
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Agents policies (public read)
CREATE POLICY "Anyone can read agents"
  ON agents
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Conversations policies
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read messages from own conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- User favorites policies
CREATE POLICY "Users can read own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert default agents
INSERT INTO agents (name, description, expertise, color_scheme, icon) VALUES
(
  'Code Doctor',
  'Expert AI in fullstack JavaScript development using React and FastAPI. Identifies syntax issues, suggests clean fixes, and provides structural improvements.',
  'JavaScript, React, FastAPI, Code Review, Performance Optimization',
  'emerald',
  'Stethoscope'
),
(
  'Prompt Sensei',
  'Master in prompt engineering for GPT-style models. Analyzes prompts for effectiveness, rewrites for better clarity, and teaches prompt design principles.',
  'Prompt Engineering, GPT Models, AI Communication, Training',
  'purple',
  'Sparkles'
),
(
  'Daily AI Tips',
  'Shares high-value daily tips about prompt engineering, AI productivity, and effective use of large language models for advanced practitioners.',
  'AI Productivity, Prompt Engineering, LLM Best Practices, Tips & Tricks',
  'blue',
  'Lightbulb'
),
(
  'Prompt Trainer',
  'AI tutor for mastering prompt engineering through progressive challenges, assessments, and detailed feedback to build expert-level skills.',
  'Prompt Engineering Training, Skill Assessment, Progressive Learning',
  'orange',
  'GraduationCap'
),
(
  'AI Trends Mentor',
  'Summarizes recent AI and prompt engineering updates, providing weekly briefings on new models, tools, best practices, and research breakthroughs.',
  'AI Trends, Research Updates, Industry News, Technology Analysis',
  'cyan',
  'TrendingUp'
),
(
  'UI Critic',
  'Frontend and UX expert specializing in React and Tailwind CSS. Reviews UI for usability, accessibility, and modern design patterns.',
  'Frontend Development, UX Design, React, Tailwind CSS, Accessibility',
  'rose',
  'Palette'
);