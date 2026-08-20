# n8n-nodes-mem0

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-orange)
![npm version](https://img.shields.io/npm/v/@gladiator1st/n8n-nodes-mem0)
![License](https://img.shields.io/npm/l/@gladiator1st/n8n-nodes-mem0)

Official community node for **[Mem0](https://mem0.ai)** in **n8n**. The intelligent long-term memory layer for personalized AI Agents, user preferences, continuous session context, and semantic vector memory search.

---

## ⚡ Key Features

- **🧠 Auto Fact & Preference Extraction (`add`):** Ingest raw conversation messages and let Mem0's AI automatically extract and store persistent user facts and preferences.
- **🔍 Semantic Memory Search (`search`):** Search relevant memories using natural language queries to retrieve context before generating LLM responses.
- **👤 Multi-User & Agent Isolation:** Filter and manage memories by `userId`, `agentId`, or session `runId`.
- **🤖 Autonomous AI Agent Tool (`usableAsTool: true`):** Wire directly into LangChain AI Agents to give your agents persistent long-term memory across chat sessions!

---

## 📦 Installation

### In n8n UI (Self-Hosted / Cloud Verified)
1. Go to **Settings > Community Nodes**.
2. Click **Install a community node**.
3. Enter `@gladiator1st/n8n-nodes-mem0` and confirm.

---

## 🔑 Credentials Setup

1. Sign up or log into **[Mem0 Platform](https://app.mem0.ai)**.
2. Go to **API Keys** and generate a new key (e.g. `m0-...`).
3. In n8n, create a new credential for **Mem0 API** and paste your API key.

---

## 👨‍💻 Author

**Muhammad Qasim**
- GitHub: [@Gladiator1st](https://github.com/Gladiator1st)
- Email: qasimasif958@gmail.com

## 📄 License

[MIT](LICENSE)
