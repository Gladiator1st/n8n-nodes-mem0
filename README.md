# @gladiator1st/n8n-nodes-mem0

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-orange?style=flat-square)
[![npm version](https://img.shields.io/npm/v/@gladiator1st/n8n-nodes-mem0?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@gladiator1st/n8n-nodes-mem0)
[![npm downloads](https://img.shields.io/npm/dt/@gladiator1st/n8n-nodes-mem0?style=flat-square&color=blue)](https://www.npmjs.com/package/@gladiator1st/n8n-nodes-mem0)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

An all-in-one **n8n Community Node** for **[Mem0](https://mem0.ai)** — the intelligent memory layer for personalized AI Agents, persistent user profiles, and continuous session context.

---

## ⚡ Superpowers Included

```
                      ┌─────────────────────────────────────────────────────┐
                      │            @gladiator1st/n8n-nodes-mem0             │
                      └──────────────────────────┬──────────────────────────┘
                                                 │
                  ┌──────────────────────────────┴──────────────────────────────┐
                  ▼                                                             ▼
        🧠 Memory Operations                                           👤 User Operations
        • Add (Auto Fact & Preference Extraction)                       • Get User Profile & Metadata
        • Search (Semantic Natural Language Queries)                   • List Many Users
        • Get / Get Many (Batch Retrieval)                              • Delete User & Wipe Memory
        • Delete / Delete All (GDPR Compliance)                         • Multi-Tenant User Isolation
```

---

## 📦 Key Capabilities

- **🧠 Auto Fact & Preference Extraction (`Add`):** Feed conversational text or message transcripts, and Mem0's AI engine automatically extracts, deduplicates, and stores atomic user facts and preferences.
- **🔍 Semantic Memory Search (`Search`):** Query memories using natural language (e.g. *"What are the user's dietary preferences?"*) to retrieve the most relevant context before generating LLM responses.
- **👤 Multi-User & Multi-Agent Isolation:** Partition memories effortlessly by `userId`, `agentId`, or session runs to support multi-tenant chatbots and autonomous AI teams.
- **🤖 Autonomous AI Agent Tool (`usableAsTool: true`):** Connect directly into LangChain AI Agents as an autonomous memory retrieval and storage tool.

---

## 🚀 Installation

### In n8n UI (Community Nodes)
1. In your n8n instance, go to **Settings** ➔ **Community Nodes**.
2. Click **Install a community node**.
3. Enter:
   ```text
   @gladiator1st/n8n-nodes-mem0
   ```
4. Confirm the installation terms and click **Install**.

---

## 🔑 Credentials Setup

1. Sign up or log in at **[app.mem0.ai](https://app.mem0.ai)**.
2. Navigate to **API Keys** in your Mem0 dashboard and copy your API key (starts with `m0-...`).
3. In n8n, create a new credential for **Mem0 API** and paste your API key.

---

## 📖 Step-by-Step Usage Examples

### Example 1: Add a Memory (Automatic Fact & Preference Extraction)

This operation extracts user preferences and key facts automatically from free-form text or user messages.

```
┌──────────────────────────────┐
│ When Chat Message Received   │ ➔ User says: "I work as a software engineer in Seattle
└──────────────┬───────────────┘               and prefer oat milk in my latte."
               │
               ▼
┌──────────────────────────────┐
│ Mem0 (Resource: Memory)      │ ➔ Resource: Memory | Operation: Add
└──────────────┬───────────────┘   User ID: user_123
               │
               ▼
┌──────────────────────────────┐
│ Output: Extracted Fact IDs   │ ➔ Mem0 auto-extracts 2 distinct facts into vector memory!
└──────────────────────────────┘
```

#### Node Parameters:
- **Resource:** `Memory`
- **Operation:** `Add`
- **User ID:** `user_123`
- **Memory Content / Text:**
  ```text
  I am a senior AI software engineer living in Seattle. I prefer dark mode on all apps and only drink oat milk lattes.
  ```

#### Sample Output Returned by the Node:
```json
{
  "results": [
    {
      "id": "mem_89f1a23c-4b5d-4e6f-a1b2-c3d4e5f6a7b8",
      "memory": "Works as a senior AI software engineer in Seattle",
      "event": "ADD",
      "user_id": "user_123"
    },
    {
      "id": "mem_45e6b78a-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
      "memory": "Prefers dark mode on all applications",
      "event": "ADD",
      "user_id": "user_123"
    },
    {
      "id": "mem_12a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
      "memory": "Drinks only oat milk lattes",
      "event": "ADD",
      "user_id": "user_123"
    }
  ]
}
```

---

### Example 2: Semantic Memory Search (Context Retrieval for AI Chatbot)

Search stored user memories using natural language before invoking an LLM, giving the AI instant recall of user preferences.

```
┌──────────────────────────────┐
│ When Chat Message Received   │ ➔ User asks: "Can you recommend a breakfast place?"
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Mem0 (Resource: Memory)      │ ➔ Search Query: "What food and beverage does the user like?"
└──────────────┬───────────────┘   User ID: user_123 | Limit: 5
               │
               ▼
┌──────────────────────────────┐
│ AI Agent / OpenAI Model      │ ➔ System Prompt injected with retrieved memory:
└──────────────────────────────┘   "The user only drinks oat milk lattes..."
```

#### Node Parameters:
- **Resource:** `Memory`
- **Operation:** `Search`
- **User ID:** `user_123`
- **Search Query:** `What are the user's drink and workspace preferences?`
- **Limit:** `5`

#### Sample Output Returned by the Node:
```json
[
  {
    "id": "mem_12a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
    "memory": "Drinks only oat milk lattes",
    "score": 0.892,
    "user_id": "user_123",
    "created_at": "2026-09-01T10:15:30Z",
    "updated_at": "2026-09-01T10:15:30Z"
  },
  {
    "id": "mem_45e6b78a-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    "memory": "Prefers dark mode on all applications",
    "score": 0.741,
    "user_id": "user_123",
    "created_at": "2026-09-01T10:15:30Z",
    "updated_at": "2026-09-01T10:15:30Z"
  }
]
```

---

### Example 3: Personalized AI Chatbot with Continuous Memory Loop

Connect Mem0 to an AI Agent to build a continuous memory loop where the assistant recalls past context and writes new memories after every conversation.

```
                  ┌─────────────────────────────────────────────────┐
                  │           Chat Trigger (Webhook / Slack)        │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │      Mem0 Node: Search Memories                 │
                  │      (Query: {{ $json.message }}, User ID: 123) │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │      AI Agent / OpenAI Node                     │
                  │      Prompt: Answer user taking into account:   │
                  │      Context: {{ $json.memory }}                │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │      Mem0 Node: Add Memory                      │
                  │      (Content: {{ $json.message }}, UID: 123)   │
                  └─────────────────────────────────────────────────┘
```

#### Step-by-Step Flow:
1. **Search Context:** When a message arrives from `user_123`, the first **Mem0** node searches relevant past memories with `Operation: Search`.
2. **Personalized Response:** The **AI Agent** receives the retrieved memories in its system prompt and answers with full personal context.
3. **Save New Learnings:** A downstream **Mem0** node executes `Operation: Add` on the new user message so future conversations remember newly stated facts.

---

### Example 4: User Profile & Memory Lifecycle Management (GDPR Compliance)

Easily fetch all memories for a user or wipe a user's entire memory store upon request.

- **Retrieve All Memories for User:** Set `Resource: Memory`, `Operation: Get Many`, `User ID: user_123`, `Return All: true`.
- **Delete Single Memory:** Set `Resource: Memory`, `Operation: Delete`, `Memory ID: mem_12a3b4c5...`.
- **Wipe All User Data (GDPR Delete):** Set `Resource: Memory`, `Operation: Delete All`, `User ID: user_123`.

---

## 🛠️ Operations & Parameters Reference

| Resource | Operation | Description | Required Parameters |
| :--- | :--- | :--- | :--- |
| **Memory** | `Add` | Automatically extract and store facts from text | `Memory Content / Text` |
| **Memory** | `Search` | Semantic vector search for relevant memories | `Search Query` |
| **Memory** | `Get` | Retrieve a specific memory item by ID | `Memory ID` |
| **Memory** | `Get Many` | List all memories for a user or agent | — *(Optional `User ID`, `Agent ID`, `Limit`)* |
| **Memory** | `Delete` | Delete a specific memory item by ID | `Memory ID` |
| **Memory** | `Delete All` | Delete all memories for a user or agent | — *(Optional `User ID`, `Agent ID`)* |
| **User** | `Get Many` | List all tracked users in Mem0 | — |
| **User** | `Get` | Retrieve user profile metadata | `User ID` |
| **User** | `Delete` | Delete a user and wipe all associated memories | `User ID` |

---

## 👨‍💻 Author

**Muhammad Qasim**
- GitHub: [@Gladiator1st](https://github.com/Gladiator1st)
- Email: qasimasif958@gmail.com

---

## 📄 License

[MIT](LICENSE) © Muhammad Qasim
