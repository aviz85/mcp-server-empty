#!/usr/bin/env node

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "GoodMorning",
  version: "1.0.0"
});

server.resource(
  "good-morning",
  new ResourceTemplate("good-morning://{message}", { list: undefined }),
  async (uri, { message }) => ({
    contents: [{
      uri: uri.href,
      text: `Good morning! Message: ${message}`
    }]
  })
);

server.tool(
  "good_morning",
  { message: z.string() },
  async ({ message }) => ({
    content: [{ type: "text", text: `Good morning! Your message: ${message}` }]
  })
);

server.prompt(
  "starter-assistant",
  { 
    mood: z.string().describe("How the user is feeling today")
  },
  ({ mood }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are a personal digital assistant. You must perform the following tasks IMMEDIATELY:

1. Calendar Check:
   - Review today's meetings and appointments
   - Check deadlines and important events
   - Identify key tasks for today
   - Use read_file on calendar data to get schedule information

2. Weather Information:
   - Use web_search to check today's weather in Jerusalem
   - Focus on current conditions and today's forecast
   - Include temperature and any important weather alerts
   - Make practical recommendations based on the weather

3. Mood-Based Support (Current mood: ${mood}):
   - Provide a personalized tip or advice based on their current mood
   - If they're feeling down, offer encouraging words
   - If they're feeling energetic, suggest productive activities
   - If they're feeling stressed, recommend calming activities
   - Tailor the advice to both their mood and the day's weather/schedule

Begin by checking the calendar and weather, then provide a consolidated response that includes:
- Today's important events and meetings
- Jerusalem's current weather and forecast
- A personalized mood-based tip that takes into account their schedule and the weather
- The tip should consider available tools and actions that can be performed with them

DONT WAIT FOR THE USER TO RESPOND, START THE TASKS IMMEDIATELY.`
      }
    }]
  })
);

server.prompt(
  "marketing-writer",
  { 
    topic: z.string().describe("The topic or product to write marketing content about"),
    targetAudience: z.string().optional().describe("The target audience for the content"),
    contentType: z.enum(['social', 'email', 'blog', 'ad']).optional().describe("Type of marketing content to generate")
  },
  ({ topic, targetAudience, contentType }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are an expert marketing copywriter. Create compelling marketing content for the following topic IMMEDIATELY:

Topic: ${topic}
${targetAudience ? `Target Audience: ${targetAudience}` : 'Target Audience: General audience'}
${contentType ? `Content Type: ${contentType}` : 'Content Type: All marketing formats'}

Follow these copywriting principles:
1. Value Proposition:
   - Identify and highlight the unique selling points
   - Focus on benefits rather than features
   - Address the audience's pain points

2. Engagement Techniques:
   - Use attention-grabbing headlines
   - Incorporate storytelling elements
   - Create emotional connections
   - Use persuasive language patterns

3. Content Structure:
   - Start with a compelling hook
   - Follow the AIDA model (Attention, Interest, Desire, Action)
   - Include clear calls-to-action
   - Use short, impactful paragraphs

4. Optimization Guidelines:
   - Use power words and emotional triggers
   - Incorporate relevant keywords naturally
   - Maintain brand voice and tone
   - Ensure content is scannable and readable

5. Format-Specific Requirements:
   - Social: Create short, shareable content with hashtags
   - Email: Write engaging subject lines and preview text
   - Blog: Include SEO elements and internal linking opportunities
   - Ad: Focus on immediate value and clear CTAs

Begin writing the marketing content now. Don't wait for additional input - create multiple versions and variations of the content immediately.`
      }
    }]
  })
);

server.prompt(
  "email-assistant",
  {
    emailType: z.enum(['reply', 'draft', 'summary']).describe("Type of email assistance needed"),
    context: z.string().describe("Original email content or description of what's needed"),
    tone: z.enum(['formal', 'friendly', 'urgent']).optional().describe("Desired tone of the email")
  },
  ({ emailType, context, tone }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are an email productivity assistant. Help me with the following email task IMMEDIATELY:

Task Type: ${emailType}
${tone ? `Tone: ${tone}` : 'Tone: professional'}
Context: ${context}

For email replies:
- Analyze the original email thoroughly
- Identify the key points requiring response
- Draft a clear, concise reply addressing all points
- Maintain appropriate tone and professionalism
- Include necessary follow-up questions or actions

For new email drafts:
- Create a compelling subject line
- Structure the email with clear introduction, body, and conclusion
- Include all necessary details from the context provided
- Format for readability with bullet points or paragraphs as appropriate
- Ensure professional tone with appropriate greeting and sign-off

For email summaries:
- Extract the key information from lengthy email threads
- Identify action items, deadlines, and responsibilities
- Present a condensed version that retains all critical information
- Highlight decisions made and next steps
- Format for quick scanning and comprehension

Use Gmail to check for reference emails if needed. Don't wait for additional input - provide the email content immediately.`
      }
    }]
  })
);

server.prompt(
  "file-organizer",
  {
    projectName: z.string().describe("Name of the project or category for file organization"),
    fileTypes: z.string().describe("Types of files to organize, comma-separated"),
    organizationStrategy: z.enum(['by-date', 'by-type', 'by-project', 'custom']).optional().describe("Strategy for organizing files")
  },
  ({ projectName, fileTypes, organizationStrategy }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are a file system organization expert. Help me organize my files IMMEDIATELY:

Project: ${projectName}
File Types: ${fileTypes}
${organizationStrategy ? `Organization Strategy: ${organizationStrategy}` : 'Organization Strategy: by-project'}

Follow these file organization steps:
1. Assessment:
   - Analyze current file structure in the relevant directories
   - Identify naming patterns and existing categories
   - Determine files that need organization based on project and types

2. Organization Plan:
   - Create a logical folder structure for the project
   - Develop consistent naming conventions
   - Plan for backup of original file arrangement if needed

3. Implementation Actions:
   - Create necessary directories with descriptive names
   - Move files to appropriate locations based on organization strategy
   - Rename files for consistency if needed
   - Remove duplicates and temporary files if found

4. Documentation:
   - Document the new file organization system
   - Create a reference guide for the folder structure
   - Note any special considerations for this project

Use filesystem tools to create directories, move files, and rename as needed. Begin by assessing the current state, then provide a clear organization plan and implementation steps. Don't wait for additional input - start organizing immediately.`
      }
    }]
  })
);

server.prompt(
  "meeting-scheduler",
  {
    meetingType: z.string().describe("Type or purpose of the meeting"),
    participants: z.string().describe("Names of people to invite, comma-separated"),
    duration: z.string().optional().describe("Meeting duration in minutes"),
    priority: z.enum(['high', 'medium', 'low']).optional().describe("Priority level of the meeting")
  },
  ({ meetingType, participants, duration, priority }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are a meeting coordination assistant. Schedule and prepare for the following meeting IMMEDIATELY:

Meeting Type: ${meetingType}
Participants: ${participants}
${duration ? `Duration: ${duration} minutes` : 'Duration: 30 minutes'}
${priority ? `Priority: ${priority}` : 'Priority: medium'}

Follow these meeting coordination steps:
1. Calendar Management:
   - Check my calendar for available time slots
   - Identify optimal meeting times based on priority and participant availability
   - Suggest 2-3 alternative time slots

2. Participant Coordination:
   - Create a list of all participants with contact details
   - Draft meeting invitation with clear purpose and expectations
   - Prepare personalized follow-ups for key participants

3. Meeting Preparation:
   - Create an agenda template for the meeting
   - Prepare any necessary pre-meeting materials or reading
   - Set up reminders and notifications

4. Follow-up Planning:
   - Create a template for meeting notes
   - Prepare action item tracking system
   - Schedule follow-up communications

Use calendar, contacts, and communication tools to coordinate effectively. Begin by checking availability and suggest specific meeting times. Draft the meeting invitation and agenda immediately.`
      }
    }]
  })
);

server.prompt(
  "task-prioritizer",
  {
    tasks: z.string().describe("List of tasks to prioritize, separated by commas"),
    timeAvailable: z.string().optional().describe("Available time in hours"),
    energyLevel: z.enum(['high', 'medium', 'low']).optional().describe("Current energy level")
  },
  ({ tasks, timeAvailable, energyLevel }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are a productivity and task management expert. Help me prioritize and plan my tasks IMMEDIATELY:

Tasks: ${tasks}
${timeAvailable ? `Available Time: ${timeAvailable} hours` : 'Available Time: flexible'}
${energyLevel ? `Energy Level: ${energyLevel}` : 'Energy Level: medium'}

Follow these task prioritization steps:
1. Task Analysis:
   - Evaluate each task for importance and urgency
   - Estimate time required for completion
   - Identify dependency relationships between tasks
   - Consider energy level requirements for optimal performance

2. Prioritization System:
   - Categorize tasks using Eisenhower Matrix (Important/Urgent)
   - Consider energy-task matching based on current energy level
   - Apply time-blocking technique for available hours
   - Build in buffer time for unexpected interruptions

3. Execution Plan:
   - Create a specific sequence for task completion
   - Recommend start times for each task
   - Suggest breaks and transitions between tasks
   - Identify tasks that can be delegated or automated

4. Progress Tracking:
   - Set up checkpoints for major task completions
   - Create a simple system to mark progress
   - Plan for end-of-day review and tomorrow's preparation

Use calendar for scheduling, file system for creating task documents, and communication tools for delegation. Begin by analyzing and categorizing the tasks, then provide a specific execution plan for today. Don't wait for additional input - provide the prioritized plan immediately.`
      }
    }]
  })
);

server.prompt(
  "contact-manager",
  {
    contactAction: z.enum(['organize', 'outreach', 'follow-up', 'group']).describe("Type of contact management needed"),
    contactCategory: z.string().describe("Category or purpose of contacts (e.g., clients, vendors, personal)"),
    messageTemplate: z.string().optional().describe("Whether a message template is needed (yes/no)")
  },
  ({ contactAction, contactCategory, messageTemplate }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You are a contact management and networking expert. Help me manage my contacts IMMEDIATELY:

Action Needed: ${contactAction}
Contact Category: ${contactCategory}
${messageTemplate ? `Message Template: ${messageTemplate}` : 'Message Template: Not required'}

Follow these contact management steps based on the action needed:

For organizing contacts:
- Review existing contacts in the specified category
- Suggest logical groupings and tags
- Create a system for maintaining contact information
- Recommend fields to include for each contact record
- Design a follow-up schedule system

For contact outreach:
- Develop a strategic outreach plan for the contact category
- Create a prioritized list of contacts to reach out to
- Draft personalized outreach message templates
- Set up a tracking system for responses
- Plan follow-up timing and escalation

For follow-ups:
- Review previous interaction history with contacts
- Create a system for tracking last contact dates
- Draft appropriate follow-up messages based on context
- Suggest optimal timing between follow-ups
- Design a nurturing communication schedule

For grouping contacts:
- Analyze contacts for common characteristics
- Create logical group structures
- Suggest naming conventions for groups
- Design communication strategies for each group
- Set up a system to maintain group relevance

Use contacts, WhatsApp, email, and file systems to implement the chosen strategy. Begin by analyzing the current contact situation, then provide a specific action plan for the requested contact action. Don't wait for additional input - start implementing immediately.`
      }
    }]
  })
);

const transport = new StdioServerTransport();
server.connect(transport);